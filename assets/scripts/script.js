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

const colors = [
  ["#019788", "#7286c0"],
  ["#8ee7a4", "#51b3d5"],
  ["#f1be34", "#f2a859"]
];

const columns = document.querySelectorAll(".columns");

columns.forEach((item) => {
  const randomColorPair = colors[Math.floor(Math.random() * colors.length)];
  const circle = item.querySelector(".circle");
  const title = item.querySelector(".title");

  // Kör színe
  circle.style.background = `radial-gradient(circle, ${randomColorPair[0]}, ${randomColorPair[1]})`;

  // Címsor színe
  title.style.color = randomColorPair[0];
});

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});

$(function() {
  var slides = $('.card_container ul').children().length;
  var slideWidth = $('.card_container').width();
  var min = 0;
  var max = -((slides - 1) * slideWidth);

  $(".card_container ul").width(slides*slideWidth).draggable({
      axis: 'x',
      drag: function (event, ui) {
      if (ui.position.left > min) ui.position.left = min;
          if (ui.position.left < max) ui.position.left = max;
      }
  });
});