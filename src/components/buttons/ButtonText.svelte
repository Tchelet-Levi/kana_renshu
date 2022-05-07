<script lang="ts">
  export let onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = undefined;
  export let disabled: boolean = false;
</script>

<button class="btn-tertiary" {disabled} on:click={onClick}>
  <span class="btn-label"><slot /></span>
</button>

<style lang="scss">
  @use "../../scss/_variables" as *;
  @use "../../scss/_themes" as *;

  .btn-tertiary {
    position: relative;
    display: inline-flex;
    font-family: inherit;
    font-size: 1rem;
    align-items: center;

    cursor: pointer;
    user-select: none;

    color: var(--primary-color--500);

    padding: 0 0.5rem;

    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: $btn--letter-spacing;

    background-color: transparent;

    border: none;

    min-height: 2.25rem;

    z-index: 1;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background-color: var(--primary-color--500);
      opacity: 0;
      border-radius: $br--rounded;

      z-index: -1;

      transition: opacity 50ms ease;
    }

    &:hover::before {
      opacity: 0.1;
    }

    &:focus::before {
      opacity: 0.2;
    }

    &:disabled {
      color: var(--primary-color--200);
      cursor: auto;

      &:hover,
      &:focus {
        text-decoration: none;
      }

      &::before {
        opacity: 0;
      }
    }
  }
</style>
