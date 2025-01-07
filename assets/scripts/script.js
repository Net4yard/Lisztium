// Figyelt elem
const greenline = document.querySelector('.greenline');

// Az Intersection Observer beállítása
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Amikor az elem láthatóvá válik, hozzáadjuk a 'visible' osztályt
      entry.target.classList.add('visible');
      // Csak egyszer futtatjuk le, ha már látható az elem
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.5 // Ha az elem 50%-a látszik
});

// Observer alkalmazása
observer.observe(greenline);
