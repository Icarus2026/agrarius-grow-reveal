const deck = document.querySelector('.deck');
const slides = () => document.querySelectorAll('.slide');

// Which slide are we on? This CANNOT be scrollTop / innerHeight: on mobile the
// slides deliberately grow to different heights, so that maths drifts and the
// arrow keys start skipping or jumping backwards. Measure the real boxes.
const idx = () => {
  const s = slides();
  let best = 0, bestDist = Infinity;
  s.forEach((el, i) => {
    const d = Math.abs(el.getBoundingClientRect().top);
    if (d < bestDist) { bestDist = d; best = i; }
  });
  return best;
};

const go = i => { const s = slides(); if (i >= 0 && i < s.length) s[i].scrollIntoView({behavior:'smooth'}); };

addEventListener('keydown', e => {
  if (['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)) { e.preventDefault(); go(idx()+1); }
  if (['ArrowUp','ArrowLeft','PageUp'].includes(e.key)) { e.preventDefault(); go(idx()-1); }
  if (e.key === 'Home') { e.preventDefault(); go(0); }
  if (e.key === 'End') { e.preventDefault(); go(slides().length-1); }
});

// The closing logo-reveal draws itself in each time the slide is reached, then
// HOLDS on the finished mark. It must never loop: the first frame is blank
// paper, so looping would wipe the logo away in front of the room.
const reveal = document.querySelector('.reveal-video');
if (reveal) {
  reveal.loop = false;
  const play = () => { reveal.currentTime = 0; reveal.play().catch(() => {}); };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) play(); });
    }, { threshold: 0.55 }).observe(reveal);
  } else {
    play();
  }
}

const c = document.querySelector('.slide-counter');
const upd = () => {
  if (!c) return;
  const s = slides(), i = idx();
  c.textContent = `${i+1} / ${s.length}`;
  // the counter is bone: it disappears on the bone/linen slides unless it flips
  const light = s[i] && (s[i].classList.contains('slide--light') || s[i].classList.contains('slide--linen'));
  c.classList.toggle('is-light', !!light);
};
deck.addEventListener('scroll', upd, {passive:true});
addEventListener('resize', upd);
upd();
