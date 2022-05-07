<script lang="ts">
  // Imports
  import QuizMenu from "../QuizMenu.svelte";
  import UserSettingsMenu from "./UserSettingsMenu.svelte";

  // Props
  export let isExpanded: boolean = false;

  // States
  $: classExpanded = isExpanded ? "" : "under-header";
</script>

<!-- HTML -->
<div class={`options-dropdown-menu ${classExpanded}`}>
  <div class="content-wrapper">
    <!-- Quiz Options -->
    <div class="quiz-options-wrapper">
      <h2>Quiz Settings</h2>

      <div class="options-content">
        <QuizMenu />
      </div>
    </div>

    <!-- User Settings -->
    <div class="user-settings-wrapper">
      <h2>User Settings</h2>
      <div class="user-settings-content">
        <UserSettingsMenu />
      </div>
    </div>
  </div>
</div>

<!-- Style -->
<style lang="scss">
  @use "../../scss/_variables" as *;

  $padding: 1.5rem;
  $margin-left: 0.75rem;

  h2 {
    text-align: center;
    font-size: 1.25rem;
    font-weight: 400;

    margin-top: 0;
    margin-bottom: 2rem;
  }

  .options-content {
    // margin-left: 1rem;
    margin-bottom: 3rem;
    margin-left: $margin-left;
  }

  .user-settings-content {
    margin-left: $margin-left;
  }

  .content-wrapper {
    // display: flex;
    // flex-direction: column;

    padding-right: $padding;
    overflow: hidden;
    overflow-y: auto;
  }

  .options-dropdown-menu.under-header {
    // Disable keyboard navigation
    visibility: hidden;

    // Not related to keyboard navigation, just looks nice.
    opacity: 0;

    // Push behind header
    transform: translateZ(-10px) translate(0%, calc(-100% - 0.5rem));
  }

  .options-dropdown-menu {
    // bottom: 0; wouldn't work. Not with absolute or fixed. Solution below.
    position: absolute;

    top: 100%;
    left: 0;
    right: 0;

    display: flex;
    flex-direction: column;

    margin: 0 $space-from-header;
    padding: $padding;

    // The Problem: position: fixed or absolute wouldn't work with bottom: 0; because it is still relative to the header, and it doesn't stretch to the bottom of the viewport.
    // The Goal: Stretch to the full screen below header without using position properties.
    // The Solution: take up the full viewport height, subtract the parent's height from it,
    // then subtract the space from the header (margin from the margin) from both up and down.
    // Formula: 100vh - parent's height - (space from header both up and down).
    height: calc(100vh - 100% - ($space-from-header * 2));

    // Prefer the calculated VH for mobile
    --vh100: calc(var(--vh) * 100);
    height: calc(var(--vh100) - 100% - ($space-from-header * 2));

    background-color: var(--background-primary);

    transform: translateX(0) translateY($space-from-header);

    border-radius: $br--rounded;
    box-shadow: $box-shadow--4;

    transition: 150ms ease;
    transition-property: visibility, transform, opacity;
  }

  @media (min-width: $breakpoint--min-desktop) {
    .options-dropdown-menu {
      right: initial;

      height: initial;
      max-height: calc(100vh - 100% - ($space-from-header * 2));

      // Prefer the calculated VH for mobile
      --vh100: calc(var(--vh) * 100);
      max-height: calc(var(--vh100) - 100% - ($space-from-header * 2));

      max-width: 80ch;

      transform: translateX(0) translateY(0) translateZ(-10px);

      border-top-left-radius: 0;
      border-top-right-radius: 0;

      box-shadow: $box-shadow--1;
    }

    .quiz-options-wrapper {
      display: none;
    }
  }
</style>
