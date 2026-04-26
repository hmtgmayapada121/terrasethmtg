// ==========================
// ANIMASI SCROLL (ABOUT PAGE)
// ==========================
window.addEventListener("load", () => {

  const faders = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  faders.forEach(el => observer.observe(el));

  window.dispatchEvent(new Event('scroll'));

});