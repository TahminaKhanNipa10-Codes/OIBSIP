// Ensure script runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("infoModal");
  const closeBtn = document.querySelector(".close-btn");
  // Target all items with the 'glass' class that we want to be clickable
  const dynamicCards = document.querySelectorAll(
    ".card, .text-card, .gallery-img",
  );

  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalImg = document.getElementById("modalImg");

  dynamicCards.forEach((item) => {
    item.addEventListener("click", () => {
      // Retrieve data attributes
      modalTitle.textContent = item.getAttribute("data-title");
      modalSubtitle.textContent = item.getAttribute("data-year");
      modalDesc.textContent = item.getAttribute("data-desc");

      // Check if the clicked item is a Gallery Image
      if (item.tagName === "IMG") {
        modalImg.src = item.src;
        modalImg.style.display = "block"; // Show image
      } else {
        modalImg.style.display = "none"; // Hide image for text/movie cards
        modalImg.src = "";
      }

      modal.style.display = "flex";
    });
  });

  // Close Modal on X button click
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close Modal when clicking outside the box
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
