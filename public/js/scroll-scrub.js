/**
 * ScrollScrubVideo — ties a <video>'s currentTime to the scroll position.
 *
 * Elements with a `data-film` attribute are keyframes on the film's timeline:
 *
 *   data-film="4.2"                    when the element's top reaches the top of the
 *                                      viewport, the film is at 4.2s
 *   data-film="0:2.5, 0.38:4.2, 1:5.1" several keyframes; the first number is how far
 *                                      the element has scrolled past the top of the
 *                                      viewport (0 = its top edge, 1 = its bottom edge)
 *
 * Between keyframes the time is interpolated, then eased so wheel and touch
 * scrolling both read as smooth playback.
 *
 * No dependencies. The film is fetched as a Blob so every frame is in memory
 * and seeks never wait on the network. Each orientation can list several
 * renditions: the smallest is shown first so the page opens quickly, then the
 * sharpest one the screen can use is fetched and swapped in on the same frame.
 */
export class ScrollScrubVideo {
  constructor(video, options = {}) {
    this.video = video;
    this.opts = {
      sources: {},              // { landscape: url | [{ src, width, height, preview? }], portrait: ... }
      maxPixelRatio: 3,         // cap for the device pixel ratio when picking a rendition
      anchors: '[data-film]',
      ease: 0.14,               // share of the gap closed per frame; 1 = no smoothing
      safeWidth: { landscape: 0.94, portrait: 0.96 }, // share of the frame that must stay on screen
      onProgress: null,         // (0..1) while downloading
      onReady: null,
      onRendition: null,        // ({ orientation, src, width, height }) each time a source goes on screen
      onTime: null,             // (seconds, duration)
      ...options,
    };
    this.keys = [];
    this.time = 0;
    this.target = 0;
    this.duration = 0;
    this.ready = false;
    this.blobs = {};
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._tick = this._tick.bind(this);
    this.measure = this.measure.bind(this);

    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.preload = 'auto';
    video.disablePictureInPicture = true;

    this._portrait = window.matchMedia('(max-aspect-ratio: 1/1)');
    this._onOrientation = () => this._load();
    this._portrait.addEventListener('change', this._onOrientation);
    this._onResize = () => {
      this.measure();
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(() => this._load(), 400); // a bigger window may need a sharper rendition
    };
    window.addEventListener('resize', this._onResize);
    this._ro = new ResizeObserver(this.measure);
    this._ro.observe(document.documentElement);
    this._ro.observe(document.body);

    // iOS only decodes frames for a seek once the element has been played.
    this._unlock = () => {
      const p = this.video.play();
      if (p && p.then) p.then(() => this.video.pause()).catch(() => {});
    };
    window.addEventListener('touchstart', this._unlock, { once: true, passive: true });

    this._load();
    this._raf = requestAnimationFrame(this._tick);
  }

  get orientation() {
    return this._portrait.matches && this.opts.sources.portrait ? 'portrait' : 'landscape';
  }

  /** The renditions for the current orientation, smallest first. */
  _tiers(which) {
    const list = [].concat(this.opts.sources[which] || this.opts.sources.landscape || []);
    return list
      .map((t) => (typeof t === 'string' ? { src: t, width: 0 } : t))
      .sort((x, y) => x.width - y.width);
  }

  /**
   * The smallest full-quality rendition with a film pixel for every screen pixel.
   * Renditions flagged `preview` are only a quick first paint, unless the visitor is saving data.
   */
  _best(tiers) {
    const conn = navigator.connection;
    if (conn && (conn.saveData || /2g|3g/.test(conn.effectiveType || ''))) return tiers[0];
    const full = tiers.filter((t) => !t.preview);
    if (!full.length) return tiers[tiers.length - 1];
    const first = full[0];
    const aspect = first.height ? first.width / first.height : 16 / 9;
    const dpr = Math.min(window.devicePixelRatio || 1, this.opts.maxPixelRatio);
    const need = Math.max(window.innerWidth, window.innerHeight * aspect) * dpr * 0.9;
    return full.find((t) => t.width >= need) || full[full.length - 1];
  }

  /**
   * Show the smallest rendition straight away, then fetch the sharpest one this
   * screen can use and swap it in on the same frame.
   */
  async _load() {
    const which = this.orientation;
    const tiers = this._tiers(which);
    if (!tiers.length) return;
    const best = this._best(tiers);
    const job = `${which}|${best.src}`;
    if (this._job === job) return;
    this._job = job;
    const steps = this.blobs[best.src] || tiers[0] === best ? [best] : [tiers[0], best];
    for (const tier of steps) {
      let src = tier.src;
      try {
        if (!this.blobs[src]) {
          const report = tier === steps[0] && !this.ready; // only the first download drives the loader
          this.blobs[src] = URL.createObjectURL(await this._fetch(src, report));
        }
        src = this.blobs[src];
      } catch (err) {
        if (this.ready) return; // keep what is on screen
        // file:// or a blocked fetch: let the browser stream it instead
      }
      if (this._job !== job) return;
      try { await this._show(src, tier, which); } catch (err) { return; }
      if (this._job !== job) return;
    }
  }

