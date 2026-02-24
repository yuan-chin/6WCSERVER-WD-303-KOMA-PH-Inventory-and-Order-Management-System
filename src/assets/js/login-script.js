document.addEventListener("DOMContentLoaded", function () { 
  const inputs = document.querySelectorAll("[data-floater] input, [data-floater] textarea, [data-floater] select");

  function updateFloater(input) {
    const group = input.closest("[data-floater]");
    if (!group) return;
    const val = input.value;
    if (val && val.trim() !== "") {
      group.classList.add("filled");
    } else {
      group.classList.remove("filled");
    }
  }

  inputs.forEach((input) => {
    updateFloater(input);
    input.addEventListener("input", () => updateFloater(input));
    input.addEventListener("change", () => updateFloater(input));
    input.addEventListener("blur", () => updateFloater(input));
  });

  window.addEventListener("pageshow", () => {
    inputs.forEach((input) => updateFloater(input));
  });
});
