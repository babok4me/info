// Показати кнопку після прокручування сторінки на 500 px
window.addEventListener("scroll", scrollFunction);

function scrollFunction() {
  const button = document.getElementById("myBtn");

  if (
    document.body.scrollTop > 500 ||
    document.documentElement.scrollTop > 500
  ) {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
}

// Перейти на початок сторінки
function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}