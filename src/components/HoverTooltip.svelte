<script lang="ts">
  export let text: string;
</script>

<span class="tooltip-wrapper">
  <span class="content">
    <slot />
  </span>
  <span class="tooltip">
    {text}
  </span>
</span>

<style lang="scss">
  @use "../scss/_variables" as *;
  @use "../scss/_themes" as *;

  .tooltip-wrapper {
    position: relative;
  }

  .content {
    text-decoration: underline dotted;
    text-underline-offset: 0.125rem;

    cursor: help;

    &:hover + .tooltip,
    &:focus + .tooltip {
      opacity: 1;
    }
  }

  .tooltip {
    position: absolute;
    top: 0;
    left: 50%;

    $margin-bottom: 0.5rem;
    transform: translate(-50%, calc(-100% - #{$margin-bottom}));

    width: max-content;
    padding: 0.5rem 0.75rem;

    background-color: var(--text-primary);
    color: var(--text-primary-flipped);

    border-radius: $br--rounded;

    opacity: 0;
    transition: opacity 150ms ease;
  }
</style>
