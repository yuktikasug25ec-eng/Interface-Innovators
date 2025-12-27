// ========================
// main.js for Robotics Club
// ========================

// Detect touch devices
const isTouchDevice = window.matchMedia("(hover: none)").matches;

// ------------------------
// Scroll Progress Bar
// ------------------------
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  progressBar.style.width = `${scrollPercent}%`;
});

// ------------------------
// Fullscreen Menu
// ------------------------
const menuBtn = document.getElementById('rcs-menuBtn');
const fullscreenMenu = document.getElementById('rcs-fullscreenMenu');
const navLinks = document.querySelectorAll('.rcs-nav-link');

const toggleMenu = () => {
  fullscreenMenu.classList.toggle('rcs-open');
  menuBtn.classList.toggle('open');
};

menuBtn.addEventListener('click', toggleMenu);
navLinks.forEach(link => link.addEventListener('click', toggleMenu));

// ------------------------
// Hero Mouse Parallax
// ------------------------
const bg = document.querySelector('.hero-bg');
if (bg) {
  bg.addEventListener('mousemove', e => {
    const rect = bg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    bg.style.setProperty('--mx', `${x}%`);
    bg.style.setProperty('--my', `${y}%`);
  });
  bg.addEventListener('mouseleave', () => {
    bg.style.removeProperty('--mx');
    bg.style.removeProperty('--my');
  });
}

// ------------------------
// Glow Canvas Background
// ------------------------
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let dpr = window.devicePixelRatio || 1;
let dots = [];
let mouse = { x: -9999, y: -9999 };
const DOT_SPACING = isTouchDevice ? 36 : 26;
const GLOW_RADIUS = isTouchDevice ? 140 : 210;
const DOT_RADIUS = 2.6;
const DRIFT_STRENGTH = 0.12;

function resizeCanvas() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  dots = [];
  for (let x = 0; x <= w; x += DOT_SPACING) {
    for (let y = 0; y <= h; y += DOT_SPACING) {
      dots.push({ x, y, ox: x, oy: y, glow: 0 });
    }
  }
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

let time = 0;
function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  time += 0.002;

  for (const dot of dots) {
    dot.x = dot.ox + Math.sin(time + dot.oy * 0.015) * DRIFT_STRENGTH;
    dot.y = dot.oy + Math.cos(time + dot.ox * 0.015) * DRIFT_STRENGTH;

    const dx = mouse.x - dot.x;
    const dy = mouse.y - dot.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const targetGlow = dist < GLOW_RADIUS ? 1 - dist / GLOW_RADIUS : 0;
    dot.glow += (targetGlow - dot.glow) * 0.18;

    // Base dot
    ctx.beginPath();
    ctx.fillStyle = "rgba(120,180,255,0.45)";
    ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Glow
    if (dot.glow > 0.01) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(140,200,255,${0.7 * dot.glow})`;
      ctx.shadowBlur = 18 * dot.glow;
      ctx.shadowColor = "rgba(140,200,255,1)";
      ctx.arc(dot.x, dot.y, DOT_RADIUS + 1.8 * dot.glow, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ------------------------
// Hero Entrance Animations
// ------------------------
window.addEventListener('load', () => {
  const heroImage = document.querySelector('.hero-image');
  const content = document.querySelector('.hero-content');

  if (heroImage) {
    const r = heroImage.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const vcx = window.innerWidth / 2;
    const vcy = window.innerHeight / 2;
    const dx = vcx - cx;
    const dy = vcy - cy;
    heroImage.style.transition = 'none';
    heroImage.style.transformOrigin = 'center center';
    heroImage.style.transform = `translate(${dx}px, ${dy}px) scale(2)`;
    heroImage.style.opacity = '0';
    requestAnimationFrame(() => {
      heroImage.style.transition = 'transform 900ms cubic-bezier(.2,.9,.3,1), opacity 380ms ease';
      heroImage.style.opacity = '1';
      heroImage.style.transform = 'translate(0,0) scale(1)';
    });
  }

  if (content) {
    const items = Array.from(content.children);
    const vcx = window.innerWidth / 2;
    const vcy = window.innerHeight / 2;

    items.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const dx = Math.round(vcx - (r.left + r.width / 2));
      const dy = Math.round(vcy - (r.top + r.height / 2));
      el.style.transition = 'none';
      el.style.transformOrigin = 'center center';
      el.style.opacity = '0';
      el.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
      el.dataset.enterDelay = String(i * 80);
    });

    requestAnimationFrame(() => {
      items.forEach(el => {
        const delay = Number(el.dataset.enterDelay);
        el.style.transition = `transform 700ms cubic-bezier(.2,.9,.3,1) ${delay}ms, opacity 500ms ease ${delay}ms`;
        el.style.opacity = '1';
        el.style.transform = 'translate(0,0) scale(1)';
      });
    });
  }
});


// ===== Reliable Countdown (IST) =====
(function () {
  const dEl = document.getElementById("cd-days");
  const hEl = document.getElementById("cd-hours");
  const mEl = document.getElementById("cd-minutes");
  const sEl = document.getElementById("cd-seconds");

  if (!dEl || !hEl || !mEl || !sEl) {
    console.error("Countdown elements not found");
    return;
  }

  // Event in IST: 18 January 2026, 10:30 IST
  const eventIST = new Date("2026-01-18T10:30:00+05:30");

  function updateCountdown() {
    const now = new Date();
    const diffMs = eventIST.getTime() - now.getTime();

    if (diffMs <= 0) {
      dEl.textContent = "00";
      hEl.textContent = "00";
      mEl.textContent = "00";
      sEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    dEl.textContent = String(days).padStart(2, "0");
    hEl.textContent = String(hours).padStart(2, "0");
    mEl.textContent = String(minutes).padStart(2, "0");
    sEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();


//Project filter logic
const yearFilter = document.getElementById("yearFilter");
const typeFilter = document.getElementById("typeFilter");
const cards = document.querySelectorAll(".project-card");

function filterProjects() {
  const year = yearFilter.value;
  const type = typeFilter.value;

  cards.forEach(card => {
    const cardYear = card.dataset.year;
    const cardType = card.dataset.type;

    const yearMatch = year === "all" || cardYear === year;
    const typeMatch = type === "all" || cardType === type;

    card.style.display = (yearMatch && typeMatch) ? "flex" : "none";
  });
}

yearFilter.addEventListener("change", filterProjects);
typeFilter.addEventListener("change", filterProjects);


const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach(card => {
  card.addEventListener("click", () => {

    const isExpanded = card.classList.contains("expanded");

    // Reset all cards
    projectCards.forEach(c => {
      c.classList.remove("expanded", "dimmed");
    });

    if (!isExpanded) {
      // Expand clicked card
      card.classList.add("expanded");

      // Dim others
      projectCards.forEach(c => {
        if (c !== card) c.classList.add("dimmed");
      });

      // Scroll into view smoothly
      card.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  });
});

