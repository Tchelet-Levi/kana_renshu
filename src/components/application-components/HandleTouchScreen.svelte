<script lang="ts">
  import { onDestroy } from "svelte";
  import { userSettings as userSettingsStore } from "../../main_page/appStore";

  let userSettings;
  const unsubUserSettings = userSettingsStore.subscribe((value) => (userSettings = value));

  if (window.matchMedia("(pointer: coarse)").matches) {
    userSettingsStore.update((settings) => {
      return { ...settings, showMobileAutofillWarning: true };
    });
  }

  onDestroy(unsubUserSettings);
</script>
