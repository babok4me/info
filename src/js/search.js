const searchInputs = document.querySelectorAll(".page-search-input");

const searchCounters = document.querySelectorAll(".search-counter");

const mainContent = document.getElementById("main-content");

searchInputs.forEach((searchInput) => {
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.trim();

    // Синхронізуємо desktop/mobile поля
    searchInputs.forEach((input) => {
      if (input !== searchInput) {
        input.value = searchInput.value;
      }
    });

    // Прибираємо попередню підсвітку
    clearHighlights();

    // Не шукаємо менше 2 символів
    if (query.length < 2) {
      updateCounters("");
      return;
    }

    // Пошук
    highlightText(mainContent, query);

    const results = mainContent.querySelectorAll("mark.search-highlight");

    // Кількість результатів
    updateCounters(`(${results.length})`);
  });
});

function updateCounters(value) {
  searchCounters.forEach((counter) => {
    counter.textContent = value;
  });
}

function highlightText(container, query) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (
      node.parentElement &&
      !["SCRIPT", "STYLE", "MARK"].includes(node.parentElement.tagName)
    ) {
      textNodes.push(node);
    }
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(`(${escapedQuery})`, "gi");

  textNodes.forEach((node) => {
    regex.lastIndex = 0;

    if (!regex.test(node.nodeValue)) {
      return;
    }

    regex.lastIndex = 0;

    const fragment = document.createDocumentFragment();

    const parts = node.nodeValue.split(regex);

    parts.forEach((part) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        const mark = document.createElement("mark");

        mark.className = "search-highlight bg-warning text-dark";

        mark.textContent = part;

        fragment.appendChild(mark);
      } else {
        fragment.appendChild(document.createTextNode(part));
      }
    });

    node.parentNode.replaceChild(fragment, node);
  });
}

function clearHighlights() {
  const highlights = mainContent.querySelectorAll("mark.search-highlight");

  highlights.forEach((mark) => {
    mark.replaceWith(document.createTextNode(mark.textContent));
  });

  mainContent.normalize();
}
