document.querySelectorAll("[data-accordion-target]").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    const targetId = this.dataset.accordionTarget;
    const target = document.getElementById(targetId);

    const collapse = bootstrap.Collapse.getOrCreateInstance(target, {
      toggle: false,
    });

    collapse.show();

    target.addEventListener(
      "shown.bs.collapse",
      () => {
        target.closest(".accordion-item").scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      },
      { once: true },
    );
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const accordion = document.getElementById("accordionPanelsStayOpenExample");
  const toggleButton = document.getElementById("toggleAccordion");

  if (!accordion || !toggleButton || typeof bootstrap === "undefined") {
    return;
  }

  const panels = Array.from(accordion.querySelectorAll(".accordion-collapse"));

  function areAllPanelsOpen() {
    return panels.every((panel) => panel.classList.contains("show"));
  }

  function updateToggleButton() {
    const allOpen = areAllPanelsOpen();

    toggleButton.textContent = allOpen ? "Згорнути всі" : "Розгорнути всі";

    toggleButton.classList.toggle("is-collapse", allOpen);
    toggleButton.classList.toggle("is-expand", !allOpen);

    toggleButton.setAttribute("aria-expanded", String(allOpen));
  }

  toggleButton.addEventListener("click", () => {
    /*
     * Стан фіксуємо один раз перед циклом.
     * Якщо відкриті не всі — відкриваємо всі.
     * Якщо відкриті всі — закриваємо всі.
     */
    const shouldExpand = !areAllPanelsOpen();

    toggleButton.disabled = true;

    panels.forEach((panel) => {
      const collapse = bootstrap.Collapse.getOrCreateInstance(panel, {
        toggle: false,
      });

      if (shouldExpand) {
        collapse.show();
      } else {
        collapse.hide();
      }
    });
  });

  function handleTransitionComplete() {
    const isTransitioning = panels.some((panel) =>
      panel.classList.contains("collapsing"),
    );

    if (!isTransitioning) {
      toggleButton.disabled = false;
      updateToggleButton();
    }
  }

  panels.forEach((panel) => {
    panel.addEventListener("shown.bs.collapse", handleTransitionComplete);

    panel.addEventListener("hidden.bs.collapse", handleTransitionComplete);
  });

  updateToggleButton();
});
