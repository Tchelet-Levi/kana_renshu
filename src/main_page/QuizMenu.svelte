<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Checkbox from "../components/checkbox/Checkbox.svelte";
  import type { QuizMenuOptions } from "../global";
  import { quizOptionsStore } from "./appStore";

  let hmonChecked;
  let hdiaChecked;
  let hdigChecked;

  let kmonChecked;
  let kdiaChecked;
  let kdigChecked;

  // Get the quizOptions from the QuizOptions store
  let quizOptions: QuizMenuOptions;

  // subscribe, and then return the unsubscribe method for later.
  const unsubscribe = quizOptionsStore.subscribe((value) => {
    quizOptions = value;
    assignCheckboxesFromStore();
  });

  function assignCheckboxesFromStore() {
    hmonChecked = quizOptions["h-mon"];
    hdiaChecked = quizOptions["h-dia"];
    hdigChecked = quizOptions["h-dig"];

    kmonChecked = quizOptions["k-mon"];
    kdiaChecked = quizOptions["k-dia"];
    kdigChecked = quizOptions["k-dig"];
  }

  onMount(() => {
    assignCheckboxesFromStore();
  });

  // Unsubscribe to prevent memory leak when destroyed.
  onDestroy(unsubscribe);

  function updateStore(e) {
    const checkboxID = e.target.id;
    const isChecked = e.target.checked;

    quizOptionsStore.update((options) => {
      let o = { ...options, [checkboxID]: isChecked };
      return o;
    });
  }
</script>

<aside>
  <h2 class="title">Include these Kana</h2>
  <h3>Hiragana</h3>
  <ul>
    <li><Checkbox onChange={updateStore} label="Monographs" id="h-mon" checked={hmonChecked} /></li>
    <li><Checkbox onChange={updateStore} label="Diacritics" id="h-dia" checked={hdiaChecked} /></li>
    <li><Checkbox onChange={updateStore} label="Digraphs" id="h-dig" checked={hdigChecked} /></li>
  </ul>

  <h3>Katakana</h3>
  <ul>
    <li><Checkbox onChange={updateStore} label="Monographs" id="k-mon" checked={kmonChecked} /></li>
    <li><Checkbox onChange={updateStore} label="Diacritics" id="k-dia" checked={kdiaChecked} /></li>
    <li><Checkbox onChange={updateStore} label="Digraphs" id="k-dig" checked={kdigChecked} /></li>
  </ul>
</aside>

<style lang="scss">
  @use "../scss/_variables" as *;
  @use "../scss/_themes.scss" as *;

  .title {
    font-size: 1rem;
    margin: 0;
    margin-bottom: 1rem;
    font-weight: 400;
  }

  h3 {
    margin: 0;
    margin-bottom: 1.5rem;

    font-size: 1rem;
    font-weight: 400;
  }

  ul {
    display: flex;
    flex-direction: column;

    gap: 2rem;

    list-style-type: none;

    padding: 0;

    margin: 0;
    margin-bottom: 2.5rem;
  }

  ul:last-of-type {
    margin: 0;
  }

  ul li {
    display: contents;
  }

  @media (min-width: $breakpoint--min-desktop) {
    ul {
      padding-left: 1rem;
      gap: 1.5rem;
    }

    h3 {
      margin: 0;
      margin-bottom: 1rem;

      font-size: 1.5rem;
      font-weight: 400;
    }
  }
</style>
