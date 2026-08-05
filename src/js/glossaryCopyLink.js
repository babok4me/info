/**Copy link */
document.querySelectorAll(".copy-link").forEach((button) => {
  button.addEventListener("click", async () => {
    const anchor = button.dataset.anchor;

    const url =
      window.location.origin + window.location.pathname + "#" + anchor;

    await navigator.clipboard.writeText(url);
  });
});

document.querySelectorAll(".copy-link").forEach((button) => {
  button.addEventListener("click", async () => {
    const anchor = button.dataset.anchor;

    const url =
      window.location.origin + window.location.pathname + "#" + anchor;

    await navigator.clipboard.writeText(url);

    const icon = button.querySelector("i");

    icon.className = "bi bi-check-lg";

    setTimeout(() => {
      icon.className = "bi bi-link-45deg";
    }, 1500);
  });
});

/**Table sort */
const tbody = document.getElementById("glossary-body");

document.querySelectorAll("[data-sort]").forEach((button) => {
  button.addEventListener("click", () => {
    const field = button.dataset.sort;
    const locale = field === "uk" ? "uk-UA" : "en-US";

    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a, b) =>
      a.dataset[field].localeCompare(b.dataset[field], locale, {
        sensitivity: "base",
      }),
    );

    rows.forEach((row) => tbody.appendChild(row));
  });
});

/**Search term */
const searchInput = document.getElementById("glossary-search");
const glossaryBody = document.getElementById("glossary-body");
const glossaryCount = document.getElementById("glossary-count");

const englishAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const ukrainianAlphabet = [
  "А", "Б", "В", "Г", "Ґ", "Д", "Е", "Є", "Ж", "З",
  "И", "І", "Ї", "Й", "К", "Л", "М", "Н", "О", "П",
  "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ",
  "Ь", "Ю", "Я"
];

let selectedLanguage = null;
let selectedLetter = null;


/** Створення алфавіту */
function createAlphabet(containerId, letters, language) {
  const container = document.getElementById(containerId);

  if (!container) return;

  // Кнопка "Усі"
  const allButton = document.createElement("button");

  allButton.type = "button";
  allButton.textContent = "Усі";
  allButton.className = "alphabet-button";

  allButton.addEventListener("click", () => {
    selectedLanguage = null;
    selectedLetter = null;

    clearActiveLetters();
    filterGlossary();
  });

  container.appendChild(allButton);


  // Літери
  letters.forEach((letter) => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = letter;
    button.className = "alphabet-button";

    button.addEventListener("click", () => {

      // Повторний клік по вибраній літері скидає фільтр
      if (
        selectedLanguage === language &&
        selectedLetter === letter
      ) {
        selectedLanguage = null;
        selectedLetter = null;

        clearActiveLetters();
      } else {
        selectedLanguage = language;
        selectedLetter = letter;

        clearActiveLetters();
        button.classList.add("active");
      }

      filterGlossary();
    });

    container.appendChild(button);
  });
}


/** Скидання активної літери */
function clearActiveLetters() {
  document
    .querySelectorAll(".alphabet-button")
    .forEach((button) => {
      button.classList.remove("active");
    });
}


/** Загальна фільтрація */
function filterGlossary() {
  const query = searchInput.value
    .trim()
    .toLocaleLowerCase("uk-UA");

  let visibleCount = 0;

  glossaryBody.querySelectorAll("tr").forEach((row) => {
    const en = row.dataset.en || "";
    const uk = row.dataset.uk || "";

    const description =
      row.cells[2].dataset.originalText ||
      row.cells[2].textContent.trim();

    if (!row.cells[2].dataset.originalText) {
      row.cells[2].dataset.originalText = description;
    }

    const matchesSearch =
      !query ||
      en.toLocaleLowerCase("en-US").includes(query) ||
      uk.toLocaleLowerCase("uk-UA").includes(query) ||
      description.toLocaleLowerCase("uk-UA").includes(query);

    let matchesLetter = true;

    if (selectedLetter) {
      const term =
        selectedLanguage === "en"
          ? en
          : uk;

      const locale =
        selectedLanguage === "en"
          ? "en-US"
          : "uk-UA";

      matchesLetter = term
        .toLocaleUpperCase(locale)
        .startsWith(selectedLetter);
    }

    const isVisible =
      matchesSearch && matchesLetter;

    row.hidden = !isVisible;

    if (isVisible) {
      visibleCount++;
    }

    highlightMatch(row.cells[0], en, query);
    highlightMatch(row.cells[1], uk, query);
    highlightMatch(row.cells[2], description, query);
  });

  glossaryCount.textContent = `(${visibleCount})`;
}


/** Підсвічування знайденого тексту */
function highlightMatch(cell, text, query) {
  cell.textContent = "";

  if (!query) {
    cell.textContent = text;
    return;
  }

  const normalizedText = text.toLocaleLowerCase();
  const normalizedQuery = query.toLocaleLowerCase();

  let startIndex = 0;
  let index;

  while (
    (index = normalizedText.indexOf(
      normalizedQuery,
      startIndex
    )) !== -1
  ) {
    cell.append(
      document.createTextNode(
        text.slice(startIndex, index)
      )
    );

    const mark = document.createElement("mark");

    mark.textContent = text.slice(
      index,
      index + query.length
    );

    cell.append(mark);

    startIndex = index + query.length;
  }

  cell.append(
    document.createTextNode(
      text.slice(startIndex)
    )
  );
}


/** Текстовий пошук */
searchInput.addEventListener(
  "input",
  filterGlossary
);


/** Створення алфавітів */
createAlphabet(
  "alphabet-en",
  englishAlphabet,
  "en"
);

createAlphabet(
  "alphabet-uk",
  ukrainianAlphabet,
  "uk"
);

filterGlossary();