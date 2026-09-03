document.addEventListener("DOMContentLoaded", () => {
  // Staggered Fade-in for UI elements
  const fadeElements = document.querySelectorAll(".fade-in");
  fadeElements.forEach((el, index) => {
    el.style.animationDelay = `${0.2 + index * 0.15}s`;
  });

  // 3D Tilt Effect for the Avatar
  const tiltElement = document.querySelector(".tilt-element");
  const isTouch = window.matchMedia("(hover: none)").matches;

  if (tiltElement && !isTouch) {
    tiltElement.addEventListener("mousemove", (e) => {
      const rect = tiltElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg tilt
      const rotateY = ((x - centerX) / centerX) * 15;

      tiltElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    tiltElement.addEventListener("mouseleave", () => {
      tiltElement.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      tiltElement.style.transition = "transform 0.5s ease";
    });

    tiltElement.addEventListener("mouseenter", () => {
      tiltElement.style.transition = "none";
    });
  }

  // Mobile navigation toggle
  const hamburger = document.getElementById("hamburger");
  const mainNav = document.getElementById("mainNav");

  if (hamburger && mainNav) {
    const closeNav = () => {
      document.body.classList.remove("nav-open");
      hamburger.setAttribute("aria-expanded", "false");
    };

    const openNav = () => {
      document.body.classList.add("nav-open");
      hamburger.setAttribute("aria-expanded", "true");
    };

    hamburger.addEventListener("click", () => {
      const isOpen = document.body.classList.contains("nav-open");
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close when a nav link is tapped
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    // Close on Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    // If the viewport grows past the mobile breakpoint while
    // the menu is open, reset state so it doesn't stay "stuck".
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeNav();
      }
    });
  }
});
