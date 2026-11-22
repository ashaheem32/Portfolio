/*
 * Procedural source for the scroll-scrub background film.
 * One particle system morphs through seven shapes that follow the page:
 * wordmark -> raw data -> neural network -> embedding space (RAG retrieval)
 * -> product interfaces -> tool orbit -> horizon.
 *
 * Every frame is a pure function of time, so the film can be re-rendered at
 * any size or aspect ratio: createScene(W, H).draw(ctx, seconds).
 */
(function (global) {
  'use strict';

  const DURATION = 14;
  const N = 16000;
  const CAM_D = 4;
  const BG = '#080808';
  const CREAM = [244, 243, 239];
  const ACCENT = [255, 90, 54];
  const WORD_STRETCH = 1.32;
  const TOOLS = ['Python', 'RAG', 'LangChain', 'FastAPI', 'OpenCV', 'TensorFlow', 'React', 'SQL'];

  // Hold windows (seconds) for each shape; the gaps between them are morphs.
  const HOLDS = [
    [0.0, 1.0],   // word
    [2.3, 2.9],   // cloud
    [4.1, 5.3],   // net
    [6.3, 7.5],   // embed
    [8.5, 9.7],   // cards
    [10.7, 11.7], // orbit
    [12.9, 14.0], // sphere
  ];

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const sstep = (a, b, v) => smooth(clamp((v - a) / (b - a), 0, 1));
  const fract = (v) => v - Math.floor(v);

  function makeSprite(rgb) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    const col = (a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
    grad.addColorStop(0, col(1));
    grad.addColorStop(0.18, col(0.85));
    grad.addColorStop(0.38, col(0.22));
    grad.addColorStop(0.7, col(0.05));
    grad.addColorStop(1, col(0));
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return c;
  }

  function sampleWordmark(rand) {
    const c = document.createElement('canvas');
    c.width = 1600; c.height = 400;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#fff';
    g.font = 'bold 300px "Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif';
    if ('letterSpacing' in g) g.letterSpacing = '-14px';
    g.textBaseline = 'alphabetic';
    const text = 'SHAHEEM';
    const m = g.measureText(text);
    const x0 = (c.width - m.width) / 2;
    g.fillText(text, x0, 310);
    const data = g.getImageData(0, 0, c.width, c.height).data;
    let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
    const px = [];
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        if (data[(y * c.width + x) * 4 + 3] > 128) {
          px.push(x, y);
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    const w = maxX - minX, h = maxY - minY, n = px.length / 2;
    const pts = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const k = Math.floor(rand() * n) * 2;
      const x = px[k] + rand() - 0.5, y = px[k + 1] + rand() - 0.5;
      pts[i * 3] = (x - minX) / w - 0.5;
      pts[i * 3 + 1] = ((y - minY - h / 2) / w) * WORD_STRETCH;
      pts[i * 3 + 2] = (y - minY) / h; // 0 top .. 1 bottom
    }
    return { pts, aspect: (h / w) * WORD_STRETCH };
  }

  function createScene(W, H) {
    const portrait = H > W;
    const rand = mulberry32(20261122);
    const R = [];
    for (let k = 0; k < 9; k++) {
      const a = new Float32Array(N);
      for (let i = 0; i < N; i++) a[i] = rand();
      R.push(a);
    }
    const word = sampleWordmark(rand);
    const sprCream = makeSprite(CREAM);
    const sprAccent = makeSprite(ACCENT);

    const S = portrait ? W * 0.43 : H * 0.5;          // px per world unit at focus
    const UNIT = portrait ? (W / 1080) * 3.1 : (W / 1920) * 2.5; // base particle radius
    const LABEL = portrait ? Math.round(W * 0.031) : Math.round(W * 0.0132);
    const WM_W = (portrait ? 0.9 * W : 0.88 * W) / S; // wordmark width in world units

    // Per-shape camera: yaw at mid-hold, yaw rate, pitch, zoom, screen offset.
    const CAM = portrait ? [
      { yaw: 0.0, rate: 0.03, pitch: 0.0, zoom: 1, ox: 0, oy: 0.17 },
      { yaw: 0.2, rate: 0.22, pitch: 0.05, zoom: 1.0, ox: 0, oy: 0 },
      { yaw: -0.32, rate: 0.16, pitch: 0.1, zoom: 0.74, ox: 0, oy: -0.1 },
      { yaw: 0.3, rate: 0.26, pitch: 0.1, zoom: 0.86, ox: 0, oy: -0.1 },
      { yaw: -0.42, rate: 0.14, pitch: 0.1, zoom: 0.98, ox: 0, oy: -0.1 },
      { yaw: 0.2, rate: 0.2, pitch: 0.5, zoom: 0.74, ox: 0, oy: -0.1 },
      { yaw: 0.0, rate: 0.12, pitch: 0.1, zoom: 1.7, ox: 0, oy: 0.74 },
    ] : [
      { yaw: 0.0, rate: 0.03, pitch: 0.0, zoom: 1, ox: 0, oy: 0.22 },
      { yaw: 0.2, rate: 0.22, pitch: 0.05, zoom: 1.05, ox: 0, oy: 0 },
      { yaw: -0.32, rate: 0.16, pitch: 0.1, zoom: 0.9, ox: 0.13, oy: -0.03 },
      { yaw: 0.3, rate: 0.26, pitch: 0.1, zoom: 1.0, ox: 0.15, oy: -0.02 },
      { yaw: -0.42, rate: 0.14, pitch: 0.1, zoom: 1.12, ox: 0.15, oy: -0.02 },
      { yaw: 0.2, rate: 0.2, pitch: 0.5, zoom: 0.84, ox: 0.15, oy: -0.02 },
      { yaw: 0.0, rate: 0.12, pitch: 0.1, zoom: 2.0, ox: 0, oy: 1.06 },
    ];

    // ---------- neural network ----------
    const LAYERS = [5, 8, 10, 8, 4];
    const NET_DX = 0.6, NET_DY = 0.165;
    const nodes = [], edges = [];
    const layerStart = [];
    LAYERS.forEach((n, l) => {
      layerStart.push(nodes.length);
      for (let k = 0; k < n; k++) {
        nodes.push({ x: (l - 2) * NET_DX, y: (k - (n - 1) / 2) * NET_DY, z: Math.sin(k * 1.9 + l * 1.3) * 0.16, l, k });
      }
    });
    for (let l = 0; l < LAYERS.length - 1; l++) {
      for (let a = 0; a < LAYERS[l]; a++) for (let b = 0; b < LAYERS[l + 1]; b++) {
        edges.push([layerStart[l] + a, layerStart[l + 1] + b]);
      }
    }
    const nodeAct = (idx, t) => 0.5 + 0.5 * Math.sin(t * 2.4 - nodes[idx].l * 1.1 + nodes[idx].k * 1.9);

    // ---------- embedding space ----------
    const K = 8;
    const clusters = [];
    const cr = mulberry32(77);
    for (let k = 0; k < K; k++) {
      const th = (k / K) * Math.PI * 2 + cr() * 0.5;
      const rad = 0.5 + cr() * 0.5;
      clusters.push({ x: Math.cos(th) * rad * 1.1, y: (cr() - 0.5) * 1.1, z: Math.sin(th) * rad, r: 0.15 + cr() * 0.1 });
    }
    const HIT = 2; // cluster the query retrieves from
    const query = { x: clusters[HIT].x * 0.35, y: clusters[HIT].y * 0.3 - 0.15, z: clusters[HIT].z * 0.35 };
    const docs = [];
    for (let k = 0; k < 5; k++) {
      const c = clusters[HIT];
      docs.push({ x: c.x + (cr() - 0.5) * 0.34, y: c.y + (cr() - 0.5) * 0.34, z: c.z + (cr() - 0.5) * 0.34 });
    }

    // ---------- interface cards ----------
    const CW = 1.0, CH = 0.64;
    const cards = [
      { x: -0.3, y: 0.2, z: -0.5, ry: 0 },
      { x: 0, y: 0, z: 0, ry: 0 },
      { x: 0.3, y: -0.2, z: 0.5, ry: 0 },
    ];
    // Elements in card-local units: x in [-.5,.5], y in [-.32,.32]
    const cardEls = [
      [ // analytics dashboard
        { k: 'box', w: 3, r: [-0.5, -0.32, 0.5, 0.32] },
        { k: 'line', w: 1, r: [-0.5, -0.24, 0.5, -0.24] },
        { k: 'fill', w: 1.2, r: [-0.46, -0.2, -0.3, 0.28] },
        { k: 'bars', w: 4, r: [-0.24, -0.16, 0.14, 0.26], n: 6 },
        { k: 'ring', w: 2, c: [0.32, 0.0], rad: 0.11 },
        { k: 'line', w: 0.5, r: [0.2, 0.18, 0.44, 0.18] },
        { k: 'line', w: 0.5, r: [0.2, 0.23, 0.38, 0.23] },
      ],
      [ // chat / assistant
        { k: 'box', w: 3, r: [-0.5, -0.32, 0.5, 0.32] },
        { k: 'line', w: 1, r: [-0.5, -0.24, 0.5, -0.24] },
        { k: 'box', w: 1.6, r: [-0.44, -0.18, 0.1, -0.07] },
        { k: 'box', w: 1.6, r: [-0.12, -0.03, 0.44, 0.08] },
        { k: 'box', w: 1.6, r: [-0.44, 0.12, 0.22, 0.2] },
        { k: 'fill', w: 1.3, r: [-0.44, 0.245, 0.34, 0.285] },
        { k: 'ring', w: 0.7, c: [0.41, 0.265], rad: 0.028 },
      ],
      [ // map / search
        { k: 'box', w: 3, r: [-0.5, -0.32, 0.5, 0.32] },
        { k: 'line', w: 1, r: [-0.5, -0.24, 0.5, -0.24] },
        { k: 'box', w: 1.2, r: [-0.44, -0.19, 0.44, -0.11] },
        { k: 'wave', w: 3, r: [-0.44, -0.04, 0.44, 0.26] },
        { k: 'ring', w: 1, c: [0.12, 0.06], rad: 0.045 },
        { k: 'ring', w: 0.8, c: [-0.22, 0.14], rad: 0.03 },
      ],
    ];
    cardEls.forEach((els) => {
      let tot = 0; els.forEach((e) => { tot += e.w; });
      let acc = 0; els.forEach((e) => { acc += e.w / tot; e.cum = acc; });
    });

    // ---------- orbit ----------
    const rings = [
      { r: 0.62, tx: 0.35, tz: 0.1, sp: 0.5 },
      { r: 0.94, tx: -0.25, tz: 0.4, sp: -0.34 },
      { r: 1.26, tx: 0.12, tz: -0.3, sp: 0.24 },
    ];
    const sats = TOOLS.map((name, k) => {
      const ring = k % 3, per = Math.ceil((TOOLS.length - ring) / 3);
      return { name, ring, ph: (Math.floor(k / 3) / per) * Math.PI * 2 + ring * 1.1 + 0.4 };
    });
    function ringPoint(ring, ang, o) {
      const rg = rings[ring];
      let x = Math.cos(ang) * rg.r, y = 0, z = Math.sin(ang) * rg.r;
      let c = Math.cos(rg.tx), s = Math.sin(rg.tx);
      let y2 = y * c - z * s, z2 = y * s + z * c; y = y2; z = z2;
      c = Math.cos(rg.tz); s = Math.sin(rg.tz);
      const x2 = x * c - y * s; y2 = x * s + y * c;
      o.x = x2; o.y = y2; o.z = z;
    }
    const satPos = (k, t, o) => ringPoint(sats[k].ring, sats[k].ph + t * rings[sats[k].ring].sp, o);

    // ---------- shapes: (i, t, o) -> position, size, alpha, warmth ----------
    function dust(i, t, o) {
      o.x = (R[0][i] - 0.5) * 5.2 + Math.sin(t * 0.5 + R[3][i] * 30) * 0.12;
      o.y = (R[1][i] - 0.5) * 3.0 + Math.cos(t * 0.4 + R[4][i] * 30) * 0.1;
      o.z = (R[2][i] - 0.5) * 4.4;
      o.s = 0.45 + R[3][i] * 1.1;
      o.a = 0.16 + R[4][i] * 0.3;
      o.w = R[5][i] < 0.14 ? 1 : 0;
    }
    function sWord(i, t, o) {
      o.x = word.pts[i * 3] * WM_W;
      o.y = word.pts[i * 3 + 1] * WM_W + Math.sin(t * 2.6 + R[0][i] * 6.283) * 0.006;
      o.z = (R[1][i] - 0.5) * 0.06;
      const v = word.pts[i * 3 + 2];
      o.s = 0.6 + R[2][i] * 0.6;
      o.a = 0.62 + R[3][i] * 0.38;
      o.w = clamp(1.08 - Math.pow(v, 1.5) * 1.15 + (R[5][i] - 0.5) * 0.25, 0, 1);
    }
    function sCloud(i, t, o) {
      o.x = (R[0][i] - 0.5) * 4.6 + Math.sin(t * 0.9 + R[3][i] * 40) * 0.16;
      o.y = (R[1][i] - 0.5) * 2.7 + Math.cos(t * 0.8 + R[4][i] * 40) * 0.14;
      o.z = (R[2][i] - 0.5) * 4.0 + Math.sin(t * 0.7 + R[5][i] * 40) * 0.2;
      o.s = 0.5 + R[3][i] * 1.3;
      o.a = 0.25 + R[4][i] * 0.5;
      o.w = R[5][i] < 0.16 ? 1 : 0;
    }
    function sNet(i, t, o) {
      if (R[6][i] < 0.36) {
        const idx = Math.floor(R[0][i] * nodes.length), nd = nodes[idx];
        const rr = 0.055 * Math.cbrt(R[1][i]);
        const th = R[2][i] * 6.283, ph = Math.acos(2 * R[3][i] - 1);
        o.x = nd.x + rr * Math.sin(ph) * Math.cos(th);
        o.y = nd.y + rr * Math.sin(ph) * Math.sin(th);
        o.z = nd.z + rr * Math.cos(ph);
        const act = nodeAct(idx, t);
        o.s = 0.55 + act * 0.5; o.a = 0.4 + act * 0.5; o.w = sstep(0.55, 0.9, act);
      } else {
        const e = edges[Math.floor(R[0][i] * edges.length)], a = nodes[e[0]], b = nodes[e[1]];
        const pulse = R[3][i] < 0.07;
        const u = fract(R[1][i] + t * (pulse ? 0.55 : 0.1) * (0.6 + R[2][i]));
        o.x = lerp(a.x, b.x, u); o.y = lerp(a.y, b.y, u); o.z = lerp(a.z, b.z, u);
        if (pulse) { o.s = 1.0; o.a = 0.95; o.w = 1; } else { o.s = 0.34; o.a = 0.3; o.w = 0; }
      }
    }
    function sEmbed(i, t, o) {
      const k = Math.floor(R[0][i] * K), c = clusters[k];
      const g = (R[1][i] + R[2][i] + R[3][i] + R[4][i] - 2) * 0.9; // ~gaussian radius
      const rr = c.r * (0.25 + Math.abs(g) * 1.6);
      const th = R[5][i] * 6.283 + t * 0.15, ph = Math.acos(2 * R[6][i] - 1);
      o.x = c.x + rr * Math.sin(ph) * Math.cos(th);
      o.y = c.y + rr * Math.sin(ph) * Math.sin(th);
      o.z = c.z + rr * Math.cos(ph);
      const q = sstep(HOLDS[3][0] + 0.25, HOLDS[3][1] - 0.1, t);
      const hit = k === HIT ? q : 0;
      o.s = 0.5 + R[3][i] * 0.6 + hit * 0.25;
      o.a = 0.34 + R[4][i] * 0.36 + hit * 0.25;
      o.w = hit * (0.55 + R[2][i] * 0.45);
    }
    const tmp = { x: 0, y: 0 };
    function cardLocal(ci, i, t, out) {
      const els = cardEls[ci];
      const u = R[1][i];
      let e = els[0];
      for (let k = 0; k < els.length; k++) { if (u <= els[k].cum) { e = els[k]; break; } }
      const a = R[2][i], b = R[3][i];
      let x = 0, y = 0, bright = 0;
      if (e.k === 'box') {
        const w = e.r[2] - e.r[0], h = e.r[3] - e.r[1], p = a * 2 * (w + h);
        if (p < w) { x = e.r[0] + p; y = e.r[1]; }
        else if (p < w + h) { x = e.r[2]; y = e.r[1] + (p - w); }
        else if (p < 2 * w + h) { x = e.r[2] - (p - w - h); y = e.r[3]; }
        else { x = e.r[0]; y = e.r[3] - (p - 2 * w - h); }
      } else if (e.k === 'line') {
        x = lerp(e.r[0], e.r[2], a); y = lerp(e.r[1], e.r[3], a);
      } else if (e.k === 'fill') {
        x = lerp(e.r[0], e.r[2], a); y = lerp(e.r[1], e.r[3], b);
      } else if (e.k === 'bars') {
        const n = e.n, bi = Math.floor(a * n), bw = (e.r[2] - e.r[0]) / n;
        const hgt = (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(bi * 1.7 + ci * 2 + t * 1.6))) * (e.r[3] - e.r[1]);
        x = e.r[0] + bw * (bi + 0.12 + fract(a * n) * 0.6);
        y = e.r[3] - b * hgt;
        bright = bi === ((Math.floor(t * 1.2) + ci) % n + n) % n ? 1 : 0;
      } else if (e.k === 'ring') {
        const ang = a * 6.283;
        x = e.c[0] + Math.cos(ang) * e.rad; y = e.c[1] + Math.sin(ang) * e.rad;
        bright = fract(a + t * 0.25) < 0.62 ? 1 : 0;
      } else if (e.k === 'wave') {
        x = lerp(e.r[0], e.r[2], a);
        const mid = (e.r[1] + e.r[3]) / 2, amp = (e.r[3] - e.r[1]) / 2;
        const row = Math.floor(b * 3);
        y = mid + amp * (0.55 * Math.sin(a * 7 + row * 2.1 + t * 1.1) * (0.5 + row * 0.2) + (row - 1) * 0.3);
        bright = row === 1 ? 1 : 0;
      }
      out.x = x * CW / 1.0; out.y = y; out.b = bright;
    }
    const cl = { x: 0, y: 0, b: 0 };
    function sCards(i, t, o) {
      const ci = Math.floor(R[0][i] * 3), c = cards[ci];
      cardLocal(ci, i, t, cl);
      const lx = cl.x * 1.18, ly = cl.y * 1.18;
      const cs = Math.cos(c.ry), sn = Math.sin(c.ry);
      const bob = Math.sin(t * 0.9 + ci * 2.1) * 0.03;
      o.x = c.x + lx * cs; o.y = c.y + ly + bob; o.z = c.z + lx * sn + (R[4][i] - 0.5) * 0.012;
      o.s = 0.42 + R[5][i] * 0.3 + cl.b * 0.2;
      o.a = 0.42 + R[4][i] * 0.3 + cl.b * 0.2;
      o.w = cl.b;
    }
    function sOrbit(i, t, o) {
      const u = R[0][i];
      if (u < 0.26) { // core
        const th = R[1][i] * 6.283 + t * 0.6, ph = Math.acos(2 * R[2][i] - 1);
        const rr = 0.25 * (0.94 + 0.06 * Math.sin(ph * 6 + th * 3 + t * 2.2)) * Math.cbrt(0.55 + R[3][i] * 0.45);
        o.x = rr * Math.sin(ph) * Math.cos(th); o.y = rr * Math.cos(ph); o.z = rr * Math.sin(ph) * Math.sin(th);
        o.s = 0.55 + R[3][i] * 0.5; o.a = 0.55 + R[4][i] * 0.35; o.w = 0.75 + R[5][i] * 0.25;
      } else if (u < 0.34) { // satellites
        const k = Math.floor(R[1][i] * sats.length);
        satPos(k, t, o);
        const rr = 0.045 * Math.cbrt(R[2][i]), th = R[3][i] * 6.283, ph = Math.acos(2 * R[4][i] - 1);
        o.x += rr * Math.sin(ph) * Math.cos(th); o.y += rr * Math.sin(ph) * Math.sin(th); o.z += rr * Math.cos(ph);
        o.s = 0.7; o.a = 0.8; o.w = k % 2 ? 0.1 : 1;
      } else {
        const ring = Math.floor(R[1][i] * 3);
        ringPoint(ring, R[2][i] * 6.283 + t * rings[ring].sp * 0.6, o);
        const j = (R[3][i] + R[4][i] - 1) * 0.035;
        o.x += j; o.y += (R[5][i] - 0.5) * 0.02; o.z += j * 0.6;
        o.s = 0.36 + R[3][i] * 0.3; o.a = 0.3 + R[4][i] * 0.3; o.w = 0;
      }
    }
    const GOLD = Math.PI * (3 - Math.sqrt(5));
    function sSphere(i, t, o) {
      const yy = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - yy * yy), th = i * GOLD + t * 0.1;
      const ripple = 1 + 0.018 * Math.sin(yy * 14 + t * 2.4) + 0.012 * Math.sin(th * 6 + t * 1.7);
      const rr = (R[6][i] < 0.1 ? 1.02 + R[3][i] * 0.16 : 1) * ripple;
      o.x = Math.cos(th) * rad * rr; o.y = yy * rr; o.z = Math.sin(th) * rad * rr;
      o.s = 0.5 + R[3][i] * 0.5; o.a = 0.5 + R[4][i] * 0.4;
      o.w = clamp(0.35 + R[5][i] * 0.75 - (yy + 1) * 0.12, 0, 1);
    }
    const SHAPES = [sWord, sCloud, sNet, sEmbed, sCards, sOrbit, sSphere];

    function segment(t) {
      for (let k = 0; k < HOLDS.length; k++) {
        if (t <= HOLDS[k][1]) {
          if (t >= HOLDS[k][0] || k === 0) return { a: k, b: k, m: 0 };
          const e = HOLDS[k - 1][1];
          return { a: k - 1, b: k, m: (t - e) / (HOLDS[k][0] - e) };
        }
      }
      return { a: HOLDS.length - 1, b: HOLDS.length - 1, m: 0 };
    }
    const camYaw = (k, t) => CAM[k].yaw + CAM[k].rate * (t - (HOLDS[k][0] + HOLDS[k][1]) / 2);

    const oa = { x: 0, y: 0, z: 0, s: 0, a: 0, w: 0 };
    const ob = { x: 0, y: 0, z: 0, s: 0, a: 0, w: 0 };
    const pp = { x: 0, y: 0, z: 0 };
    const sp = { x: 0, y: 0, p: 0, zc: 0 };

    function draw(ctx, time) {
      const t = clamp(time, 0, DURATION);
      const seg = segment(t);
      const me = smooth(seg.m);
      const cA = CAM[seg.a], cB = CAM[seg.b];
      const yaw = lerp(camYaw(seg.a, t), camYaw(seg.b, t), me);
      const pitch = lerp(cA.pitch, cB.pitch, me);
      const zoom = lerp(cA.zoom, cB.zoom, me);
      const cx = W / 2 + lerp(cA.ox, cB.ox, me) * W;
      const rise = sstep(12.4, 14, t) * 0.07 * H; // slow sunrise over the last second
      const cy = H / 2 + lerp(cA.oy, cB.oy, me) * H - rise;
      const cyw = Math.cos(yaw), syw = Math.sin(yaw), cpt = Math.cos(pitch), spt = Math.sin(pitch);
      const wgt = (k) => (seg.a === k ? 1 - seg.m : 0) + (seg.b === k && seg.a !== k ? seg.m : 0);
      const present = (k) => { const w = wgt(k); return w * w * w; };

      function project(x, y, z, out) {
        const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw;
        const y2 = y * cpt - z1 * spt, z2 = y * spt + z1 * cpt;
        const zc = z2 + CAM_D;
        const p = CAM_D / Math.max(zc, 0.05);
        out.x = cx + S * zoom * x1 * p; out.y = cy + S * zoom * y2 * p; out.p = p; out.zc = zc;
        return zc > 0.25;
      }

      // ---- background ----
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      const glow = (gx, gy, rx, ry, rgb, alpha) => {
        if (alpha <= 0.003) return;
        ctx.save();
        ctx.translate(gx, gy); ctx.scale(rx, ry);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        g.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`);
        g.addColorStop(0.45, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha * 0.32})`);
        g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0, 0, 1, 0, 6.2832); ctx.fill();
        ctx.restore();
      };
      ctx.globalCompositeOperation = 'lighter';
      const wWord = wgt(0), wSphere = wgt(6);
      // ember haze under the wordmark, like the live site's hero
      glow(cx, cy + S * WM_W * word.aspect * 0.42, W * 0.66, H * 0.34, [255, 70, 30], 0.42 * wWord * wWord);
      // soft halo behind mid-film subjects
      const mid = 1 - Math.max(wWord, wSphere, wgt(1) * 0.6);
      glow(cx, cy, S * 1.7, S * 1.25, [255, 90, 54], 0.05 * clamp(mid, 0, 1));
      if (wSphere > 0) {
        const sr = S * zoom;
        // atmosphere: a thin bright limb on the sphere's silhouette, fading outwards
        const k = wSphere * wSphere * wSphere * (0.55 + 0.45 * sstep(12.6, 14, t));
        const limb = sr * CAM_D / Math.sqrt(CAM_D * CAM_D - 1);
        const r0 = limb * 0.6, r1 = limb * 1.45, at = (r) => (r * limb - r0) / (r1 - r0);
        const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1);
        g.addColorStop(0, 'rgba(255,70,30,0)');
        g.addColorStop(at(0.9), `rgba(255,70,30,${0.07 * k})`);
        g.addColorStop(at(0.985), `rgba(255,96,54,${0.34 * k})`);
        g.addColorStop(at(1.0), `rgba(255,196,160,${0.72 * k})`);
        g.addColorStop(at(1.012), `rgba(255,96,54,${0.36 * k})`);
        g.addColorStop(at(1.07), `rgba(255,70,30,${0.2 * k})`);
        g.addColorStop(at(1.2), `rgba(255,70,30,${0.07 * k})`);
        g.addColorStop(1, 'rgba(255,70,30,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }

      // ---- lines under particles ----
      ctx.lineCap = 'round';
      const a2 = { x: 0, y: 0, p: 0, zc: 0 }, b2 = { x: 0, y: 0, p: 0, zc: 0 };
      const pNet = present(2);
      if (pNet > 0.01) {
        ctx.lineWidth = Math.max(1, UNIT * 0.4);
        ctx.strokeStyle = `rgba(244,243,239,${0.05 * pNet})`;
        ctx.beginPath();
        for (const e of edges) {
          const a = nodes[e[0]], b = nodes[e[1]];
          project(a.x, a.y, a.z, a2); project(b.x, b.y, b.z, b2);
          ctx.moveTo(a2.x, a2.y); ctx.lineTo(b2.x, b2.y);
        }
        ctx.stroke();
      }
      const pCards = present(4);
      if (pCards > 0.01) {
        ctx.lineWidth = Math.max(1, UNIT * 0.5);
        cards.forEach((c, ci) => {
          const cs = Math.cos(c.ry), sn = Math.sin(c.ry), bob = Math.sin(t * 0.9 + ci * 2.1) * 0.03;
          const hw = 0.5 * 1.18, hh = 0.32 * 1.18;
          const corner = (sx, sy, out) => project(c.x + sx * hw * cs, c.y + sy * hh + bob, c.z + sx * hw * sn, out);
          const q = [{}, {}, {}, {}];
          corner(-1, -1, q[0]); corner(1, -1, q[1]); corner(1, 1, q[2]); corner(-1, 1, q[3]);
          ctx.beginPath();
          ctx.moveTo(q[0].x, q[0].y); for (let k = 1; k < 4; k++) ctx.lineTo(q[k].x, q[k].y); ctx.closePath();
          ctx.fillStyle = `rgba(244,243,239,${0.022 * pCards})`; ctx.fill();
          ctx.strokeStyle = `rgba(244,243,239,${0.2 * pCards})`; ctx.stroke();
        });
      }
      const pOrbit = present(5);
      if (pOrbit > 0.01) {
        ctx.lineWidth = Math.max(1, UNIT * 0.35);
        ctx.strokeStyle = `rgba(244,243,239,${0.1 * pOrbit})`;
        for (let r = 0; r < 3; r++) {
          ctx.beginPath();
          for (let k = 0; k <= 96; k++) {
            ringPoint(r, (k / 96) * 6.2832, pp); project(pp.x, pp.y, pp.z, a2);
            if (k === 0) ctx.moveTo(a2.x, a2.y); else ctx.lineTo(a2.x, a2.y);
          }
          ctx.stroke();
        }
      }

      // ---- particles ----
      for (let i = 0; i < N; i++) {
        let x, y, z, s, a, w;
        if (R[7][i] < 0.11) {
          dust(i, t, oa);
          x = oa.x; y = oa.y; z = oa.z; s = oa.s; a = oa.a * (1 - wSphere * 0.6); w = oa.w;
        } else {
          SHAPES[seg.a](i, t, oa);
          if (seg.m > 0) {
            const mi = smooth(clamp(seg.m * 1.6 - R[8][i] * 0.6, 0, 1));
            SHAPES[seg.b](i, t, ob);
            x = lerp(oa.x, ob.x, mi); y = lerp(oa.y, ob.y, mi); z = lerp(oa.z, ob.z, mi);
            s = lerp(oa.s, ob.s, mi); a = lerp(oa.a, ob.a, mi); w = lerp(oa.w, ob.w, mi);
            const bump = Math.sin(Math.PI * mi);
            x += bump * 0.42 * Math.sin(t * 1.3 + R[5][i] * 20 + oa.y * 3);
            y += bump * 0.3 * Math.cos(t * 1.1 + R[6][i] * 20 + oa.x * 3);
            z += bump * 0.5 * Math.sin(t * 0.9 + R[2][i] * 20);
            const ang = bump * 0.8 * (R[3][i] - 0.3), ca = Math.cos(ang), sa = Math.sin(ang);
            const xr = x * ca - z * sa; z = x * sa + z * ca; x = xr;
          } else { x = oa.x; y = oa.y; z = oa.z; s = oa.s; a = oa.a; w = oa.w; }
        }
        if (!project(x, y, z, sp)) continue;
        const coc = Math.abs(sp.zc - CAM_D) * 0.3;
        const r = s * UNIT * sp.p * Math.sqrt(zoom) * (1 + coc);
        const d = r * 5;
        if (sp.x < -d || sp.x > W + d || sp.y < -d || sp.y > H + d) continue;
        const al = a / Math.pow(1 + coc * 1.4, 1.5);
        if (w < 0.98) { ctx.globalAlpha = Math.min(1, al * (1 - w)); ctx.drawImage(sprCream, sp.x - d / 2, sp.y - d / 2, d, d); }
        if (w > 0.02) { ctx.globalAlpha = Math.min(1, al * w * 1.15); ctx.drawImage(sprAccent, sp.x - d / 2, sp.y - d / 2, d, d); }
      }
      ctx.globalAlpha = 1;

      // ---- overlays: retrieval, labels ----
      const label = (txt, x, y, alpha, align) => {
        if (alpha <= 0.01) return;
        ctx.globalCompositeOperation = 'source-over';
        ctx.font = `500 ${LABEL}px "JetBrains Mono", ui-monospace, Menlo, monospace`;
        ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(244,243,239,${alpha})`;
        ctx.fillText(txt, x, y);
        ctx.globalCompositeOperation = 'lighter';
      };
      const dot = (x, y, rad, spr, alpha) => { ctx.globalAlpha = alpha; ctx.drawImage(spr, x - rad, y - rad, rad * 2, rad * 2); ctx.globalAlpha = 1; };

      if (pNet > 0.01) {
        const names = ['input', 'hidden', 'hidden', 'hidden', 'output'];
        const xs = []; let ly = 0;
        LAYERS.forEach((n, l) => {
          project((l - 2) * NET_DX, 4.5 * NET_DY + 0.17, 0, a2);
          xs.push(a2.x); ly = Math.max(ly, a2.y);
        });
        xs.forEach((x, l) => label(names[l], x, ly, 0.55 * pNet, 'center'));
      }
      const pEmb = present(3);
      if (pEmb > 0.01) {
        const q = sstep(HOLDS[3][0] - 0.1, HOLDS[3][1] - 0.15, t);
        project(query.x, query.y, query.z, a2);
        ctx.lineWidth = Math.max(1, UNIT * 0.5);
        for (let k = 0; k < 3; k++) {
          const ph = fract(t * 0.9 + k / 3);
          ctx.strokeStyle = `rgba(255,90,54,${0.5 * (1 - ph) * pEmb})`;
          ctx.beginPath(); ctx.arc(a2.x, a2.y, UNIT * (4 + ph * 26), 0, 6.2832); ctx.stroke();
        }
        docs.forEach((dc, k) => {
          const g = sstep(k * 0.13, k * 0.13 + 0.4, q);
          if (g <= 0) return;
          project(dc.x, dc.y, dc.z, b2);
          const ex = lerp(a2.x, b2.x, g), ey = lerp(a2.y, b2.y, g);
          ctx.strokeStyle = `rgba(255,90,54,${0.75 * pEmb})`;
          ctx.beginPath(); ctx.moveTo(a2.x, a2.y); ctx.lineTo(ex, ey); ctx.stroke();
          if (g > 0.98) dot(b2.x, b2.y, UNIT * 9, sprAccent, pEmb);
        });
        dot(a2.x, a2.y, UNIT * 13, sprCream, pEmb);
        label('query', a2.x - LABEL * 0.9, a2.y - LABEL * 1.2, 0.8 * pEmb, 'right');
        project(clusters[HIT].x, clusters[HIT].y, clusters[HIT].z, b2);
        label('top-k = 5  ·  cos 0.93', b2.x, b2.y + S * zoom * 0.34, 0.8 * pEmb * sstep(0.7, 1, q), 'center');
      }
      if (pOrbit > 0.01) {
        sats.forEach((st, k) => {
          satPos(k, t, pp);
          if (!project(pp.x, pp.y, pp.z, a2)) return;
          dot(a2.x, a2.y, UNIT * 10 * a2.p, k % 2 ? sprCream : sprAccent, 0.9 * pOrbit);
          label(st.name, a2.x + LABEL * 0.9, a2.y - LABEL * 0.9, clamp(0.35 + (a2.p - 0.8) * 1.6, 0.25, 0.85) * pOrbit);
        });
      }

      // ---- vignette keeps the frame edges on the page background ----
      ctx.globalCompositeOperation = 'source-over';
      const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.45, W / 2, H / 2, Math.hypot(W, H) * 0.56);
      v.addColorStop(0, 'rgba(8,8,8,0)');
      v.addColorStop(1, `rgba(8,8,8,${0.75 * (1 - wSphere * 0.5)})`);
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    }

    return { draw, duration: DURATION, width: W, height: H };
  }

  global.ScrubFilm = { createScene, DURATION, HOLDS };
})(typeof window !== 'undefined' ? window : globalThis);
