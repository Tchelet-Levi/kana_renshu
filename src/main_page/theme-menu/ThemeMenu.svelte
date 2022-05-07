<script lang="ts">
  import { onMount } from "svelte";
  import type { Theme } from "../../global";
  import { theme } from "../appStore";
  import ThemeButton from "./ThemeButton.svelte";
  import { getThemeIconSVGPath } from "../application/application";

  export let isExpanded = false;

  let osBtnRef: ThemeButton;
  let lightBtnRef: ThemeButton;
  let darkBtnRef: ThemeButton;

  // Sets theme on startup
  function handleThemeRadioButtons() {
    const currentTheme = localStorage.getItem("theme");

    switch (currentTheme as Theme) {
      case "os":
        osBtnRef.setChecked(true);
        break;
      case "light-theme":
        lightBtnRef.setChecked(true);
        break;
      case "dark-theme":
        darkBtnRef.setChecked(true);
        break;
    }
  }

  function getCheckedButton(): ThemeButton {
    let refs = [osBtnRef, lightBtnRef, darkBtnRef];
    refs.forEach((ref) => {
      if (ref.isChecked() === true) return ref;
    });

    return null;
  }

  function setTheme(themeName: Theme) {
    theme.update((p) => themeName);
  }

  onMount(() => {
    handleThemeRadioButtons();
  });
</script>

<ul role="menu" class={`theme-switcher-list ${!isExpanded ? "under-header" : ""}`}>
  <li>
    <ThemeButton
      onChange={() => setTheme("os")}
      name="theme-radio"
      label="OS"
      id="theme-radio-os"
      bind:this={osBtnRef}
      --mask-url={`url(${getThemeIconSVGPath("os")})`}
    />
  </li>

  <li>
    <ThemeButton
      onChange={() => setTheme("light-theme")}
      name="theme-radio"
      label="Light"
      id="theme-radio-light"
      bind:this={lightBtnRef}
      --mask-url={`url(${getThemeIconSVGPath("light-theme")})`}
    />
  </li>
  <li>
    <ThemeButton
      onChange={() => setTheme("dark-theme")}
      name="theme-radio"
      label="Dark"
      id="theme-radio-dark"
      bind:this={darkBtnRef}
      --mask-url={`url(${getThemeIconSVGPath("dark-theme")})`}
    />
  </li>
</ul>

<style lang="scss">
  @use "../../scss/_variables.scss" as *;
  @use "../../scss/_themes.scss" as *;

  .theme-switcher-list.under-header {
    // Disable keyboard navigation
    visibility: hidden;

    // Not related to keyboard navigation, just looks nice.
    opacity: 0;

    // Push behind header
    transform: translateZ(-10px) translate(-50%, calc(-100% - 0.5rem));
  }

  .theme-switcher-list {
    position: absolute;

    top: 100%;
    left: 50%;

    transform: translateZ(-10px) translateX(-50%);

    display: flex;
    flex-direction: column;
    gap: 1rem;

    list-style-type: none;
    padding: 1rem;
    margin: 0;

    box-shadow: $box-shadow--1;
    background-color: var(--background-primary);

    opacity: 1;

    border-radius: $br--rounded;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    transition: transform 150ms ease;
    transition-property: visibility, transform, opacity;
    li {
      display: contents;
      // width: 100%;
    }
  }

  @media (max-width: 992px) {
    .theme-switcher-list {
      transform: translateX(-50%) translateY($space-from-header);

      border-radius: $br--rounded;
      box-shadow: $box-shadow--4;
    }

    .theme-switcher-list.under-header {
      transform: translate(-50%, calc(-100% - 0.5rem));
    }
  }
</style>
