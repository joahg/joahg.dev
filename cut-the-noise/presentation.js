(() => {
  const links = [...document.querySelectorAll('.slide-link')];
  const panel = document.getElementById('presentation');
  const board = document.getElementById('storyboard');
  const image = document.getElementById('active-slide');
  const sourceLayer = document.getElementById('slide-sources');
  function positionSourceLinks() {
    const scale = Math.min(panel.clientWidth / 1280, panel.clientHeight / 720);
    const left = (panel.clientWidth - 1280 * scale) / 2;
    const top = (panel.clientHeight - 720 * scale) / 2;
    for (const anchor of sourceLayer.children) {
      const box = JSON.parse(anchor.dataset.box);
      anchor.style.cssText = `left:${left + box.x * scale}px;top:${top + box.y * scale}px;width:${box.width * scale}px;height:${box.height * scale}px`;
    }
  }
  function showSourceLinks() {
    sourceLayer.replaceChildren();
    for (const source of JSON.parse(links[current].dataset.sources || '[]')) {
      const anchor = document.createElement('a');
      anchor.className = 'source-hotspot'; anchor.href = source.url;
      anchor.setAttribute('aria-label', `Open ${source.label}`);
      anchor.title = source.label;
      anchor.dataset.box = JSON.stringify(source);
      if (source.external) { anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
      sourceLayer.append(anchor);
    }
    positionSourceLinks();
  }
  window.addEventListener('resize', positionSourceLinks);
  const counter = document.getElementById('counter');
  const previous = document.getElementById('previous');
  const next = document.getElementById('next');
  let current = 0, returnFocus = null, timer, touchStart;
  const active = () => !panel.hidden;
  function reveal() {
    panel.classList.remove('idle'); clearTimeout(timer);
    timer = setTimeout(() => { if (!document.getElementById('controls').contains(document.activeElement)) panel.classList.add('idle'); }, 2200);
  }
  function show(index) {
    current = Math.max(0, Math.min(links.length - 1, index));
    const source = links[current].querySelector('img');
    image.src = source.src; image.alt = source.alt;
    counter.textContent = `${current + 1} / ${links.length}`;
    previous.disabled = current === 0; next.disabled = current === links.length - 1;
    document.title = `${current + 1}. ${links[current].dataset.title} — Cut the Noise`;
    showSourceLinks();
    reveal();
    if (current + 1 < links.length) { const preload = new Image(); preload.src = links[current + 1].querySelector('img').src; }
  }
  function sync() {
    const match = location.hash.match(/^#slide-(\d+)$/);
    if (match && Number(match[1]) >= 1 && Number(match[1]) <= links.length) {
      if (!active()) { returnFocus = document.activeElement; panel.hidden = false; board.inert = true; document.body.classList.add('presenting'); panel.focus(); }
      show(Number(match[1]) - 1);
    } else if (active()) {
      panel.hidden = true; board.inert = false; document.body.classList.remove('presenting'); clearTimeout(timer);
      document.title = 'Cut the Noise — Joah Gerstenberg';
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      (returnFocus && returnFocus !== document.body ? returnFocus : links[current]).focus({preventScroll:true});
    }
  }
  function go(index, replace = true) {
    const hash = `#slide-${Math.max(0, Math.min(links.length - 1, index)) + 1}`;
    history[replace ? 'replaceState' : 'pushState'](null, '', hash); sync();
  }
  function exit() { history.replaceState(null, '', location.pathname + location.search); sync(); }
  async function fullscreen() { if (document.fullscreenElement) await document.exitFullscreen(); else if (panel.requestFullscreen) await panel.requestFullscreen().catch(() => {}); panel.focus(); }
  links.forEach((link, index) => link.addEventListener('click', event => { event.preventDefault(); returnFocus = link; go(index, false); }));
  document.getElementById('start').addEventListener('click', () => go(0, false));
  document.getElementById('exit').addEventListener('click', exit);
  previous.addEventListener('click', () => go(current - 1)); next.addEventListener('click', () => go(current + 1));
  document.getElementById('fullscreen').addEventListener('click', fullscreen);
  document.addEventListener('fullscreenchange', () => { document.getElementById('fullscreen').textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen'; positionSourceLinks(); reveal(); });
  window.addEventListener('hashchange', sync); window.addEventListener('popstate', sync);
  document.addEventListener('keydown', event => {
    if (!active() || event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key;
    if (key === 'Tab') {
      reveal(); const focusable = [...panel.querySelectorAll('button:not(:disabled), a:not([hidden])')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      return;
    }
    if (['ArrowRight','ArrowDown','PageDown',' ','ArrowLeft','ArrowUp','PageUp','Home','End','Escape','f','F'].includes(key)) {
      if (key === ' ' && ['BUTTON', 'A'].includes(document.activeElement.tagName)) return;
      event.preventDefault();
      if (key === 'Escape') exit();
      else if (key === 'Home') go(0);
      else if (key === 'End') go(links.length - 1);
      else if (key.toLowerCase() === 'f') fullscreen();
      else go(current + (['ArrowLeft','ArrowUp','PageUp'].includes(key) || (key === ' ' && event.shiftKey) ? -1 : 1));
    }
  });
  panel.addEventListener('pointermove', reveal);
  panel.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, {passive:true});
  panel.addEventListener('touchend', event => { if (event.target.closest('button, a')) return; const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 60) go(current + (distance < 0 ? 1 : -1)); reveal(); }, {passive:true});
  sync();
})();
