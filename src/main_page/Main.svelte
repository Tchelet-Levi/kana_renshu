<script lang="ts">
  // Layout
  import QuizMenu from "./QuizMenu.svelte";
  import QuizBox from "./QuizBox.svelte";
  import UserInput from "./UserInput.svelte";
  import Header from "./Header.svelte";
  import MediaQuery from "../components/MediaQuery.svelte";
  import ButtonText from "../components/buttons/ButtonText.svelte";

  // Application
  import {
    evaluateAnswer,
    generatePool,
    generateQuestion,
    getIconPath,
    getOSTheme,
    isUsingTouchScreen as isTouchScreen,
  } from "./application/application";
  import characterDictionary from "./application/character_dictionary.json";
  import {
    quizOptionsStore,
    theme as themeStore,
    userSettings as userSettingsStore,
  } from "./appStore";
  import type { QuizMenuOptions, Theme, UserSettings } from "../global";
  import { onDestroy, onMount } from "svelte";
  import Tooltip from "./Tooltip.svelte";
  import { clickOutside } from "../scripts/click_outside_no_focus";
  import Switch from "../components/switch/Switch.svelte";
  import Info from "./Info.svelte";

  // Components
  let inputComponent: UserInput;
  let quizBoxComponent: QuizBox;

  // Consts
  const placeholderDefaultText = "Answer in rōmaji";

  // Internal state
  let userInput = "";
  let score = [0, 0];
  let prevQuestion = "";
  let question = "";
  let answer = "";
  let hasAnsweredCorrectly = true;
  let pool = {};
  let isRevealed = false;
  let placeholderText = placeholderDefaultText;

  // Handle touch screens
  let isUsingTouchScreen = false;
  let showAutofillWarning = false;
  let wasShownWarning = false;

  $: classAutocorrectWarning = isUsingTouchScreen && showAutofillWarning ? "" : "display-none";
  $: errorColor = hasAnsweredCorrectly ? "" : "var(--error)";

  // If on touch screen
  isUsingTouchScreen = isTouchScreen();

  function handleOnFocus() {
    // Scroll into view when focusing
    // On mobile the screen gets resized to fit the screen.
    // Find a more clever way to fire scrollIntoView ONCE it is no longer resizing.
    // ..or leave it like this?
    if (isUsingTouchScreen) {
      setTimeout(() => {
        quizBoxComponent.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }, 500);
    }

    // Display warning if wasn't already shown to user before.
    if (!wasShownWarning && userSettings.showAutocorrectWarning) {
      showAutofillWarning = true;
      wasShownWarning = true;
    }
  }

  function onClickOutside() {
    // Check if we focused yet. Only disable if we already focused once.
    if (wasShownWarning) {
      disableAutocorrectWarning();
    }
  }

  function disableAutocorrectWarning() {
    showAutofillWarning = false;
    userSettingsStore.update((settings) => {
      return { ...settings, showAutocorrectWarning: false };
    });
  }

  // Stores
  let userSettings: UserSettings;
  const unsubscribeUserSettings = userSettingsStore.subscribe((value) => {
    // Update local variable
    userSettings = value;
  });

  let theme: Theme;
  let currTheme: Theme;
  const unsubscribeTheme = themeStore.subscribe((value) => {
    theme = value;
    currTheme = theme;

    if (currTheme === "os") currTheme = getOSTheme();
  });

  // Get quiz options
  let quizOptions: QuizMenuOptions;
  const unsubscribeQuizOptions = quizOptionsStore.subscribe((value) => {
    // Update value
    quizOptions = value;

    // Regenerate pool
    pool = generatePool(quizOptions, characterDictionary);

    // If user changed the selection, regenerate a question.
    if (question === null) {
      ({ question, answer } = generateQuestion(pool));
    }
  });

  function onRevealClick(e) {
    if (!isRevealed) {
      isRevealed = true;

      // Add 1 to wrong answers
      return score[1]++;
    }

    if (isRevealed) {
      // Make a new question
      ({ question, answer } = generateQuestion(pool));

      // Forget previous answer, to reset the green color, and change the placeholder to the default.
      placeholderText = placeholderDefaultText;
      hasAnsweredCorrectly = true;

      // Reset input
      userInput = "";

      // Focus on the input again
      inputComponent.focus();

      // set isRevealed to be false again
      return (isRevealed = false);
    }
  }

  const updateUserInput = (e: any) => {
    const currentValue = e.currentTarget.value;
    const prevUserInput = userInput;

    // Disable the popup
    disableAutocorrectWarning();

    // Anything BUT a-zA-z
    const illegalCharacter = new RegExp("[^a-zA-z]");

    if (!userSettings.forceRomajiInput) {
      return (userInput = currentValue);
    }

    if (!illegalCharacter.test(currentValue)) {
      userInput = currentValue;
    } else {
      userInput = prevUserInput;
      e.target.value = prevUserInput;
    }
  };

  function userInputKeypress(e: any) {
    if (e.key === "Enter" || (userSettings.spacebarAnswers && e.key === " ")) {
      handleInputSubmit();
    }
  }

  function handleInputSubmit() {
    // Check if user has inputted anything
    if (userInput.length === 0) return;

    // Evaluate
    const isCorrect = evaluateAnswer(userInput, answer);

    if (isCorrect) {
      // Increment score
      score[0]++;

      // Generate a new question and avoid getting the same question again
      do {
        ({ question, answer } = generateQuestion(pool));
      } while (question === prevQuestion);

      // Avoids infinite loop
      if (question !== null) prevQuestion = question;

      hasAnsweredCorrectly = true;

      // Update placeholder text
      placeholderText = placeholderDefaultText;

      // This is here to fix animation carrying over from previous question
      quizBoxComponent.nextQuestion();
    } else {
      score[1]++;
      quizBoxComponent.shake();

      hasAnsweredCorrectly = false;

      // Update placeholder text
      const incorrectAnswer =
        userInput.length > 4
          ? `${userInput.toLowerCase().substring(0, 4)}...`
          : userInput.toLowerCase();
      placeholderText = `'${incorrectAnswer}' was incorrect.`;
    }

    // Make input field empty again
    userInput = "";
  }

  // Handle romaji checked
  let prevRomajiValue = userSettings.forceRomajiInput;
  // When forceFomajiInput changes, if it isn't the same as the preivous one, userInput=""
  $: {
    if (userSettings.forceRomajiInput !== prevRomajiValue) {
      prevRomajiValue = userSettings.forceRomajiInput;
      userInput = "";
    }
  }

  let showWelcomeScreen: boolean = true;
  const handleGoClick = (e) => {
    showWelcomeScreen = false;
    if (quizBoxComponent.isDontShowAgainChecked()) {
      userSettingsStore.update((settings) => {
        return {
          ...settings,
          showWelcomeScreen: false,
        };
      });
    }
  };

  onMount(() => {
    // Generate quiz on mount
    pool = generatePool(quizOptions, characterDictionary);
    ({ question, answer } = generateQuestion(pool));
    prevQuestion = question;

    // Initialize show welcome screen bool to whatever was in store.
    showWelcomeScreen = $userSettingsStore.showWelcomeScreen;
  });

  onDestroy(() => {
    unsubscribeQuizOptions();
    unsubscribeUserSettings();
    unsubscribeTheme();
  });
