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

// The closing mark is a static image now: the reveal video would not composite
// reliably (see the note in styles.css), so there is nothing to replay here.

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
