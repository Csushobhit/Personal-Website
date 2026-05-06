document.addEventListener("DOMContentLoaded", () => {


  const sky = document.getElementById("sky");
  const particles = document.getElementById("particles");
  const themeBtn = document.getElementById("themeBtn");
  const html = document.documentElement;
  const body = document.body;


  for (let i = 0; i < 5; i++) {
    const cloud = document.createElement("img");
    const size = Math.random() * 400 + 800;

    cloud.src = "cloud.png";
    cloud.classList.add("cloud");

    cloud.style.width = size + "px";
    cloud.style.left = Math.random() * 100 + "vw";
    cloud.style.top = Math.random() * 100 + "vh";

    const duration = 50 + Math.random() * 40;
    cloud.style.animationDuration = duration + "s";
    cloud.style.animationDelay = -(Math.random() * duration) + "s";

    sky.appendChild(cloud);
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
      const duration = Math.random() * 5 + 3;

      star.style.animation = `
        twinkle ${duration}s ease-in-out ${delay}s infinite,
        drift 15s linear infinite
      `;

      particles.appendChild(star);
    }
    starsCreated = true;
  }

  function clearDark() {
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

    const duration = Math.random() + 1.2;
    meteor.style.animation = `meteorFall ${duration}s linear forwards`;

    particles.appendChild(meteor);
    setTimeout(() => meteor.remove(), duration * 1000);
  }

  function meteorBurst() {
    if (html.getAttribute("data-theme") !== "dark") return;

    const count = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < count; i++) {
      setTimeout(createMeteor, i * 150);
    }
  }

  function scheduleShower() {
    if (html.getAttribute("data-theme") !== "dark") return;

    meteorTimer = setTimeout(() => {
      meteorBurst();
      scheduleShower();
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
      scheduleShower();
    } else {
      clearDark();
    }
  }

  themeBtn.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    applyTheme(current === "light" ? "dark" : "light");
  });

  applyTheme(localStorage.getItem("theme") || "light");

});


const body = document.body;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const vh = window.innerHeight;


  body.classList.remove(
    "show-project1",
    "show-project2",
    "show-archives",
    "show-contact"
  );


  if (scrollY >= vh * 2.4) {
    body.classList.add("show-contact");
  } 
  else if (scrollY >= vh * 1.7) {
    body.classList.add("show-archives");
  } 
  else if (scrollY >= vh * 0.9) {
    body.classList.add("show-project2");
  } 
  else if (scrollY >= vh * 0.3) {
    body.classList.add("show-project1");
  }
});