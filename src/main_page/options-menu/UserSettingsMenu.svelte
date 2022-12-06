<script lang="ts">
  import Switch from "../../components/switch/Switch.svelte";
  import { isUsingTouchScreen } from "../application/application";
  import { userSettings } from "../appStore";

  function updateStore(e, key) {
    const value = e.currentTarget.checked;

    userSettings.update((prevSettings) => {
      return { ...prevSettings, [key]: value };
    });
  }
</script>

<div class="user-settings-wrapper">
  <!-- Allow Illegal Characters -->
  <Switch
    label="Enforce Rōmaji"
    description="Prevents you from typing '123!@#'' and other similar characters."
    checked={$userSettings.forceRomajiInput}
    onChange={(e) => updateStore(e, "forceRomajiInput")}
  />

  <!-- Spacebar submit (for people with disabilities / me because it's convenient) -->
  {#if !isUsingTouchScreen()}
    <Switch
      label="Spacebar Submit"
      description="You can answer by pressing the Space key."
      checked={$userSettings.spacebarAnswers}
      onChange={(e) => updateStore(e, "spacebarAnswers")}
    />
  {/if}

  <!-- Show welcome screen -->
  <Switch
    label="Show Welcome Screen"
    description="Choose whether to show the welcome screen or not."
    checked={$userSettings.showWelcomeScreen}
    onChange={(e) => updateStore(e, "showWelcomeScreen")}
  />
</div>

<style lang="scss">
  .user-settings-wrapper {
    display: flex;
    flex-direction: column;

    width: 100%;
    gap: 2rem;
  }
</style>
