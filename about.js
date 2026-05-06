document.addEventListener("DOMContentLoaded", () => {

  const sky       = document.getElementById("sky");
  const particles = document.getElementById("particles");
  const themeBtn  = document.getElementById("themeBtn");
  const html      = document.documentElement;

  /* ── CLOUDS ── */
  for (let i = 0; i < 5; i++) {
    const cloud = document.createElement("img");
    const size  = Math.random() * 400 + 800;
    cloud.style.width = size + "px";
    cloud.src = "cloud.png";
    cloud.classList.add("cloud");
    cloud.style.left = Math.random() * 100 + "vw";
    cloud.style.top  = Math.random() * 100 + "vh";
    const dur = 50 + Math.random() * 40;
    cloud.style.animationDuration = dur + "s";
    cloud.style.animationDelay   = -(Math.random() * dur) + "s";
    sky.appendChild(cloud);
  }

  /* ── STARS & METEORS ── */
  let starsCreated = false;
  let meteorTimer  = null;

  function createStars() {
    for (let i = 0; i < 150; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      const size = Math.random() * 5 + 2;
      star.style.width   = size + "px";
      star.style.height  = size + "px";
      star.style.left    = Math.random() * window.innerWidth  + "px";
      star.style.top     = Math.random() * window.innerHeight + "px";
      star.style.opacity = Math.random() * 0.5 + 0.3;
      const delay = Math.random() * 4;
      const twink = Math.random() * 5 + 3;
      star.style.animation = `twinkle ${twink}s ease-in-out ${delay}s infinite, drift 15s linear infinite`;
      particles.appendChild(star);
    }
    starsCreated = true;
  }

  function clearDark() {
    particles.innerHTML = "";
    starsCreated = false;
    if (meteorTimer) { clearTimeout(meteorTimer); meteorTimer = null; }
  }

  function createMeteor() {
    const m = document.createElement("div");
    m.classList.add("meteor");
    m.style.left = (Math.random() * window.innerWidth * 0.9) + "px";
    m.style.top  = "-100px";
    const dur = Math.random() + 1.2;
    m.style.animation = `meteorFall ${dur}s linear forwards`;
    particles.appendChild(m);
    setTimeout(() => m.remove(), dur * 1000);
  }

  function meteorBurst() {
    if (html.getAttribute("data-theme") !== "dark") return;
    const n = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < n; i++) setTimeout(() => createMeteor(), i * 150);
  }

  function scheduleShower() {
    if (html.getAttribute("data-theme") !== "dark") return;
    meteorTimer = setTimeout(() => { meteorBurst(); scheduleShower(); }, Math.random() * 4000 + 2000);
  }

  /* ── THEME ── */
  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const earthImg = document.getElementById("earthImg");
    if (earthImg) earthImg.src = theme === "dark" ? "moon.png" : "earth.png";
    if (theme === "dark") {
      if (!starsCreated) createStars();
      scheduleShower();
    } else {
      clearDark();
    }
  }

  themeBtn.addEventListener("click", () => {
    applyTheme(html.getAttribute("data-theme") === "light" ? "dark" : "light");
  });

  applyTheme(localStorage.getItem("theme") || "light");


  const sections   = Array.from({ length: 6 }, (_, i) => document.getElementById(`sec${i + 1}`));
  const thresholds = [0, 0.8, 1.6, 2.4, 3.2, 4.0];
  let current      = 0;
  let isAnimating  = false;

  /* Put all sections in a clean hidden state via class only — no inline styles */
  function resetAll() {
    sections.forEach(sec => {
      sec.className = "about-section sect-hidden";
    });
  }

  function getTarget(ratio) {
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (ratio >= thresholds[i]) return i;
    }
    return 0;
  }

  function transitionTo(next, direction) {
    if (next === current || isAnimating) return;
    isAnimating = true;

    const leaving  = sections[current];
    const entering = sections[next];


    leaving.classList.remove("sect-visible", "sect-entering");
    leaving.classList.add(direction > 0 ? "sect-exit-out" : "sect-exit-in");

    setTimeout(() => {


      leaving.className = "about-section sect-hidden";


      entering.className = "about-section sect-visible sect-entering";


      setTimeout(() => {
        entering.classList.remove("sect-entering");
        isAnimating = false;
      }, 850);

      current = next;

    }, 500); 
  }


  resetAll();
  sections[0].className = "about-section sect-visible sect-entering";
  setTimeout(() => sections[0].classList.remove("sect-entering"), 1000);

  /* Scroll */
  window.addEventListener("scroll", () => {
    if (isAnimating) return;
    const ratio  = window.scrollY / window.innerHeight;
    const target = getTarget(ratio);
    if (target !== current) {
      transitionTo(target, target > current ? 1 : -1);
    }
  });

});