</script>

<!-- HTML -->
<svelte:head>
  <title>Kana Renshū</title>
</svelte:head>

<div class="app">
  <!-- Header -->
  {#if !showWelcomeScreen}
    <header><Header /></header>
  {/if}

  <!-- Main -->
  <main>
    <!-- Autocorrect warning -->
    <!-- <div class="autocorrect">
      <div class={`autocorrect-warning ${classAutocorrectWarning}`}>
        <Tooltip iconPath={getIconPath().alert} --arrow-position="100%" --position="static"
          >Please make sure to disable auto-correct.</Tooltip
        >
      </div>
      <div class={`autocorrect-backdrop ${classAutocorrectWarning}`} />
    </div> -->

    <!-- Info -->
    {#if !showWelcomeScreen}
      <div class="info">
        <Info />
      </div>

      <!-- Quiz Menu -->
      <div class="quiz-menu"><QuizMenu /></div>
    {/if}

    <!-- Quiz box -->
    <div class="quiz-box">
      <QuizBox
        bind:this={quizBoxComponent}
        {score}
        {answer}
        {question}
        showAnswer={isRevealed}
        {showWelcomeScreen}
        onClick={handleGoClick}
      >
        <div class="user-input-container" use:clickOutside on:outclick={onClickOutside}>
          <!-- Answer input field -->
          <UserInput
            placeholder={placeholderText}
            onInput={updateUserInput}
            onKeypress={userInputKeypress}
            onFocus={handleOnFocus}
            value={userInput}
            disabled={isRevealed || !question}
            spellCheck={false}
            bind:this={inputComponent}
            --underline-color={errorColor}
          />

          <!-- Reveal answer button -->
          <div class="quiz-box-btn">
            <ButtonText onClick={onRevealClick} disabled={!question}
              >{isRevealed ? "Next" : "Skip"}</ButtonText
            >
          </div>
        </div>
      </QuizBox>
    </div>
  </main>
  <footer>
    <div class="credits">
      <span
        >Made by <a
          href="https://www.linkedin.com/in/tchelet-levi
        "
          target="_blank"
          rel="noopener">Tchelet Levi</a
        ></span
      >
      <br />
      <span>I hope you find this tool useful! :)</span>
    </div>
  </footer>
</div>

<!-- SCSS -->
<style lang="scss">
  @use "../scss/_variables.scss" as *;
  @use "../scss/_themes.scss" as *;

  $main-max-width: 30rem;

  :global(body) {
    background-color: var(--background-secondary);
  }

  .app {
    display: flex;
    flex-direction: column;

    height: 100%;

    background-color: var(--background-secondary);
  }

  header {
    scroll-snap-align: start;
  }

  main {
    margin: 1rem;

    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-areas:
      "menu quizbox info"
      "menu quizbox info";
  }

  footer {
    margin-top: auto;
    padding: 1rem;

    text-align: center;
    font-size: 0.875rem;

    scroll-snap-align: start;
  }

  .quiz-box {
    width: 100%;
    max-width: $main-max-width;

    margin: 0 auto;
    grid-area: quizbox;
  }

  .quiz-box-btn {
    display: inline-flex;
    align-items: center;

    margin-left: 1rem;
  }

  .quiz-menu {
    display: none;
    grid-area: menu;
  }

  .user-input-container {
    position: relative;
    display: flex;

    align-items: baseline;

    margin: 0 auto;
    margin-top: 1rem;

    width: 100%;
    max-width: $main-max-width;

    grid-area: input;
  }

  .autocorrect-backdrop {
    position: fixed;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: black;
    opacity: 0.75;

    z-index: 5;

    pointer-events: none;
  }

  .autocorrect-warning {
    position: fixed;

    bottom: 0;
    right: 0;

    margin-right: 0.5rem;
    transform: translateY(50%);

    z-index: 6;
  }

  .display-none {
    display: none;
  }

  .info {
    grid-area: info;
  }

  // Large devices (desktops, 992px and up)
  @media (min-width: $breakpoint--min-desktop) {
    main {
      display: grid;
      grid-template-columns: 1fr $main-max-width 1fr;
      grid-template-areas:
        "menu quizbox info"
        "menu quizbox info";

      margin: 2rem;
    }

    .quiz-menu {
      display: block;
      justify-self: end;

      margin-right: 5rem;
    }
  }
</style>
