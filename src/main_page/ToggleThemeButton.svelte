<script lang="ts">
  function toggleTheme() {
    const currentTheme = window.document.body.className;

    if (currentTheme === "light-theme") {
      window.document.body.classList.replace("light-theme", "dark-theme");
    }

    if (currentTheme === "dark-theme") {
      window.document.body.classList.replace("dark-theme", "light-theme");
    }
  }
</script>

<button on:click={toggleTheme}>Toggle</button>
