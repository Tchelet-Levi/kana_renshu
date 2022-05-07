<script lang="ts">
  export let label: string;
  export let id: string = undefined;
  export let name: string | undefined = undefined;
  export let onChange: svelte.JSX.FormEventHandler<HTMLInputElement> = undefined;

  export let checked: boolean = undefined;
</script>

<label>
  <input type="checkbox" {id} {name} class="checkbox-input" on:change={onChange} bind:checked />
  <span class="checkbox">
    <svg class="icon" viewBox="0 0 512 512"
      ><path
        fill="none"
        stroke="currentColor"
        stroke-linecap="square"
        stroke-miterlimit="10"
        stroke-width="44"
        d="M416 128L192 384l-96-96"
      /></svg
    >
  </span>
  {label}
</label>

<style lang="scss">
  @use "../../scss/_themes" as *;
  @use "../../scss/_variables" as *;

  .checkbox-input {
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

    // When focusing, style the checkbox next to it, not this one
    &:hover + .checkbox::before,
    &:focus + .checkbox::before {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }

    &:focus + .checkbox::before {
      // background-color: mix(grey, rgba(0, 0, 0, 0), 25%);
      background-color: grey;
      opacity: 0.25;
    }

    &:hover + .checkbox::before {
      // background-color: mix(grey, rgba(0, 0, 0, 0), 15%);
      background-color: grey;
      opacity: 0.15;
    }

    &:focus:checked + .checkbox::before {
      // background-color: mix($primary-color, rgba(0, 0, 0, 0), 25%);
      background-color: var(--primary-color--500);
      opacity: 0.25;
    }

    &:active:checked + .checkbox:before {
      // background-color: mix($primary-color, rgba(0, 0, 0, 0), 50%);
      background-color: var(--primary-color--500);
      opacity: 0.5;
    }

    &:checked:hover + .checkbox:before,
    &:checked:focus + .checkbox:before {
      // background-color: mix($primary-color, rgba(0, 0, 0, 0), 30%);
      background-color: var(--primary-color--500);
      opacity: 0.3;
    }
  }

  label {
    position: relative;
    display: flex;
    cursor: pointer;
    user-select: none;

    line-height: inherit;

    align-items: center;

    z-index: 1;
  }

  .checkbox {
    position: relative;
    display: block;
    width: 1rem;
    height: 1rem;

    margin: auto 0;

    margin-right: 1rem;

    background-color: white;

    border: solid 2px var(--text-secondary);
    border-radius: 0.125rem;

    &::before {
      content: "";

      position: absolute;

      top: 50%;
      left: 50%;

      transform: translate(-50%, -50%) scale(0.75);
      opacity: 0;

      width: 2.25rem;
      height: 2.25rem;

      background-color: rgba(0, 0, 0, 0);
      border-radius: 99999px;

      z-index: -1;

      transition: all 75ms ease;
      transition-property: transform, opacity;
    }
  }

  .checkbox-input:checked ~ .checkbox {
    border: none;
    background-color: var(--primary-color--500);
  }

  .checkbox-input:checked ~ .checkbox .icon {
    display: block;
  }

  .icon {
    display: none;
    width: 100%;
    color: var(--background-primary);
  }

  @media (min-width: $breakpoint--min-desktop) {
    .checkbox {
      margin-left: 0;
    }
  }
</style>
