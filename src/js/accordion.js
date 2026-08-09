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
