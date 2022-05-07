// For TypeScript to play nice, any custom actions need to be defined

declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    onoutclick?: () => void;
  }
}
