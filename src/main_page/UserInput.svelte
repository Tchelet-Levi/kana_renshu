<script lang="ts">
  import { tick } from "svelte";

  export let placeholder = "Placeholder";
  export let onInput: svelte.JSX.FormEventHandler<HTMLInputElement> = undefined;
  export let onKeypress: svelte.JSX.FormEventHandler<HTMLInputElement> = undefined;
  export let onKeydown: svelte.JSX.FormEventHandler<HTMLInputElement> = undefined;
  export let onKeyup: svelte.JSX.FormEventHandler<HTMLInputElement> = undefined;
  export let onFocus: svelte.JSX.FormEventHandler<HTMLInputElement> = undefined;
  export let pattern: string = undefined;
  export let value: string = "";
  export let disabled: boolean = false;
  export let spellCheck: boolean = true;

  let input: HTMLInputElement;

  export const focus = async () => {
    await tick();
    input.focus();
  };
</script>

<label class="user-input">
  <input
    type="text"
    autocomplete="new-password"
    autocapitalize="off"
    autocorrect="off"
    aria-autocomplete="none"
    class="text-input"
    {placeholder}
    on:input={onInput}
    on:keypress={onKeypress}
    on:keydown={onKeydown}
    on:keyup={onKeyup}
    on:focus={onFocus}
    bind:value
    {pattern}
    {disabled}
    bind:this={input}
    spellcheck={spellCheck}
  />
  <span class="input-underline" />
</label>

<style lang="scss">
  @use "../scss/_variables" as *;
  @use "../scss/_themes" as *;
  .user-input {
    position: relative;
    display: flex;
    width: 100%;
  }

  .text-input {
    all: unset;

    width: 100%;

    border-radius: $br--rounded;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    padding: 1rem 0.75rem;

    cursor: text;

    &:hover,
    &:focus {
      background-color: transparentize(grey, 0.85);
    }

    &:hover + .input-underline,
    &:focus + .input-underline {
      height: 2px;

      background-color: var(--underline-color, var(--primary-color--500));
    }

    &:focus + .input-underline {
      // border-bottom: solid 2px var(--primary-color--500);
      height: 3px;
    }

    &:disabled {
      background-color: transparentize(grey, 0.95);
      cursor: auto;

      &::placeholder {
        color: var(--text-tertiary);
      }
    }

    &:disabled + .input-underline {
      // border-bottom: solid 1px var(--text-secondary);
      background-color: var(--text-secondary);
      height: 1px;
    }

    &::placeholder {
      color: var(--text-secondary);
    }
  }

  .input-underline {
    display: block;
    position: absolute;

    bottom: -1px;
    right: 0;
    left: 0;

    content: "";

    height: 1px;

    width: 100%;

    background-color: var(--text-tertiary);
  }
</style>
