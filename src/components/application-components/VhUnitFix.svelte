<script lang="ts">
  // Problem: vh units in css do not account for the URL and navigation bar in mobile.

  // Solution: first we get the viewport height and we multiple it by 1% to get a value for a single vh unit.
  const vh = window.innerHeight * 0.01;

  // Then we set the value of the --vh property to this vh value in the html element.
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  // We listen to the resize event
  window.addEventListener("resize", () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });
</script>
