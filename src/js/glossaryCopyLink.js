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

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  glossaryBody.querySelectorAll("tr").forEach((row) => {
    const en = row.dataset.en || "";
    const uk = row.dataset.uk || "";
    const description =
      row.cells[2].dataset.originalText || row.cells[2].textContent.trim();

    if (!row.cells[2].dataset.originalText) {
      row.cells[2].dataset.originalText = description;
    }

    const queryLower = query.toLocaleLowerCase();

    const matched =
      !query ||
      en.toLocaleLowerCase("en-US").includes(queryLower) ||
      uk.toLocaleLowerCase("uk-UA").includes(queryLower) ||
      description.toLocaleLowerCase("uk-UA").includes(queryLower);

    row.hidden = !matched;

    highlightMatch(row.cells[0], en, query);
    highlightMatch(row.cells[1], uk, query);
    highlightMatch(row.cells[2], description, query);
  });
});

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

  while ((index = normalizedText.indexOf(normalizedQuery, startIndex)) !== -1) {
    cell.append(document.createTextNode(text.slice(startIndex, index)));

    const mark = document.createElement("mark");
    mark.textContent = text.slice(index, index + query.length);
    cell.append(mark);

    startIndex = index + query.length;
  }

  cell.append(document.createTextNode(text.slice(startIndex)));
}
