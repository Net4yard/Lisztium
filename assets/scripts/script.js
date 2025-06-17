console.error = function () {}; // Letiltja az error üzeneteket
console.warn = function () {}; // Letiltja a warning üzeneteket

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
  ["#f1be34", "#f2a859"],
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

const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

$(function () {
  var slides = $(".card_container ul").children().length;
  var slideWidth = $(".card_container").width();
  var min = 0;
  var max = -((slides - 1) * slideWidth);

  $(".card_container ul")
    .width(slides * slideWidth)
    .draggable({
      axis: "x",
      drag: function (event, ui) {
        if (ui.position.left > min) ui.position.left = min;
        if (ui.position.left < max) ui.position.left = max;
      },
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

// let cart = []; // This global cart is not consistently used with localStorage logic. Prefer localStorage.

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
  localStorage.setItem("cartTimestamp", Date.now().toString());
  updateCartCount();
}

// Oldalbetöltéskor frissítse a kosár ikonját
document.addEventListener("DOMContentLoaded", updateCartCount);

// function updateCart() { // Uses global cart, prefer localStorage version if this is for general count
//   const localCart = JSON.parse(localStorage.getItem("cart")) || [];
//   document.getElementById("cart-count").innerText = localCart.length;
// }

// function showCart() { // Uses global cart, cart.html uses loadCart() which uses localStorage
//   const cartList = document.getElementById("cart-items");
//   cartList.innerHTML = "";
//   let total = 0;
//   const localCart = JSON.parse(localStorage.getItem("cart")) || [];

//   localCart.forEach((item, index) => {
//     total += item.price;
//     let li = document.createElement("li");
//     li.innerText = `${item.name} - ${item.price} ¥`;
//     cartList.appendChild(li);
//   });

//   document.getElementById("cart-total").innerText = total; // Assumes #cart-total exists
//   // document.getElementById("cart-modal").style.display = "block"; // For a modal, not cart.html page
// }

// function hideCart() { // For a modal
//   // document.getElementById("cart-modal").style.display = "none";
// }

// async function checkout() { // This seems to be for a different payment system (Barion) and uses global cart
//   const localCart = JSON.parse(localStorage.getItem("cart")) || [];
//   const response = await fetch("/create-barion-payment", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ cart: localCart }), // Send localStorage cart
//   });
//   const data = await response.json();
//   window.location.href = data.paymentUrl;
// }

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
  // Be more specific if this is for remove buttons, as removeFromCart already calls loadCart.
  // Example: if (event.target.closest('#cart-items') && event.target.tagName === 'BUTTON')
  // For now, assuming it might be for other general button interactions needing cart refresh.
  // If it's only for "Remove" buttons in cart, it's redundant due to removeFromCart calling loadCart.
  if (
    event.target.matches("button") &&
    !event.target.closest("#checkoutForm")
  ) {
    // Avoid re-running loadCart on "Buy"
    // Check if loadCart function is available (it might be specific to cart.html's scope)
    if (typeof loadCart === "function") {
      // loadCart(); // Consider if this is too broad.
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const checkoutForm = document.getElementById("checkoutForm");

  if (checkoutForm) {
    // Ensure this code only runs on pages with the checkout form (e.g., cart.html)
    checkoutForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default HTML form submission

      const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || [];

      if (cartFromStorage.length === 0) {
        alert(
          "Your cart is empty. Please add items to your cart before proceeding."
        );
        return;
      }

      // Ensure each item has a quantity, defaulting to 1, as backend expects it.
      const itemsToPay = cartFromStorage.map((item) => ({
        ...item,
        quantity: item.quantity || 1, // Default to 1 if quantity is not present
      }));

      try {
        const response = await fetch("http://localhost:8080/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: itemsToPay }), // Send the processed cart
        });
        const data = await response.json();
        if (data.approval_url) {
          window.location.href = data.approval_url; // Redirect to PayPal
        } else {
          console.error("Payment initiation failed:", data);
          alert(data.error || "Payment initiation failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during checkout:", error);
        alert(
          "An error occurred while trying to proceed to payment. Please check your connection and try again."
        );
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const products = document.querySelectorAll(".product");
  const gradients = [
    "linear-gradient(to right, #019788, #7286c0)", // Rózsaszín átmenet
    //"linear-gradient(to right, #8ee7a4, #f1be34)",  // Kékes átmenet
    "linear-gradient(to right, #b659dc, #79c7c1)", // Zöldes átmenet
    //"linear-gradient(to right, #51b3d5, #f2a859)"   // Pirosas átmenet
  ];

  products.forEach((product) => {
    const randomGradient =
      gradients[Math.floor(Math.random() * gradients.length)];
    product.style.background = randomGradient;
    product.style.padding = "15px"; // Hogy jobban látszódjon a háttér
    product.style.borderRadius = "10px";
    product.style.marginBottom = "10px";
  });
});

// document.getElementById('applicationForm').addEventListener('submit', function(event) {
//   const email = document.getElementById('email').value;
//   const age = document.getElementById('age').value;
//   const consentPhotos = document.querySelector('input[name="consent-photos"]');
//   let errors = [];

//   // Email must contain @
//   if (!email.includes('@')) {
//     errors.push('Please enter a valid email address.');
//   }

//   // Age must be a number between 1 and 150
//   if (!/^\d+$/.test(age)) {
//     errors.push('Age must be a valid number.');
//   } else if (parseInt(age) <= 0 || parseInt(age) > 150) {
//     errors.push('Please enter a realistic age (1-150).');
//   }

//   // 2. checkbox kötelező
//   if (!consentPhotos.checked) {
//     errors.push('You must agree to the photo usage policy.');
//   }

//   if (errors.length > 0) {
//     event.preventDefault();
//     alert(errors.join('\n'));
//   }
// });

async function validateForm(event) {
  event.preventDefault(); // Prevent default form submission

  // Collect all form values
  const name = document.getElementById("name").value;
  const furigana = document.getElementById("furigana")?.value || "";
  const email = document.getElementById("email").value;
  const instrument = document.getElementById("instrument").value;
  const plusone = document.getElementById("plusone").value;
  const age = document.getElementById("age").value;
  const school = document.getElementById("school").value;
  const videolinks = document.getElementById("videolinks").value;
  const consent1 = document.querySelector('input[name="consent1"]').checked
    ? "Yes"
    : "No";
  const consent2 = document.querySelector('input[name="consent2"]').checked
    ? "Yes"
    : "No";
  const consent3 = document.querySelector('input[name="consent3"]').checked
    ? "Yes"
    : "No";

  // Validation
  if (!email.includes("@")) {
    alert("Please enter a valid email address.");
    return false;
  }
  if (isNaN(age) || age < 1 || age > 150) {
    alert("Please enter a valid age between 1 and 150.");
    return false;
  }
  if (consent2 !== "Yes") {
    alert("You must agree to the photo usage policy.");
    return false;
  }

  // Build the message
  const message = `
name: ${name}
furigana: ${furigana}
email: ${email}
instrument: ${instrument}
plusone: ${plusone}
age: ${age}
school: ${school}
videolinks: ${videolinks}
consent1: ${consent1}
consent2: ${consent2}
consent3: ${consent3}
  `;

  // Send the email (change 'to' to your admin/recipient address)
  try {
    // Send the email using the sendEmail function
    await sendEmail({
      to: "musicorestes@gmail.com",
      subject: "New Lisztium Application",
      message: message,
    });

    // Only reset the form if email was sent successfully
    event.target.reset();
    return false;
  } catch (error) {
    console.error("Form submission error:", error);
    alert("There was an error submitting your application. Please try again.");
    return false;
  }
}

const sendEmail = async (emailData) => {
  try {
    const formattedData = {
      name: document.getElementById("name").value,
      furigana: document.getElementById("furigana")?.value,
      email: document.getElementById("email").value,
      instrument: document.getElementById("instrument").value,
      plusone: document.getElementById("plusone").value,
      age: document.getElementById("age").value,
      school: document.getElementById("school").value,
      videolinks: document.getElementById("videolinks").value,
      consent1: document.querySelector('input[name="consent1"]').checked
        ? "on"
        : "off",
      consent2: document.querySelector('input[name="consent2"]').checked
        ? "on"
        : "off",
      consent3: document.querySelector('input[name="consent3"]').checked
        ? "on"
        : "off",
    };

    const response = await fetch(
      "https://lisztium-mailer-dot-second-kiln-431107-p9.oa.r.appspot.com/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formattedData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "success") {
      alert("Email sent successfully!");
    } else {
      throw new Error(result.message || "Failed to send email");
    }
  } catch (error) {
    console.error("Error sending email:", error);
    alert("Failed to send email. Please try again later.");
  }
};

// Success oldal betöltésekor törli a kosarat
if (window.location.pathname.endsWith("success.html")) {
  localStorage.removeItem("cart");
  localStorage.removeItem("cart_jp");
  localStorage.removeItem("cartTimestamp");
}

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("clearCart") === "1") {
    localStorage.removeItem("cart");
    localStorage.removeItem("cart_jp");
    localStorage.removeItem("cartTimestamp");
    localStorage.removeItem("clearCart");
    updateCartCount && updateCartCount();
  }

  const cartTimestamp = localStorage.getItem("cartTimestamp");
  if (cartTimestamp) {
    const now = Date.now();
    if (now - parseInt(cartTimestamp, 10) > 10 * 60 * 1000) {
      // 10 perc eltelt
      localStorage.removeItem("cart");
      localStorage.removeItem("cartTimestamp");
      updateCartCount && updateCartCount();
    }
  }
});
