<script lang="ts">
  import { userSettings } from "./appStore";
  import { onMount, tick } from "svelte";

  import ButtonPrimary from "../components/buttons/ButtonPrimary.svelte";
  import Checkbox from "../components/checkbox/Checkbox.svelte";
  import HoverTooltip from "../components/HoverTooltip.svelte";
  import {
    getMobileOperatingSystem,
    getUserOS,
    isUsingTouchScreen,
  } from "./application/application";
  export let onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = undefined;
  export let showAnswer: boolean = false;
  export let showWelcomeScreen: boolean;
  export let score: number[];
  export let question: string;
  export let answer: string;
  export const shake = () => (isAnimating = true);
  export const nextQuestion = () => {
    isAnimating = false;
  };

  export const isDontShowAgainChecked = () => {
    return dontShowAgainChecked;
  };

  // States
  let isTouchScreen: boolean = isUsingTouchScreen();
  let dontShowAgainChecked: boolean = false;
  let isAnimating = false;
  let isTransitioning = false;
  // Delayed answer only gets updated when transition ends.
  // This is here as to not spoil the answer when going to next question after a reveal.
  let delayedAnswer = answer;

  let quizBoxElement: HTMLElement;
  export const scrollIntoView = (arg?: boolean | ScrollIntoViewOptions) => {
    quizBoxElement.scrollIntoView(arg);
  };

  function handleAnswer() {
    if (showAnswer) {
      delayedAnswer = answer;
    }
  }

  const osSpecificEnter = () => {
    const mobileOS = getMobileOperatingSystem();
    const desktopOS = getUserOS();

    // Look for Apple products
    if (mobileOS === "iOS") return "return";
    if (desktopOS === "MacOS") return "↩ return";

    // Everything else
    return "↵ Enter";
  };

  const onAnimationEnd = async (e) => {
    await tick();
    e.currentTarget.classList.remove("animate-shake");
    isAnimating = false;
  };

  onMount(() => {
    showWelcomeScreen = $userSettings.showWelcomeScreen;
  });
</script>

