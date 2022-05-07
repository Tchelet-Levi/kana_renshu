/** Dispatch event on click outside of node */
export function clickOutside(node) {
  const handleClick = (event) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent("outclick", node));
    }
  };

  // Run handleClick whenever we click on any document element OR focus on any document element.
  document.addEventListener("click", handleClick, true);

  // If we're not focusing on node or its children, it has the same effect. This is here for accessibility.
  document.addEventListener("focus", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("focus", handleClick, true);
    },
  };
}
