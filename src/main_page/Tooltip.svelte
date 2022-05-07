<script lang="ts">
  import InlineIcon from "../components/InlineIcon.svelte";

  export let iconPath: string = undefined;
</script>

<div class={`tooltip top`}>
  {#if iconPath}
    <InlineIcon --mask-url={`url(${iconPath})`} />
  {/if}
  <span class="content"><slot /></span>
</div>

<style lang="scss">
  @use "../scss/_variables" as *;

  $dist-from-element: 1rem;

  .tooltip {
    // --arrow-size, 1rem: 1rem;
    --padding: 0.5rem;

    position: var(--position, absolute);

    display: flex;

    padding: var(--padding);
    background-color: var(--background--500);
    border-radius: $br--rounded;

    z-index: 2;

    &::before {
      position: absolute;
      content: "";

      width: var(--arrow-size, 1rem);
      height: var(--arrow-size, 1rem);

      border: transparent solid var(--arrow-size, 1rem);
    }
  }

  .tooltip.top {
    top: -$dist-from-element;
    transform: translateY(-100%);

    &::before {
      // Move down by twice the size (because 1x is one triangle. The full element is two!) and move it back 1px to correct tiiiny sub pixel gap.
      // * -1 to get negative value of --arrow-size
      bottom: calc(((var(--arrow-size, 1rem) * -1) * 2) + 1px);

      // Place the arrow horizontally
      left: var(--arrow-position, 15%);
      transform: translateX(calc(var(--arrow-position, 15%) * -1));

      // Border trick
      border-top: solid var(--background--500) var(--arrow-size, 1rem);
    }
  }

  .tooltip.bottom {
    bottom: -$dist-from-element;
    transform: translateY(100%);

    &::before {
      // Move down by twice the size (because 1x is one triangle. The full element is two!) and move it back 1px to correct tiiiny sub pixel gap.
      // * -1 to get negative value of --arrow-size
      top: calc(((var(--arrow-size, 1rem) * -1) * 2) + 1px);

      // Place the arrow horizontally
      left: var(--arrow-position, 15%);
      transform: translateX(calc(var(--arrow-position, 15%) * -1));

      // Border trick
      border-bottom: solid var(--background--500) var(--arrow-size, 1rem);
    }
  }
</style>