  /** Put a source on screen. The first one uses the page's <video>; later ones are swapped in seamlessly. */
  _show(src, tier, which) {
    return new Promise((resolve, reject) => {
      const first = !this.ready;
      const video = first ? this.video : this.video.cloneNode(false);
      const cleanup = () => ['loadedmetadata', 'loadeddata', 'error'].forEach((ev) => video.removeEventListener(ev, handlers[ev]));
      const adopt = () => {
        if (!first) {
          this.video.replaceWith(video);
          this.video.removeAttribute('src');
          this.video.load();
          this.video = video;
        }
        this.duration = video.duration || 0;
        this.rendition = { orientation: which, src: tier.src, width: video.videoWidth, height: video.videoHeight };
        this.ready = true;
        this.measure();
        if (first) {
          this.time = this.target = Math.min(Math.max(0, this.duration - 0.05), this.timeAt(window.scrollY));
          video.currentTime = this.time;
          if (this.opts.onReady) this.opts.onReady(this);
        }
        if (this.opts.onRendition) this.opts.onRendition(this.rendition);
        resolve();
      };
      let done = false;
      const onData = () => {
        if (done) return;
        done = true;
        cleanup();
        if (first) return adopt();
        // decode the frame the visitor is looking at before the swap, so nothing flashes
        let swapped = false;
        const swap = () => { if (!swapped) { swapped = true; adopt(); } };
        video.addEventListener('seeked', swap, { once: true });
        setTimeout(swap, 1500);
        video.currentTime = Math.max(0.001, this.time);
      };
      const handlers = {
        // iOS may hold `loadeddata` back until playback; metadata is enough to size and seek
        loadedmetadata: () => { if (first) onData(); else if (video.readyState >= 2) onData(); },
        loadeddata: onData,
        error: () => { cleanup(); reject(new Error('film could not be decoded')); },
      };
      Object.keys(handlers).forEach((ev) => video.addEventListener(ev, handlers[ev]));
      if (!first) {
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.disablePictureInPicture = true;
      }
      video.src = src;
      video.load();
    });
  }

  async _fetch(url, report = true) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`film ${res.status}`);
    const total = Number(res.headers.get('content-length')) || 0;
    if (!res.body || !total) return res.blob();
    const reader = res.body.getReader();
    const chunks = [];
    let got = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      got += value.length;
      if (report && this.opts.onProgress) this.opts.onProgress(Math.min(1, got / total));
    }
    return new Blob(chunks, { type: res.headers.get('content-type') || 'video/mp4' });
  }

  /** Rebuild the scroll -> time keyframes and re-fit the frame. Call after layout changes. */
  measure() {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const keys = [];
    document.querySelectorAll(this.opts.anchors).forEach((el) => {
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      el.dataset.film.split(',').forEach((part) => {
        const [a, b] = part.split(':').map(Number);
        const at = b === undefined ? 0 : a;
        const time = b === undefined ? a : b;
        if (Number.isFinite(at) && Number.isFinite(time)) keys.push([Math.min(max, top + r.height * at), time]);
      });
    });
    keys.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    this.keys = keys;
    this._fit();
  }

  /** Cover the viewport, but never crop the frame's safe width; any band left over is page background. */
  _fit() {
    const video = this.video;
    const fw = video.videoWidth, fh = video.videoHeight;
    if (!fw || !fh) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const safe = this.opts.safeWidth[this.orientation] || 1;
    const scale = Math.min(Math.max(vw / fw, vh / fh), vw / (fw * safe));
    const w = Math.ceil(fw * scale), h = Math.ceil(fh * scale);
    video.style.width = `${w}px`;
    video.style.height = `${h}px`;
    video.classList.toggle('is-letterboxed', h < vh - 1);
  }

  timeAt(y) {
    const k = this.keys;
    if (!k.length) return 0;
    if (y <= k[0][0]) return k[0][1];
    for (let i = 1; i < k.length; i++) {
      if (y < k[i][0]) {
        const span = k[i][0] - k[i - 1][0];
        const f = span > 0 ? (y - k[i - 1][0]) / span : 1;
        return k[i - 1][1] + (k[i][1] - k[i - 1][1]) * f;
      }
    }
    return k[k.length - 1][1];
  }

  _tick(now) {
    this._raf = requestAnimationFrame(this._tick);
    const dt = Math.min(100, now - (this._last || now));
    this._last = now;
    if (!this.ready) return;
    const end = Math.max(0, this.duration - 0.05);
    this.target = Math.min(end, Math.max(0, this.timeAt(window.scrollY)));
    const delta = this.target - this.time;
    // frame-rate independent easing: `ease` is the share of the gap closed per 60fps frame
    const k = 1 - Math.pow(1 - this.opts.ease, dt / (1000 / 60));
    this.time = this.reduced || Math.abs(delta) < 0.002 ? this.target : this.time + delta * k;
    const video = this.video;
    if (!video.seeking && Math.abs(video.currentTime - this.time) > 0.012) {
      video.currentTime = this.time;
    }
    if (this.opts.onTime) this.opts.onTime(this.time, this.duration);
  }

  destroy() {
    cancelAnimationFrame(this._raf);
    this._ro.disconnect();
    this._portrait.removeEventListener('change', this._onOrientation);
    window.removeEventListener('resize', this._onResize);
    clearTimeout(this._resizeTimer);
    this._job = null;
    window.removeEventListener('touchstart', this._unlock);
    Object.values(this.blobs).forEach((u) => URL.revokeObjectURL(u));
  }
}
