// FAZLEY RABBI — INTERACTIVE PLAYGROUND ENGINE

export function initPlaygroundEngine() {
  if (typeof window === "undefined") return;

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Custom Physics Cursor
  const cursor = document.getElementById("pg-cursor");
  const label = cursor?.querySelector(".pg-cursor-label") as HTMLElement | null;

  if (cursor && !isReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    document.body.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function lerpCursor() {
      if (!cursor) return;
      cursorX += (mouseX - cursorX) * 0.25;
      cursorY += (mouseY - cursorY) * 0.25;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(lerpCursor);
    }
    lerpCursor();

    // Hover Listeners for cursor state updates
    const interactiveElements = document.querySelectorAll<HTMLElement>("a, button, [data-cursor]");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const customState = el.dataset.cursor || "VIEW";
        cursor.classList.add("is-hovering");
        if (label) label.textContent = customState;
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-hovering", "is-dragging", "is-easter");
        if (label) label.textContent = "EXPLORE";
      });
    });
  }

  // 2. Draggable Stickers Physics
  const draggables = document.querySelectorAll<HTMLElement>(".pg-draggable");
  draggables.forEach((el) => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    el.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      el.style.position = "fixed";
      el.style.left = `${initialLeft}px`;
      el.style.top = `${initialTop}px`;
      el.style.zIndex = "900";
      cursor?.classList.add("is-dragging");
      if (label) label.textContent = "DRAG";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = `${initialLeft + dx}px`;
      el.style.top = `${initialTop + dy}px`;
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      cursor?.classList.remove("is-dragging");
      if (label) label.textContent = "EXPLORE";
    });
  });

  // 3. Magnetic Tech Tags
  const magneticTags = document.querySelectorAll<HTMLElement>(".pg-magnetic");
  magneticTags.forEach((tag) => {
    tag.addEventListener("mousemove", (e) => {
      if (isReducedMotion) return;
      const rect = tag.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      tag.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px) scale(1.08)`;
    });

    tag.addEventListener("mouseleave", () => {
      tag.style.transform = `translate(0px, 0px) scale(1)`;
    });
  });

  // 4. Easter Eggs Suite
  // Egg A — Rapid Multi-click sticker
  const easterClicker = document.getElementById("pg-easter-clicker");
  let clickCount = 0;
  easterClicker?.addEventListener("click", () => {
    clickCount++;
    if (clickCount >= 5) {
      easterClicker.classList.add("is-secret-unlocked");
      const secretText = easterClicker.querySelector(".pg-secret-reveal");
      if (secretText) secretText.classList.remove("hidden");
      cursor?.classList.add("is-easter");
      if (label) label.textContent = "FOUND IT!";
      setTimeout(() => {
        cursor?.classList.remove("is-easter");
      }, 3000);
    }
  });

  // Egg D — Keyboard Code Sequence "P-L-A-Y"
  let secretKeyBuffer = "";
  window.addEventListener("keydown", (e) => {
    secretKeyBuffer += e.key.toUpperCase();
    if (secretKeyBuffer.length > 10) secretKeyBuffer = secretKeyBuffer.slice(-10);
    if (secretKeyBuffer.includes("PLAY")) {
      document.body.classList.toggle("pg-party-mode");
      secretKeyBuffer = "";
      cursor?.classList.add("is-easter");
      if (label) label.textContent = "PLAY MODE!";
    }
  });
}

// Auto init on load & Astro page transitions
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initPlaygroundEngine);
  document.addEventListener("astro:page-load", initPlaygroundEngine);
}
