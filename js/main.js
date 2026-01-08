// ==================================================
// main.js - Global Site Logic & UI Interactions
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
  
  // ------------------------
  // 1. Detect Touch Devices
  // ------------------------
  const isTouchDevice = window.matchMedia("(hover: none)").matches;

  // ------------------------
  // 2. Smooth Scrolling (Global)
  // ------------------------
  (function initSmoothScroll() {
    if (isTouchDevice) return; // Disable for touch to keep native feel
    let currentScroll = window.scrollY;
    let velocity = 0;
    window.addEventListener('wheel', e => {
        e.preventDefault();
        velocity = Math.max(Math.min(velocity + e.deltaY * 0.1, 30), -30);
        requestAnimationFrame(function step() {
            currentScroll = Math.max(0, Math.min(currentScroll + velocity, document.body.scrollHeight - window.innerHeight));
            window.scrollTo(0, currentScroll);
            velocity *= 0.9;
            if (Math.abs(velocity) > 0.1) requestAnimationFrame(step);
        });
    }, { passive: false });
  })();

  // ------------------------
  // 3. Scroll Progress Bar
  // ------------------------
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    });
  }

  // ------------------------
  // 4. Navigation & Menu
  // ------------------------
  const menuBtn = document.getElementById('rcs-menuBtn');
  const fullscreenMenu = document.getElementById('rcs-fullscreenMenu');
  const navLinks = document.querySelectorAll('.rcs-nav-link');

  if (menuBtn && fullscreenMenu) {
    const toggleMenu = () => {
      fullscreenMenu.classList.toggle('rcs-open');
      if (fullscreenMenu.classList.contains('rcs-open')) {
          fullscreenMenu.style.transform = "translateX(0)";
      } else {
          fullscreenMenu.style.transform = "translateX(100%)";
      }
    };
    menuBtn.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', toggleMenu));
  }

  // ------------------------
  // 5. Hero Animations & Parallax (Home)
  // ------------------------
  const heroImage = document.querySelector('.hero-image');
  const content = document.querySelector('.hero-content');
  const bg = document.querySelector('.hero-bg');

  if (heroImage) {
    heroImage.style.transition = 'none';
    heroImage.style.transform = 'scale(1.2)';
    heroImage.style.opacity = '0';
    requestAnimationFrame(() => {
      heroImage.style.transition = 'transform 900ms cubic-bezier(.2,.9,.3,1), opacity 380ms ease';
      heroImage.style.opacity = '1';
      heroImage.style.transform = 'scale(1)';
    });
  }

  if (content) {
    Array.from(content.children).forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'all 0.6s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 100);
    });
  }

  if (bg && !isTouchDevice) {
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
  // 6. Background Canvas Animation
  // ------------------------
  const canvas = document.getElementById("bgCanvas");
  if (canvas) {
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
        
        ctx.beginPath();
        ctx.fillStyle = "rgba(120,180,255,0.45)";
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();

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
  }

  // ------------------------
  // 7. Page Interactions (Merged)
  // ------------------------

  // A. Countdown (Index)
  const dEl = document.getElementById("cd-days");
  if (dEl) {
    const hEl = document.getElementById("cd-hours");
    const mEl = document.getElementById("cd-minutes");
    const sEl = document.getElementById("cd-seconds");
    const eventIST = new Date("2026-01-18T10:30:00+05:30");

    function updateCountdown() {
      const now = new Date();
      const diffMs = eventIST.getTime() - now.getTime();
      if (diffMs <= 0) {
        dEl.textContent = "00"; hEl.textContent = "00";
        mEl.textContent = "00"; sEl.textContent = "00";
        return;
      }
      const totalSeconds = Math.floor(diffMs / 1000);
      dEl.textContent = String(Math.floor(totalSeconds / 86400)).padStart(2, "0");
      hEl.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
      mEl.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      sEl.textContent = String(totalSeconds % 60).padStart(2, "0");
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  // B. Card Expansions (Projects/Events)
  const projectCards = document.querySelectorAll(".project-card");
  if (projectCards.length > 0) {
    projectCards.forEach(card => {
      card.addEventListener("click", () => {
        const isExpanded = card.classList.contains("expanded");
        projectCards.forEach(c => c.classList.remove("expanded", "dimmed"));
        if (!isExpanded) {
          card.classList.add("expanded");
          projectCards.forEach(c => { if (c !== card) c.classList.add("dimmed"); });
          setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
        }
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") projectCards.forEach(c => c.classList.remove("expanded", "dimmed"));
    });
  }

  // Events Toggle Buttons
  const toggleBtns = document.querySelectorAll(".evt-toggle-btn");
  toggleBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const card = btn.closest(".evt-card");
      const isOpen = card.classList.contains("expanded");
      document.querySelectorAll(".evt-card.expanded").forEach(c => {
        c.classList.remove("expanded");
        const b = c.querySelector(".evt-toggle-btn");
        if (b) b.textContent = "Know More";
      });
      if (!isOpen) {
        card.classList.add("expanded");
        btn.textContent = "Show Less";
      } else {
        card.classList.remove("expanded");
        btn.textContent = "Know More";
      }
    });
  });

  // Upcoming Event Cards Click
  const upcomingCards = document.querySelectorAll(".evt-section .evt-card");
  upcomingCards.forEach(card => {
    if (card.querySelector(".evt-toggle-btn")) return;
    card.addEventListener("click", e => {
      if (e.target.closest(".evt-action-btn")) return;
      const isOpen = card.classList.contains("expanded");
      document.querySelectorAll(".evt-card.expanded").forEach(c => c.classList.remove("expanded"));
      if (!isOpen) card.classList.add("expanded");
    });
  });

  // C. Metrics Counter (Achievements)
  const metricsSection = document.querySelector(".achv-metrics");
  if (metricsSection) {
    const counters = metricsSection.querySelectorAll("span");
    let animated = false;
    const animateCounters = () => {
      if (animated) return;
      animated = true;
      counters.forEach(counter => {
        const raw = counter.innerText.replace(/[^\d]/g, "");
        const target = parseInt(raw, 10);
        if (isNaN(target)) return;
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 60));
        const isCurrency = counter.innerText.includes("₹");
        const update = () => {
          current += increment;
          if (current >= target) {
            counter.innerText = isCurrency ? "₹" + target + "L+" : target;
          } else {
            counter.innerText = isCurrency ? "₹" + current : current;
            requestAnimationFrame(update);
          }
        };
        update();
      });
    };
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) animateCounters();
    }, { threshold: 0.4 });
    observer.observe(metricsSection);
  }

  // D. Slider (About)
  const slider = document.querySelector('.abt-slider');
  if (slider) {
    document.querySelector('.next').addEventListener('click', () => {
      slider.appendChild(document.querySelectorAll('.abt-slides')[0]);
    });
    document.querySelector('.prev').addEventListener('click', () => {
      const slides = document.querySelectorAll('.abt-slides');
      slider.prepend(slides[slides.length - 1]);
    });
  }

  // E. Form Handling (Contact)
  const contactForm = document.getElementById('originalContactForm');
  if (contactForm) {
    const successView = document.getElementById('successView');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      successView.style.display = 'block';
    });
    document.getElementById('fillAgainBtn').addEventListener('click', () => {
      contactForm.reset();
      contactForm.style.display = 'block';
      successView.style.display = 'none';
    });
  }
});