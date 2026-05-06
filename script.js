document.addEventListener("DOMContentLoaded", () => {

  /* ── DOM refs ── */
  const sky = document.getElementById("sky");
  const particles = document.getElementById("particles");
  const themeBtn = document.getElementById("themeBtn");
  const html = document.documentElement;

  const cloudNum = 5;

  function createCloud() {
    const cloud = document.createElement("img");
    const randomSize = Math.random() * 400 + 800;
    cloud.style.width = randomSize + "px";
    cloud.src = "cloud.png";
    cloud.classList.add("cloud");

    cloud.style.left = Math.random() * 100 + "vw";
    cloud.style.top = (Math.random() * 100) + "vh";

    const duration = 50 + Math.random() * 40;
    cloud.style.animationDuration = duration + "s";
    cloud.style.animationDelay = -(Math.random() * duration) + "s";

    sky.appendChild(cloud);
  }

  for (let i = 0; i < cloudNum; i++) {
    createCloud();
  }

  let starsCreated = false;
  let meteorTimer = null;

  function createStars() {
    for (let i = 0; i < 150; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      const size = Math.random() * 5 + 2;
      star.style.width = size + "px";
      star.style.height = size + "px";

      star.style.left = Math.random() * window.innerWidth + "px";
      star.style.top = Math.random() * window.innerHeight + "px";
      star.style.opacity = Math.random() * 0.5 + 0.3;

      const delay = Math.random() * 4;
      const twinkleDuration = Math.random() * 5 + 3;

      star.style.animation = `
        twinkle ${twinkleDuration}s ease-in-out ${delay}s infinite,
        drift 15s linear infinite
      `;

      particles.appendChild(star);
    }
    starsCreated = true;
  }

  function clearDarkElements() {
    particles.innerHTML = "";
    starsCreated = false;
    if (meteorTimer) {
      clearTimeout(meteorTimer);
      meteorTimer = null;
    }
  }

  function createMeteor() {
    const meteor = document.createElement("div");
    meteor.classList.add("meteor");

    meteor.style.left = (Math.random() * window.innerWidth * 0.9) + "px";
    meteor.style.top = "-100px";

    meteor.style.setProperty("--angle", (35 + Math.random() * 20) + "deg");
    meteor.style.setProperty("--dx", (-600 - Math.random() * 400) + "px");
    meteor.style.setProperty("--dy", (600 + Math.random() * 400) + "px");

    const duration = Math.random() * 1 + 1.2;
    meteor.style.animation = `meteorFall ${duration}s linear forwards`;

    particles.appendChild(meteor);
    setTimeout(() => meteor.remove(), duration * 1000);
  }

  function meteorShowerBurst() {
    if (html.getAttribute("data-theme") !== "dark") return;

    const count = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < count; i++) {
      setTimeout(() => createMeteor(), i * 150);
    }
  }

  function scheduleNextShower() {
    if (html.getAttribute("data-theme") !== "dark") return;

    meteorTimer = setTimeout(() => {
      meteorShowerBurst();
      scheduleNextShower();
    }, Math.random() * 4000 + 2000);
  }

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const earthImg = document.getElementById("earthImg");
    if (earthImg) {
      earthImg.src = theme === "dark" ? "moon.png" : "earth.png";
    }

    
    if (theme === "dark") {
      if (!starsCreated) createStars();
      scheduleNextShower();
    } else {
      clearDarkElements();
    }
  }

  themeBtn.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    applyTheme(current === "light" ? "dark" : "light");
  });

  applyTheme(localStorage.getItem("theme") || "light");


  const marquee = document.querySelector(".marquee-track");

  function arcifyText() {
    const spans = marquee.querySelectorAll("span");

    spans.forEach(span => {
      const text = span.textContent;
      span.innerHTML = "";

      [...text].forEach((char, i) => {
        const letter = document.createElement("span");
        letter.textContent = char;
        letter.classList.add("arc-letter");
        letter.style.setProperty("--i", i);
        span.appendChild(letter);
      });
    });
  }

  arcifyText();

});

const body = document.body;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const vh = window.innerHeight;

  body.classList.remove("show-about", "show-projects", "show-journey", "show-contact");

  if (scrollY >= vh * 2.1) {
    body.classList.add("show-contact");
  } else if (scrollY >= vh * 1.5) {
    body.classList.add("show-journey");
  } else if (scrollY >= vh * 0.9) {
    body.classList.add("show-projects");
  } else if (scrollY >= vh * 0.3) {
    body.classList.add("show-about");
  }
});
