//smooth scroll
(function () {
  let currentScroll = window.scrollY;
  let velocity = 0;
  const friction = 0.9;       // slightly higher friction for smoother deceleration
  const acceleration = 0.1;    // lower acceleration for gentler speed
  const maxSpeed = 30;         // lower max speed for control

  window.addEventListener('wheel', function (e) {
    e.preventDefault();
    velocity += e.deltaY * acceleration;
    velocity = Math.max(Math.min(velocity, maxSpeed), -maxSpeed);
    startAnimation();
  }, { passive: false });

  let ticking = false;

  function startAnimation() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(step);
    }
  }

  function step() {
    currentScroll += velocity;
    velocity *= friction;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    currentScroll = Math.max(0, Math.min(currentScroll, maxScroll));

    window.scrollTo(0, currentScroll);

    if (Math.abs(velocity) > 0.1) {
      requestAnimationFrame(step);
    } else {
      velocity = 0;
      ticking = false;
    }
  }
})();