<div class={`quiz-box-wrapper`} bind:this={quizBoxElement}>
  <!-- Welcome page -->
  {#if showWelcomeScreen}
    <div class="welcome-container">
      <h1>Welcome!</h1>
      <p>This app helps you memorize Hiragana and Katakana through short quizzes.</p>
      <p>
        Simply type the character you see in Rōmaji <em>(The Latin alphabet)</em> and press
        <kbd>{osSpecificEnter()}</kbd> to answer.
      </p>
      <p>
        If you find yourself stuck, press <strong>"SKIP"</strong> to reveal the answer, and
        <strong>"NEXT"</strong> to go to the next question.
      </p>
      <p class="gl">Good luck!</p>

      <!-- If using touch screen, show autocorrect warning -->
      {#if isTouchScreen}
        <div class="mobile-warning">
          <h3 class="auto-correct-warning-h3">Note for mobile users</h3>
          <p class="auto-correct-warning">Please disable auto-correct.</p>
        </div>
      {/if}

      <!-- Input -->
      <div class="welcome-input">
        <div class="checkbox">
          <Checkbox
            label="Don't show this again"
            onChange={(e) => (dontShowAgainChecked = e.currentTarget.checked)}
          />
        </div>
        <div class="button">
          <ButtonPrimary {onClick}>Let's go!</ButtonPrimary>
        </div>
      </div>
    </div>
  {:else}
    <!-- Box -->
    <div class="quiz-box">
      <!-- Score -->
      <span class="score" id="score">
        <span class={`${score[0] > 0 ? "right" : ""}`}>{score[0]}</span> -
        <span class="wrong">{score[1]}</span>
      </span>

      <!-- Question -->
      {#if question}
        <h1
          class={`question ${isAnimating && "animate-shake"}`}
          id="question"
          on:animationend={onAnimationEnd}
        >
          {question}
        </h1>
        <h1
          class={`answer ${showAnswer && "visible"}`}
          id="answer"
          on:transitionend={() => {
            isTransitioning = false;
            delayedAnswer = answer;
          }}
          on:transitionstart={() => {
            isTransitioning = true;
            handleAnswer();
          }}
        >
          {delayedAnswer}
        </h1>
      {:else}
        <p class="error">Please select at least one subject to be quizzed on.</p>
      {/if}
    </div>

    <!-- Inputs, etc -->
    <slot />
  {/if}
</div>

<style lang="scss">
  @use "../scss/_variables" as *;
  @use "../scss/_themes" as *;

  $box-padding: 2rem;

  :global(.dark-theme .mobile-warning) {
    --warning-box-bg: hsl(265, 75%, 38%);
  }

  :global(.light-theme .mobile-warning) {
    border: dashed #f20071 0.125rem;
    --warning-box-bg: #fce4ee;
  }

  .quiz-box-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;

    background-color: var(--background-primary);

    padding: $box-padding;
    margin: 0 auto;

    box-shadow: $box-shadow--2;
    border-radius: $br--rounded;

    overflow: hidden;

    // Scroll behavior
    scroll-snap-align: end;
    scroll-padding-bottom: 0.25rem;
  }

  // Welcome
  .welcome-container {
    display: flex;
    flex-direction: column;

    line-height: 1.75;

    h1 {
      text-align: center;
      margin-top: 0;
      margin-bottom: 1.25rem;
    }

    p {
      margin-top: 0;
      margin-bottom: 1.5rem;
    }
  }

  .mobile-warning {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;

    font-size: 1rem;

    margin-bottom: 2rem;

    $border-length: 0.25rem;
    border-radius: $br--rounded;

    padding: 1rem;
    background-color: var(--warning-box-bg);

    p {
      margin: 0;
    }

    .auto-correct-warning-h3 {
      font-size: inherit;
      margin: 0;
    }
  }

  .welcome-input {
    display: flex;
    flex-direction: column;

    .checkbox {
      order: 2;

      margin-top: 1.5rem;
    }

    .button {
      display: contents;
    }
  }

  // Box
  .quiz-box {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;

    text-align: center;

    min-height: 14rem;

    overflow: hidden;

    flex-grow: 1;
  }

  .score {
    position: absolute;

    top: 0;
    right: 0;
    left: 0;

    font-size: 1.125rem;
  }

  .question {
    font-size: 6rem;
    margin: 0.5rem;
  }

  .answer {
    position: absolute;

    bottom: 0;
    right: 0;
    left: 0;

    transform: translateY(2.75rem);
    opacity: 0;

    text-align: center;

    font-size: 1.25rem;
    font-weight: 400;
    color: var(--text-primary);

    transition: all 250ms ease;
    transition-property: opacity, transform, color;
  }

  .right {
    color: var(--primary-color--500);
    font-weight: 400;
  }

  .visible {
    transform: none;
    opacity: 1;
  }

  .animate-shake {
    animation-name: shake;
    animation-duration: 500ms;
    animation-timing-function: cubic-bezier(0.85, 0.15, 0.27, 0.76);
  }

  @keyframes shake {
    2% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    4% {
      transform: translate(0px, 1px) rotate(0.5deg);
    }

    6% {
      transform: translate(0px, 1px) rotate(0.5deg);
    }

    8% {
      transform: translate(1px, 0px) rotate(0.5deg);
    }

    10% {
      transform: translate(0px, 0px) rotate(0.5deg);
    }

    12% {
      transform: translate(1px, 0px) rotate(0.5deg);
    }

    14% {
      transform: translate(1px, 0px) rotate(0.5deg);
    }

    16% {
      transform: translate(0px, 1px) rotate(0.5deg);
    }

    18% {
      transform: translate(0px, 1px) rotate(0.5deg);
    }

    20% {
      transform: translate(0px, 1px) rotate(0.5deg);
    }

    22% {
      transform: translate(0px, 1px) rotate(0.5deg);
    }

    24% {
      transform: translate(0px, 0px) rotate(0.5deg);
    }

    26% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    28% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    30% {
      color: var(--error);
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    32% {
      transform: translate(1px, 0px) rotate(0.5deg);
    }

    34% {
      transform: translate(0px, 1px) rotate(0.5deg);
    }

    36% {
      transform: translate(0px, 1px) rotate(0.5deg);
    }

    38% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    40% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    42% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    44% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    46% {
      transform: translate(1px, 0px) rotate(0.5deg);
    }

    48% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    50% {
      color: var(--error);
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    52% {
      transform: translate(1px, 0px) rotate(0.5deg);
    }

    54% {
      transform: translate(0px, 1px) rotate(0.5deg);
    }

    56% {
      transform: translate(0px, 0px) rotate(0.5deg);
    }

    58% {
      transform: translate(0px, 0px) rotate(0.5deg);
    }

    60% {
      color: var(--error);
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    62% {
      transform: translate(0px, 0px) rotate(0.5deg);
    }

    64% {
      transform: translate(1px, 0px) rotate(0.5deg);
    }

    66% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    68% {
      transform: translate(1px, 0px) rotate(0.5deg);
    }

    70% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    72% {
      transform: translate(0px, 0px) rotate(0.5deg);
    }

    74% {
      transform: translate(1px, 0px) rotate(0.5deg);
    }

    76% {
      transform: translate(0px, 1px) rotate(0.5deg);
    }

    78% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    80% {
      transform: translate(0px, 0px) rotate(0.5deg);
    }

    82% {
      transform: translate(1px, 0px) rotate(0.5deg);
    }

    84% {
      transform: translate(0px, 0px) rotate(0.5deg);
    }

    86% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    88% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    90% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    92% {
      transform: translate(0px, 0px) rotate(0.5deg);
    }

    94% {
      transform: translate(1px, 1px) rotate(0.5deg);
    }

    96% {
      transform: translate(0px, 1px) rotate(0.5deg);
    }

    98% {
      transform: translate(0px, 0px) rotate(0.5deg);
    }

    0%,
    100% {
      color: var(--text-primary);
      transform: translate(0, 0) rotate(0);
    }
  }

  @media (min-width: $breakpoint--min-desktop) {
    .quiz-box {
      min-height: 15rem;
    }

    .score {
      left: initial;
    }

    .welcome-container {
      text-align: start;
    }

    .checkbox {
      align-self: auto;
    }
  }
</style>
