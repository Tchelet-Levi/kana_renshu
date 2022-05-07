<script lang="ts">
  export let onChange: svelte.JSX.FormEventHandler<HTMLInputElement> = undefined;
  export let checked = undefined;
  export let label: string;
  export let description: string = undefined;
</script>

<label class="switch">
  <input class="switch-input" type="checkbox" on:change={onChange} bind:checked />
  <span class={`slider ${checked ? "checked" : ""}`} />
  <!-- Label of the switch -->
  <p class="text">{label}</p>

  <!-- This is here for screen readers to stop talking after the label is read -->
  <span class="fullstop">.</span>

  <!-- Description -->
  <p class="description">{description ? description : ""}</p>
</label>

<style lang="scss">
  $default-scale: 1.25rem;
  $side-margins: calc($default-scale / 8);

  .switch {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "slider label"
      ". description";

    cursor: pointer;
    user-select: none;

    align-items: end;
  }

  .description {
    grid-area: description;

    font-size: 0.875rem;
    color: var(--text-secondary);

    margin: 0;
  }

  .text {
    grid-area: label;
    margin: 0;
  }

  .switch-input {
    // I want these to be selectable through keyboard so no display: none or visibility: hidden.

    // This is enough for chrome.
    height: 0px;
    width: 0px;

    // Firefox support
    // Firefox doesn't allow height or width to go below 4px.
    // To fix this, take it out of the document flow and scale it to 0, hiding it.
    // Still keyboard selectable this way!
    position: absolute;
    transform: scale(0);

    grid-area: slider;

    &:hover + .slider::after {
      opacity: 0.1;
    }

    &:focus + .slider::after {
      opacity: 0.3;
    }
  }

  .slider {
    position: relative;
    display: inline-block;

    --side-margins: calc(var(--switch-size, #{$default-scale}) / 8);

    height: var(--switch-size, $default-scale);
    width: calc(var(--switch-size, $default-scale) * 2);

    margin-right: 1rem;
    transform-style: preserve-3d;

    background-color: #777;

    border-radius: 999999px;

    grid-area: slider;

    transition: background-color 100ms ease;
    // Switch itself
    // Currently not using &::after, but otherwise, add &::after to this with a ,
    &::before {
      content: "";

      position: absolute;
      top: 50%;
      left: 0;

      margin: 0 var(--side-margins, $side-margins);

      background-color: white;
      border-radius: 99999px;

      width: calc(var(--switch-size, $default-scale) * 0.75);
      height: calc(var(--switch-size, $default-scale) * 0.75);

      transform: translateY(-50%);
      transition: transform 100ms ease;
      z-index: 2;
    }

    &::after {
      content: "";
      position: absolute;

      top: 50%;

      width: calc(var(--switch-size, $default-scale) * 0.75);
      height: calc(var(--switch-size, $default-scale) * 0.75);
      margin: 0 var(--side-margins, $side-margins);

      border-radius: 999999px;

      --after-scale: 2.5;
      transform: translateY(-50%) translateZ(-10px) scale(var(--after-scale));

      opacity: 0;
      background-color: inherit;

      transition: all 100ms ease;
      transition-property: transform, background-color, opacity;
    }
  }

  // Has to be global due to scoped css :(
  :global(.dark-theme .slider.checked) {
    background-color: var(--primary-color--800);
  }

  :global(.light-theme .slider.checked) {
    background-color: var(--primary-color--500);
  }

  .checked {
    &::before {
      transform: translateY(-50%) translateX(calc(100% + (var(--side-margins, $side-margins) * 2)));
    }

    &::after {
      transform: translateY(-50%) translateZ(-10px)
        translateX(calc(100% + (var(--side-margins, $side-margins) * 2))) scale(var(--after-scale));
    }
  }

  .fullstop {
    position: absolute;
    transform: scale(0);
  }
</style>
