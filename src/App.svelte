<script lang="ts">
  import Main from "./main_page/Main.svelte";
  import { theme, userSettings } from "./main_page/appStore";
  import type { Theme } from "./global";
  import { onDestroy, onMount } from "svelte";
  import { setTheme } from "./main_page/application/application";
  import VhUnitFix from "./components/application-components/VhUnitFix.svelte";

  // Handle themes
  let appTheme: Theme;
  const unsubTheme = theme.subscribe((value) => {
    // Update appTheme
    appTheme = value;

    // Update the localStorage
    localStorage.setItem("theme", appTheme);

    // Set the theme
    setTheme(appTheme);
  });

  onMount(() => {
    // Set the theme on enter
    setTheme(appTheme);
  });

  onDestroy(() => {
    unsubTheme();
  });
</script>

<!-- CONTENT: Main entry to the app -->
<Main />

<!-- SCRIPT: VH unit fix -->
<VhUnitFix />

<style lang="scss">
  @use "./scss/_global.scss";
</style>
