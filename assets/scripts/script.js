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

document.addEventListener("DOMContentLoaded", function () {
  const notesContainer = document.querySelector(".background-notes");
  const notes = ["♪", "♫", "♬", "♩", "♭"]; // Használható hangjegy karakterek

  function createNote() {
    const note = document.createElement("span");
    note.classList.add("note");
    note.textContent = notes[Math.floor(Math.random() * notes.length)]; // Véletlenszerű hangjegy kiválasztása

    // Véletlenszerű kezdőpozíció (balról jobbra)
    note.style.left = Math.random() * 100 + "vw";
    note.style.animationDuration = 2 + Math.random() * 20 + "s"; // Sebesség
    note.style.fontSize = 20 + Math.random() * 20 + "px"; // Véletlenszerű méret

    // Véletlenszerű forgásirány
    const rotationSpeed = Math.random() * 360; // 0 és 360 fok között
    note.style.transform = `rotate(${rotationSpeed}deg)`;

    notesContainer.appendChild(note);

    // Hangjegy eltávolítása animáció végén
    setTimeout(() => {
      note.remove();
    }, 5000);
  }

  // Hangjegyek generálása időközönként
  setInterval(createNote, 500);
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".gallery-img").forEach(function (img) {
      img.addEventListener("click", function () {
          openLightbox(this.src, this.alt);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImage");
  var caption = document.getElementById("lightboxCaption");
  var closeBtn = document.querySelector(".close");

  document.querySelectorAll(".gallery-img").forEach(function (img) {
      img.addEventListener("click", function () {
          lightbox.style.display = "block";
          lightboxImg.src = this.src;
          caption.innerHTML = this.alt;
      });
  });

  // Lightbox bezárás gombra kattintva
  closeBtn.addEventListener("click", function () {
      lightbox.style.display = "none";
  });

  // Lightbox háttérre kattintva bezárás
  lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
          lightbox.style.display = "none";
      }
  });
});

let cart = [];

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // Ha nincs kosár, legyen üres tömb
  let cartCount = document.getElementById("cart-count");

  if (cart.length > 0) {
      cartCount.innerText = cart.length;
      cartCount.style.display = "inline-block"; // Megjelenítés, ha van termék
  } else {
      cartCount.style.display = "none"; // Ha üres, elrejtés
  }
}

// Termék hozzáadása a kosárhoz
function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // Ha nincs kosár, hozzunk létre egyet
  cart.push({ id, name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Oldalbetöltéskor frissítse a kosár ikonját
document.addEventListener("DOMContentLoaded", updateCartCount);

function updateCart() {
    document.getElementById("cart-count").innerText = cart.length;
}

function showCart() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        let li = document.createElement("li");
        li.innerText = `${item.name} - ${item.price} ¥`;
        cartList.appendChild(li);
    });

    document.getElementById("cart-total").innerText = total;
    document.getElementById("cart-modal").style.display = "block";
}

function hideCart() {
    document.getElementById("cart-modal").style.display = "none";
}

async function checkout() {
    const response = await fetch("/create-barion-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart })
    });
    const data = await response.json();
    window.location.href = data.paymentUrl;
}

document.addEventListener("DOMContentLoaded", function () {
  let cardContainer = document.querySelector(".card_container ul");

  let isDragging = false;
  let startPosition = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  cardContainer.addEventListener("mousedown", (e) => {
      isDragging = true;
      startPosition = e.clientX - currentTranslate;
  });

  cardContainer.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      let currentPosition = e.clientX - startPosition;
      cardContainer.style.transform = `translateX(${currentPosition}px)`;
  });

  cardContainer.addEventListener("mouseup", () => {
      isDragging = false;
      prevTranslate = currentTranslate;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  loadCart();
});

function loadCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  
  cartContainer.innerHTML = ""; // Kiürítjük a listát, hogy ne duplikálódjon

  let totalPrice = 0;
  
  cartItems.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
          ${item.name} - ${item.price} ¥
          <button onclick="removeFromCart(${index})">Remove</button>
      `;
      cartContainer.appendChild(li);
      totalPrice += item.price;
  });

  totalPriceElement.textContent = `Total: ${totalPrice} ¥`;
}

function removeFromCart(index) {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Keressük meg az adott elemet az UI-ban
  const cartContainer = document.getElementById("cart-items");
  const itemToRemove = cartContainer.children[index];

  // Adjunk egy kis fade-out animációt
  itemToRemove.style.transition = "opacity 0.3s";
  itemToRemove.style.opacity = "0";

  setTimeout(() => {
      // Töröljük az elemet az adatokból
      cartItems.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cartItems));

      // Újratöltjük a listát
      loadCart();
  }, 300); // Kis késleltetés az animáció miatt
}

document.addEventListener("click", function (event) {
  if (event.target.matches("button")) {
      loadCart(); // Bármelyik gombra kattintva frissítjük a kosarat
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const products = document.querySelectorAll(".product");
  const gradients = [
      "linear-gradient(to right, #019788, #7286c0)",  // Rózsaszín átmenet
      //"linear-gradient(to right, #8ee7a4, #f1be34)",  // Kékes átmenet
      "linear-gradient(to right, #b659dc, #79c7c1)",  // Zöldes átmenet
      //"linear-gradient(to right, #51b3d5, #f2a859)"   // Pirosas átmenet
  ];

  products.forEach(product => {
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
      product.style.background = randomGradient;
      product.style.padding = "15px"; // Hogy jobban látszódjon a háttér
      product.style.borderRadius = "10px";
      product.style.marginBottom = "10px";
  });
});

document.getElementById('applicationForm').addEventListener('submit', function(event) {
  const email = document.getElementById('email').value;
  const age = document.getElementById('age').value;
  const consentPhotos = document.querySelector('input[name="consent-photos"]');
  let errors = [];

  // Email must contain @
  if (!email.includes('@')) {
    errors.push('Please enter a valid email address.');
  }

  // Age must be a number between 1 and 150
  if (!/^\d+$/.test(age)) {
    errors.push('Age must be a valid number.');
  } else if (parseInt(age) <= 0 || parseInt(age) > 150) {
    errors.push('Please enter a realistic age (1-150).');
  }

  // 2. checkbox kötelező
  if (!consentPhotos.checked) {
    errors.push('You must agree to the photo usage policy.');
  }

  if (errors.length > 0) {
    event.preventDefault();
    alert(errors.join('\n'));
  }
});

function validateForm() {
  const email = document.getElementById("email").value;
  const age = document.getElementById("age").value;

  if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return false;
  }
  if (isNaN(age) || age < 1 || age > 150) {
      alert("Please enter a valid age between 1 and 150.");
      return false;
  }
  return true;
}

console.error = function() {}; // Letiltja az error üzeneteket
console.warn = function() {};  // Letiltja a warning üzeneteket