<script lang="ts">
  import { onMount } from "svelte";
  import InlineIcon from "../../components/InlineIcon.svelte";

  export let label: string | undefined = undefined;
  export let name: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let onChange: svelte.JSX.FormEventHandler<HTMLInputElement>;

  let inputRef: HTMLInputElement;
  export function focus() {
    inputRef.focus();
  }

  export function isChecked() {
    return inputRef.checked;
  }

  export function setChecked(checked: boolean) {
    inputRef.checked = checked;
  }

  onMount(() => {});
</script>

<label class="theme-radio-label" for={id}>
  <input
    type="radio"
    class="theme-radio-btn"
    {name}
    {id}
    on:change={onChange}
    bind:this={inputRef}
  />
  <span class="button-content">
    <InlineIcon />
    <span class="button-text">
      {label}
    </span>
  </span>
</label>

<style lang="scss">
  @use "../../scss/_variables.scss" as *;
  @use "../../scss/_themes.scss" as *;

  .theme-radio-label {
    display: flex;
    justify-content: center;

    user-select: none;
    width: 100%;
  }

  .theme-radio-btn {
    // Hide in chrome
    width: 0px;
    height: 0px;

    // ..aaand in Firefox
    position: absolute;
    transform: scale(0);

    &:focus + .button-content {
      outline: var(--primary-color--500) solid 2px;
      outline-offset: 2px;
      color: var(--text-primary);
      --bg: var(--text-primary);
    }

    &:hover + .button-content {
      color: var(--text-primary);
      --bg: var(--text-primary);
    }

    &:hover + .button-content::before,
    &:focus + .button-content::before {
      opacity: 0.1;
    }

    &:checked + .button-content {
      color: var(--text-primary-flipped);
      --bg: var(--text-primary-flipped);
    }

    &:checked + .button-content::before {
      opacity: 1;
    }
  }

  .button-content {
    position: relative;
    display: flex;
    text-align: center;
    padding: 1rem;
    width: 100%;

    justify-content: start;

    font-weight: 500;

    border-radius: 99999px;

    --bg: var(--text-primary);
    color: var(--text-primary);
    cursor: pointer;

    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background: var(--primary-color--500);
      opacity: 0;
      z-index: -1;

      transition: opacity 50ms ease;
    }
  }
</style>
