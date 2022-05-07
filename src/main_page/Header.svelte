<script lang="ts">
  import QuizMenu from "./QuizMenu.svelte";
  import MediaQuery from "./../components/MediaQuery.svelte";

  import { clickOutside } from "../scripts/click_outside";
  import ThemeButton from "./theme-menu/ThemeButton.svelte";
  import type { Theme } from "../global";
  import ThemeMenu from "./theme-menu/ThemeMenu.svelte";
  import InlineIcon from "../components/InlineIcon.svelte";
  import { theme as themeStore } from "./appStore";
  import { onDestroy, onMount } from "svelte";
  import { getIconPath, getThemeIconSVGPath } from "./application/application";
  import OptionsDropdownMenu from "./options-menu/OptionsDropdownMenu.svelte";

  let themeIconPath: string;
  let theme: Theme;

  const unsubThemeStore = themeStore.subscribe((value) => {
    theme = value;
    themeIconPath = getThemeIconSVGPath(theme);
  });

  let themeSwitcherMenuExpanded = false;
  let optionsExpanded = false;

  const toggleThemeSwitcher = () => (themeSwitcherMenuExpanded = !themeSwitcherMenuExpanded);

  onMount(() => (themeIconPath = getThemeIconSVGPath(theme)));
  onDestroy(unsubThemeStore);
</script>

<div class="header-wrapper">
  <div class="header-container">
    <!-- Options menu -->
    <div class="expandable-menu" use:clickOutside on:outclick={() => (optionsExpanded = false)}>
      <button
        aria-haspopup="menu"
        aria-expanded={optionsExpanded ? "true" : "false"}
        on:click={() => (optionsExpanded = !optionsExpanded)}
      >
        <InlineIcon --mask-url={`url(${getIconPath()["settings-sharp"]})`} />
        Options
      </button>

      <div class="options-dropdown-menu-container">
        <OptionsDropdownMenu isExpanded={optionsExpanded} />
      </div>
    </div>

    <!-- Theme switcher -->
    <div
      class="theme-switcher-menu"
      use:clickOutside
      on:outclick={() => (themeSwitcherMenuExpanded = false)}
    >
      <button
        class="theme-button"
        aria-haspopup="menu"
        aria-expanded={themeSwitcherMenuExpanded ? "true" : "false"}
        on:click={toggleThemeSwitcher}
      >
        <InlineIcon --mask-url={`url(${themeIconPath})`} />
        Theme
      </button>
      <ThemeMenu isExpanded={themeSwitcherMenuExpanded} />
    </div>
  </div>
</div>

<style lang="scss">
  @use "../scss/_variables.scss" as *;
  @use "../scss/_themes.scss" as *;

  $button-margin: 0.25rem;

  button {
    position: relative;
    display: flex;
    align-items: center;

    color: inherit;
    background: none;
    border: none;

    margin: 0.25rem;

    border-radius: $br--rounded;
    cursor: pointer;

    padding: (1rem - $button-margin) (1.25rem - $button-margin);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      // margin: 0.25rem;

      border-radius: $br--rounded;
      background-color: var(--text-primary);
      opacity: 0;
      z-index: -1;

      transition: opacity 50ms ease;
    }

    &:focus {
      outline: solid 2px var(--text-primary);
    }

    &:hover::before,
    &:focus::before {
      opacity: 0.1;
    }

    &:focus::before {
      outline: var(--text-primary) solid 1px;
    }
  }

  .header-wrapper {
    position: relative;

    display: flex;
    justify-content: center;
    width: 100%;

    z-index: 10;

    // This is here as a workaround stacking contexts.
    // Since every child creates its own stacking context,
    // We can't use z-index.
    // Instead every child wil preserve-3d until the menu will be transformZ(-10px)
    transform-style: preserve-3d;

    box-shadow: $box-shadow--1;
    color: var(--text-primary);
    background-color: var(--background-primary);
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1500px;

    padding: 0 0.75rem;

    transform-style: inherit;
  }

  .expandable-menu {
    display: contents;
  }

  .options-dropdown-menu-container {
    display: contents;
  }

  .theme-switcher-menu {
    position: relative;
    transform-style: inherit;
  }

  @media (min-width: $breakpoint--min-desktop) {
    .header-container {
      padding: 0 1.25rem;
    }
  }
</style>
