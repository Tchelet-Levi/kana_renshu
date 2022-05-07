<script lang="ts">
  import InlineIcon from "../components/InlineIcon.svelte";
  import { getIconPath } from "./application/application";
  import { clickOutside } from "../scripts/click_outside";

  let isHidden = true;

  // To show / hide the question about what to practice based on screen resolution
  window.onresize = () => (viewportWidth = window.innerWidth);
  let viewportWidth = window.innerWidth;

  $: icon = isHidden ? getIconPath()["help-circle-outline"] : getIconPath()["close-outline"];

  function onClick() {
    isHidden = !isHidden;
  }
</script>

<div
  class={`info-wrapper ${isHidden ? "relative" : ""}`}
  use:clickOutside
  on:outclick={() => (isHidden = true)}
>
  <div class={`info-card ${isHidden ? "not-expanded" : "expanded"}`}>
    <button
      class="info-button"
      aria-label="Frequently Asked Questions"
      aria-expanded={!isHidden}
      on:click={onClick}
      ><InlineIcon --mask-url={`url(${icon})`} --margin-right="0" --icon-size="1.75rem" /></button
    >
    {#if !isHidden}
      <div class="info-container" tabindex="0">
        <h2 class="title">FAQ</h2>
        <hr />

        <!-- Question about practice -->
        {#if viewportWidth < 992}
          <section>
            <h2>Can I choose what to practice?</h2>
            <p>Yes! Head over to the Options menu to customize your quiz.</p>
          </section>
        {/if}

        <section>
          <h2>What is a monograph?</h2>
          <p>Simply put, a monograph is a single character with no diacritics added to it.</p>
        </section>

        <section>
          <h2>What are diacritics?</h2>
          <p>
            Diacritics are marks that when placed next to a monograph, change the way it is read.<br
            />
            Japanese has only two types of diacritics:
          </p>
          <ol>
            <li>
              <span class="item">
                Dakuten ( ﾞ )<span class="subtext">also colloquially referred to as "Tenten"</span>
              </span>
            </li>
            <li>
              <span class="item">
                Handakuten ( ﾟ )<span class="subtext">also colloquially referred to as "Maru"</span>
              </span>
            </li>
          </ol>
        </section>

        <section>
          <h2>What are digraphs?</h2>
          <p>
            Digraphs are two characters that when used together form a new sound.<br />
          </p>
          <p>
            The second letter in a digraph is always smaller. <br />
            For example よ vs ょ.
          </p>
        </section>

        <!-- Question about practice -->
        {#if viewportWidth >= 992}
          <section>
            <h2>Can I choose what to practice?</h2>
            <p>
              Yes! Use the options menu above as well as the menu to your left in order to customize
              your quiz preferences.
            </p>
          </section>
        {/if}

        <section>
          <h2>Who made this?</h2>
          <p>Hi there! My name is Tchelet but my friends call me Mizu.</p>
          <p>
            I'm an aspiring web developer from Israel! <br />I made this little app to learn
            <a href="https://svelte.dev/" target="_blank" rel="noreferrer">Svelte</a>
            and CSS (and boy did I learn a lot).
          </p>
          <p>
            Learning Japanese has been a hobby of mine for a few years now, so naturally I wanted to
            work on something that combined two of my favorite hobbies.
          </p>
          <p>
            I'm hoping this website can be a nice place for learners, which is why I'm not including
            any ads of any kind.
          </p>
          <p>Have fun! :)</p>
        </section>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "../scss/_variables" as *;
  @use "../scss/_themes" as *;

  $card-padding: 2rem;

  .item {
    display: block;
    font-size: 1rem;
    font-weight: 400;
    margin-top: 1rem;
  }

  h2 {
    margin-top: 0;
    font-size: 1.125rem;

    font-weight: 700;
  }

  :global(.dark-theme .info-wrapper .info-container h2) {
    color: var(--primary-color--500);
  }

  :global(.light-theme .info-wrapper .info-container h2) {
    color: var(--primary-color--600);
  }

  .title {
    font-size: 2rem;
  }

  hr {
    margin-bottom: 2rem;
    margin-top: 1rem;
  }

  p {
    margin-top: 0.5rem;
  }

  section {
    margin-bottom: 3rem;
  }

  section:last-child,
  p:last-child,
  h3:last-child,
  ol,
  h2 {
    margin-bottom: 0;
  }

  .info-button {
    display: flex;

    justify-content: center;
    align-items: center;
    align-self: flex-end;

    padding: 0;

    background-color: transparent;

    border: none;

    cursor: pointer;
  }

  .expanded .info-button {
    padding: 1rem;
  }

  .info-card {
    position: absolute;

    z-index: 2;

    display: flex;
    flex-direction: column;

    font-size: 1rem;
    line-height: 1.5;

    border-radius: $br--rounded;

    background-color: var(--background-primary);
  }

  .expanded {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    margin: 0.5rem;
    margin-top: 3.75rem;

    box-shadow: $box-shadow--4;
  }

  .not-expanded {
    top: 0;
    left: 0;

    // TranslateY lineheight or something idk why its not centered
    transform: translateX(-100%) translateY(-0.125rem);

    margin-top: 2rem;
    margin-left: -2rem;
  }

  .relative {
    position: relative;
  }

  .info-container {
    padding: $card-padding;
    padding-top: calc($card-padding / 2);

    overflow-y: auto;

    width: 100%;
  }

  .subtext {
    display: block;
    font-size: 0.875rem;
  }

  @media (min-width: $breakpoint--min-desktop) {
    .info-button {
      padding: 0.5rem;
    }

    .info-card {
      max-width: fit-content;
      height: fit-content;
      max-height: calc((var(--vh) * 100) - 4rem);
    }

    .expanded {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 80ch;
    }

    .not-expanded {
      // I don't know where I messed up but can't go to the right.
      // So gonna reverse left instead..
      margin: 0;
      left: 0;

      $margin-to-left: 1.75rem;
      transform: translateX(calc(100% - #{$margin-to-left}));

      box-shadow: $box-shadow--2;
    }
  }
</style>
