const scrollToTopButton = document.getElementById("scrollToTopButton");

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > window.innerHeight * 0.04) {
    navbar.classList.add("scrolled");
    scrollToTopButton.classList.add("show");
  } else {
    navbar.classList.remove("scrolled");
    scrollToTopButton.classList.remove("show");
  }
});

scrollToTopButton.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});