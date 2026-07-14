const deck = document.querySelector('.deck');
const slides = () => document.querySelectorAll('.slide');
const idx = () => Math.round(deck.scrollTop / window.innerHeight);
const go = i => { const s = slides(); if (i >= 0 && i < s.length) s[i].scrollIntoView({behavior:'smooth'}); };

addEventListener('keydown', e => {
  if (['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)) { e.preventDefault(); go(idx()+1); }
  if (['ArrowUp','ArrowLeft','PageUp'].includes(e.key)) { e.preventDefault(); go(idx()-1); }
  if (e.key === 'Home') { e.preventDefault(); go(0); }
  if (e.key === 'End') { e.preventDefault(); go(slides().length-1); }
});

// The closing mark draws itself in each time the slide comes into view,
// then holds on the finished logo (it does not loop back to blank paper).
const reveal = document.querySelector('.close-reveal');
if (reveal && 'IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { reveal.currentTime = 0; reveal.play().catch(() => {}); }
    });
  }, { threshold: 0.6 }).observe(reveal);
}

const c = document.querySelector('.slide-counter');
const upd = () => {
  if (!c) return;
  const s = slides(), i = Math.min(idx(), s.length - 1);
  c.textContent = `${i+1} / ${s.length}`;
  // the counter is bone: it disappears on the bone/linen slides unless it flips
  const light = s[i] && (s[i].classList.contains('slide--light') || s[i].classList.contains('slide--linen'));
  c.classList.toggle('is-light', !!light);
};
deck.addEventListener('scroll', upd, {passive:true});
addEventListener('resize', upd);
upd();
