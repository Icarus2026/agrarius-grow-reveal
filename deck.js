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

  // Pick the cut that matches the screen. A 16:9 reveal cover-cropped into a
  // portrait phone shows bare paper with the mark off-frame, so portrait gets
  // the 9:16 cut. Re-picked on resize/rotate, and only when it actually changes
  // (setting .src reloads the video and would restart the animation).
  const pickSource = () => {
    const portrait = window.matchMedia('(max-aspect-ratio: 1/1)').matches;
    const want = reveal.dataset[portrait ? 'portrait' : 'landscape'];
    if (want && !reveal.currentSrc.endsWith(want.split('/').pop())) {
      reveal.src = want;
      reveal.load();
      return true;
    }
    return false;
  };
  pickSource();
  addEventListener('resize', () => { if (pickSource()) play(); });

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
