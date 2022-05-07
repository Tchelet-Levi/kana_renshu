<script lang="ts">
  export let onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = undefined;
  export let ariaLabel: string = undefined;
</script>

<button class="button-primary" aria-label={ariaLabel} on:click={onClick}><slot /></button>

<style lang="scss">
  @use "../../scss/_variables" as *;
  @use "../../scss/_themes" as *;

  :global(.dark-theme .button-primary) {
    background-color: var(--background-secondary);
    color: var(--primary-color--500);

    border: none;
    border: 2px solid var(--primary-color--500);
  }

  :global(.light-theme .button-primary) {
    background-color: var(--primary-color--500);
    color: white;
    border: none;
  }

  .button-primary {
    font-size: 1rem;
    font-weight: 900;

    padding: 0.75rem 1.25rem;
    box-shadow: $box-shadow--1;

    border-radius: $br--rounded;

    cursor: pointer;

    transition: all 50ms ease;
    transition-property: background-color, box-shadow;

    &:hover {
      box-shadow: $box-shadow--2;
    }
  }
</style>
