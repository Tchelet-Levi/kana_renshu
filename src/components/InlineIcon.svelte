<span class="icon" />

<style lang="scss">
  .icon {
    display: inline-block;

    margin: var(--margin, 0);
    margin-right: var(--margin-right, 0.25rem);
    margin-left: var(--margin-left, 0);
    margin-top: var(--margin-top, 0);
    margin-bottom: var(--margin-bottom, 0);

    width: var(--icon-size, 1.25em);
    height: var(--icon-size, 1.25em);
    background-color: var(--bg, var(--text-primary));

    // Not well supported; needs prefix.
    -webkit-mask-image: var(--mask-url);
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;

    mask-image: var(--mask-url);
    mask-position: center;
    mask-repeat: no-repeat;
  }
</style>
