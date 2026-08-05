const themeToggle = document.getElementById("themeToggle");

// Отримуємо збережену тему
const savedTheme = localStorage.getItem("theme");

// Якщо тема вже вибиралася — використовуємо її.
// Інакше беремо системну тему.
const currentTheme =
  savedTheme ??
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

// Встановлюємо тему
document.documentElement.setAttribute("data-bs-theme", currentTheme);

// Встановлюємо відповідну іконку
updateThemeIcon(currentTheme);

// Обробка натискання
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-bs-theme");

  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-bs-theme", newTheme);

  // Запам'ятовуємо вибір
  localStorage.setItem("theme", newTheme);

  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === "dark") {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
}
