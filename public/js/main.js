import { ScrollScrubVideo } from './scroll-scrub.js';

const root = document.documentElement;
const body = document.body;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ---- film ---- */
const SCENES = [[0, 'Wordmark'], [1.6, 'Raw data'], [3.4, 'Neural network'], [5.8, 'Retrieval'], [8.0, 'Products'], [10.2, 'Toolkit'], [12.3, 'Horizon']];
const hudScene = $('#hud-scene'), hudTime = $('#hud-time'), hudBar = $('#hud-bar'), pct = $('#loader-pct');
const fmt = (s) => s.toFixed(2).padStart(5, '0');
let sceneName = '';

const reveal = () => body.classList.replace('is-loading', 'is-ready') || body.classList.add('is-ready');
const film = new ScrollScrubVideo($('.film__video'), {
  sources: {
    landscape: [
      { src: 'assets/film-landscape-720p.mp4', width: 1280, height: 720, preview: true },
      { src: 'assets/film-landscape-1080p.mp4', width: 1920, height: 1080 },
      { src: 'assets/film-landscape-1440p.mp4', width: 2560, height: 1440 },
    ],
    portrait: [
      { src: 'assets/film-portrait-720p.mp4', width: 720, height: 1560, preview: true },
      { src: 'assets/film-portrait-1080p.mp4', width: 1080, height: 2340 },
    ],
  },
  onProgress: (p) => { pct.textContent = Math.round(p * 100); root.style.setProperty('--load', p); },
  onReady: reveal,
  onTime: (t, d) => {
    hudTime.textContent = `${fmt(t)} / ${fmt(d)}`;
    hudBar.style.setProperty('--p', d ? t / d : 0);
    let name = SCENES[0][1];
    for (const [at, n] of SCENES) if (t >= at) name = n;
    if (name !== sceneName) hudScene.textContent = sceneName = name;
  },
});
setTimeout(reveal, 15000); // never trap the visitor behind the loader
window.film = film;

/* ---- pinned chapters: local progress drives the headline in/out ---- */
const pins = $$('[data-pin]');
const header = $('.site-header');
const navLinks = $$('[data-nav]');
let ticking = false;

function update() {
  ticking = false;
  const vh = window.innerHeight;
  const y = window.scrollY;
  header.classList.toggle('is-solid', y > vh * 0.6);
  let current = '';
  pins.forEach((pin) => {
    const r = pin.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, r.height - vh));
    const onScreen = r.top < vh * 0.55 && r.bottom > vh * 0.3;
    const last = pin.classList.contains('contact');
    const hero = pin.classList.contains('hero');
    pin.classList.toggle('is-in', onScreen && (last ? p > 0.45 : p > 0.1 || hero));
    pin.classList.toggle('is-out', !last && p > 0.78);
    pin.style.setProperty('--in', onScreen && (last ? p > 0.45 : p > 0.1 && p < 0.8) ? 1 : 0);
    if (hero) pin.style.setProperty('--copy', clamp(1 - (p - 0.12) / 0.3).toFixed(3));
  });
  $$('[data-chapter]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.5 && r.bottom > vh * 0.5) current = el.dataset.chapter;
  });
  navLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === current));
}
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
update();

/* ---- content reveals ---- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
$$('.reveal').forEach((el) => io.observe(el));

/* ---- mobile nav ---- */
const toggle = $('.nav__toggle'), links = $('#nav-links');
const setNav = (open) => { links.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); };
toggle.addEventListener('click', () => setNav(!links.classList.contains('is-open')));
links.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

/* ---- project archive ---- */
const archive = $('#archive-list'), archiveBtn = $('#archive-toggle');
archiveBtn.addEventListener('click', () => {
  const open = archive.classList.toggle('is-open');
  archiveBtn.setAttribute('aria-expanded', String(open));
  archiveBtn.textContent = open ? 'Show fewer projects' : 'View all 10 projects';
  $$('.is-extra', archive).forEach((el) => el.classList.add('is-visible'));
  film.measure();
});
$$('details.skill').forEach((d) => d.addEventListener('toggle', () => film.measure()));

$('#year').textContent = new Date().getFullYear();
