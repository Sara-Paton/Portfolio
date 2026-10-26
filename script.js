
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Tools entrance animation
const toolsSection = document.querySelector(".tools-section");

if (
  toolsSection &&
  !prefersReducedMotion &&
  "IntersectionObserver" in window
) {
  toolsSection.classList.add("tools-ready");

  const toolsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("tools-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25
    }
  );

  toolsObserver.observe(toolsSection);
}

// Project scroll reveal
const projectReveals = document.querySelectorAll(
  ".reveal-from-left, .reveal-from-right"
);

if (
  projectReveals.length > 0 &&
  !prefersReducedMotion &&
  "IntersectionObserver" in window
) {
  document.body.classList.add("projects-reveal-ready");

  const projectObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("project-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18
    }
  );

  projectReveals.forEach((project) => {
    projectObserver.observe(project);
  });
}

// Shared Shopify password modal
const shopifyModal = document.querySelector("#shopify-modal");
const openShopifyModal = document.querySelector("#open-shopify-modal");
const closeShopifyModal = document.querySelector("#close-shopify-modal");
const shopifyModalOverlay = document.querySelector("#shopify-modal-overlay");
const copyPasswordButton = document.querySelector("#copy-password-button");
const storePassword = document.querySelector("#store-password");

if (shopifyModal && openShopifyModal && closeShopifyModal) {
  let previousFocus = null;
  let previousOverflow = "";
  let copyResetTimeout;

  const isModalOpen = () => {
    return (
      shopifyModal.classList.contains("is-open") ||
      shopifyModal.classList.contains("modal-open")
    );
  };

  const openStoreModal = (event) => {
    event?.preventDefault();

    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;

    shopifyModal.classList.add("modal-open", "is-open");
    shopifyModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    closeShopifyModal.focus();
  };

  const closeStoreModal = () => {
    if (!isModalOpen()) return;

    shopifyModal.classList.remove("modal-open", "is-open");
    shopifyModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = previousOverflow;

    if (previousFocus && previousFocus.isConnected) {
      previousFocus.focus();
    }
  };

  // Open and close controls
  openShopifyModal.addEventListener("click", openStoreModal);
  closeShopifyModal.addEventListener("click", closeStoreModal);

  if (shopifyModalOverlay) {
    shopifyModalOverlay.addEventListener("click", closeStoreModal);
  }

  shopifyModal.addEventListener("click", (event) => {
    if (event.target === shopifyModal) {
      closeStoreModal();
    }
  });

  // Keyboard accessibility
  document.addEventListener("keydown", (event) => {
    if (!isModalOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeStoreModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = Array.from(
      shopifyModal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), ' +
        'select:not([disabled]), textarea:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => {
      return element.getClientRects().length > 0;
    });

    if (!focusable.length) {
      event.preventDefault();
      shopifyModal.setAttribute("tabindex", "-1");
      shopifyModal.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    } else if (!shopifyModal.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  });

  // Copy Shopify store password
  if (copyPasswordButton && storePassword) {
    copyPasswordButton.addEventListener("click", async () => {
      const password = storePassword.textContent.trim();

      clearTimeout(copyResetTimeout);

      try {
        await navigator.clipboard.writeText(password);

        copyPasswordButton.textContent = "COPIED ✓";

        copyResetTimeout = setTimeout(() => {
          copyPasswordButton.textContent = "COPY";
        }, 2000);
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();

        range.selectNodeContents(storePassword);
        selection.removeAllRanges();
        selection.addRange(range);

        copyPasswordButton.textContent = "SELECT";
      }
    });
  }
}

// Click and tap snow — About page only
if (
  document.body.classList.contains("about-page") &&
  !prefersReducedMotion
) {
  document.addEventListener("pointerdown", (event) => {
    if (
      event.target.closest(
        "a, button, input, textarea, select, label, .store-modal"
      )
    ) {
      return;
    }

    createSnowBurst(event.clientX, event.clientY);
  });
}

function createSnowBurst(x, y) {
  const numberOfFlakes = 6;

  for (let i = 0; i < numberOfFlakes; i++) {
    const snowflake = document.createElement("span");
    snowflake.classList.add("click-snowflake");

    const size = Math.random() * 5 + 3;
    const drift = Math.random() * 80 - 40;
    const duration = Math.random() * 1.5 + 2;

    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;

    snowflake.style.left = `${
      x + (Math.random() * 30 - 15)
    }px`;

    snowflake.style.top = `${
      y + (Math.random() * 20 - 10)
    }px`;

    snowflake.style.setProperty("--snow-drift", `${drift}px`);
    snowflake.style.animationDuration = `${duration}s`;

    document.body.appendChild(snowflake);

    setTimeout(() => {
      snowflake.remove();
    }, duration * 1000);
  }
}

