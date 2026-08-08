import React, { useEffect, useRef } from "react";
import "../styles/LegoBackground.css";

const STUD_PITCH = 46;
const STUD_PITCH_COMPACT = 32;
const COMPACT_WIDTH = 700;
const PLATE_COLOR = "#0a1526";
const GLOW_RADIUS = 190;
const MIN_GADGETS = 5;
const MAX_GADGETS = 12;

const LEGO = {
  red: "#c4281c",
  blue: "#1257b4",
  azure: "#3fb1e6",
  yellow: "#f2cd37",
  orange: "#fe8a18",
  green: "#2c8a4d",
  lime: "#a6e22e",
  white: "#dfe6ef",
  gray: "#8b939f",
  darkGray: "#4a525e",
  slate: "#2f3742",
};

const randomInRange = (min, max) => min + Math.random() * (max - min);
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// amount > 0 lightens toward white, amount < 0 darkens toward black.
const shade = (hex, amount) => {
  const num = parseInt(hex.slice(1), 16);
  const target = amount < 0 ? 0 : 255;
  const weight = Math.abs(amount);
  const r = Math.round((target - ((num >> 16) & 255)) * weight + ((num >> 16) & 255));
  const g = Math.round((target - ((num >> 8) & 255)) * weight + ((num >> 8) & 255));
  const b = Math.round((target - (num & 255)) * weight + (num & 255));
  return `rgb(${r}, ${g}, ${b})`;
};

const roundRect = (ctx, x, y, w, h, r) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

// Everything below draws in "stud units": 1 unit = the width of one LEGO stud.
const drawStud = (ctx, cx, topY, color) => {
  const rx = 0.22;
  const studHeight = 0.17;

  ctx.fillStyle = shade(color, -0.1);
  ctx.fillRect(cx - rx, topY - studHeight, rx * 2, studHeight);

  ctx.fillStyle = shade(color, 0.2);
  ctx.beginPath();
  ctx.ellipse(cx, topY - studHeight, rx, rx * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
  ctx.lineWidth = 0.025;
  ctx.stroke();
};

const drawBrick = (ctx, x, y, w, h, color, options = {}) => {
  const studCount = options.studs === undefined ? Math.max(1, Math.round(w)) : options.studs;
  const radius = options.radius === undefined ? 0.08 : options.radius;

  for (let index = 0; index < studCount; index += 1) {
    drawStud(ctx, x + ((index + 0.5) * w) / studCount, y, color);
  }

  const gradient = ctx.createLinearGradient(x, y, x, y + h);
  gradient.addColorStop(0, shade(color, 0.24));
  gradient.addColorStop(0.4, color);
  gradient.addColorStop(1, shade(color, -0.3));
  ctx.fillStyle = gradient;
  roundRect(ctx, x, y, w, h, radius);
  ctx.fill();

  ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
  ctx.lineWidth = 0.03;
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 0.04;
  ctx.beginPath();
  ctx.moveTo(x + radius, y + 0.03);
  ctx.lineTo(x + w - radius, y + 0.03);
  ctx.stroke();
};

const drawPanel = (ctx, x, y, w, h, color, radius = 0.06) => {
  ctx.fillStyle = color;
  roundRect(ctx, x, y, w, h, radius);
  ctx.fill();
};

const drawDot = (ctx, cx, cy, r, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
};

const drawTriangle = (ctx, points, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  ctx.lineTo(points[2], points[3]);
  ctx.lineTo(points[4], points[5]);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
  ctx.lineWidth = 0.03;
  ctx.stroke();
};

const MODELS = [
  {
    key: "laptop",
    w: 4.6,
    h: 3.3,
    draw: (ctx) => {
      drawBrick(ctx, 0.45, 0.2, 3.7, 2.3, LEGO.gray, { studs: 3, radius: 0.12 });
      drawPanel(ctx, 0.72, 0.45, 3.16, 1.8, "#08192c", 0.08);
      ctx.fillStyle = "rgba(96, 199, 235, 0.85)";
      ctx.fillRect(0.95, 0.72, 1.45, 0.12);
      ctx.fillStyle = "rgba(242, 205, 55, 0.8)";
      ctx.fillRect(0.95, 1.05, 2.15, 0.12);
      ctx.fillStyle = "rgba(166, 226, 46, 0.75)";
      ctx.fillRect(1.25, 1.38, 1.6, 0.12);
      ctx.fillStyle = "rgba(96, 199, 235, 0.6)";
      ctx.fillRect(0.95, 1.71, 1.0, 0.12);
      drawBrick(ctx, 0, 2.5, 4.6, 0.8, LEGO.darkGray, { studs: 0, radius: 0.14 });
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(0.6, 2.72, 3.4, 0.22);
    },
  },
  {
    key: "robot",
    w: 4.0,
    h: 4.6,
    draw: (ctx) => {
      drawBrick(ctx, 0.05, 1.9, 0.7, 1.5, LEGO.yellow, { studs: 0, radius: 0.14 });
      drawBrick(ctx, 3.25, 1.9, 0.7, 1.5, LEGO.yellow, { studs: 0, radius: 0.14 });
      drawBrick(ctx, 0.75, 1.7, 2.5, 1.8, LEGO.red, { studs: 0, radius: 0.1 });
      drawPanel(ctx, 1.15, 2.1, 1.7, 0.75, "#0d1f33", 0.06);
      drawDot(ctx, 1.5, 2.48, 0.14, LEGO.lime);
      drawDot(ctx, 2.0, 2.48, 0.14, LEGO.yellow);
      drawDot(ctx, 2.5, 2.48, 0.14, LEGO.azure);
      drawBrick(ctx, 1.05, 0.55, 1.9, 1.2, LEGO.azure, { studs: 2, radius: 0.12 });
      drawDot(ctx, 1.55, 1.15, 0.19, "#f7fbff");
      drawDot(ctx, 2.45, 1.15, 0.19, "#f7fbff");
      drawDot(ctx, 1.58, 1.17, 0.1, "#101720");
      drawDot(ctx, 2.48, 1.17, 0.1, "#101720");
      drawBrick(ctx, 0.95, 3.5, 0.8, 1.1, LEGO.blue, { studs: 0, radius: 0.1 });
      drawBrick(ctx, 2.25, 3.5, 0.8, 1.1, LEGO.blue, { studs: 0, radius: 0.1 });
    },
  },
  {
    key: "rocket",
    w: 3.0,
    h: 5.0,
    draw: (ctx) => {
      drawTriangle(ctx, [1.5, 0, 0.5, 1.55, 2.5, 1.55], LEGO.red);
      drawTriangle(ctx, [0.5, 2.6, 0.5, 4.1, 0, 4.2], LEGO.red);
      drawTriangle(ctx, [2.5, 2.6, 2.5, 4.1, 3.0, 4.2], LEGO.red);
      drawBrick(ctx, 0.5, 1.5, 2.0, 1.4, LEGO.white, { studs: 0, radius: 0.1 });
      drawBrick(ctx, 0.5, 2.9, 2.0, 1.25, LEGO.white, { studs: 0, radius: 0.1 });
      ctx.fillStyle = "rgba(196, 40, 28, 0.9)";
      ctx.fillRect(0.5, 3.55, 2.0, 0.28);
      drawDot(ctx, 1.5, 2.2, 0.45, shade(LEGO.gray, 0.1));
      drawDot(ctx, 1.5, 2.2, 0.33, "#0d2b45");
      drawDot(ctx, 1.38, 2.08, 0.11, "rgba(190, 230, 255, 0.75)");
      drawTriangle(ctx, [0.85, 4.15, 2.15, 4.15, 1.5, 5.0], LEGO.orange);
      drawTriangle(ctx, [1.1, 4.15, 1.9, 4.15, 1.5, 4.7], LEGO.yellow);
    },
  },
  {
    key: "server",
    w: 2.9,
    h: 4.2,
    draw: (ctx) => {
      drawBrick(ctx, 0, 0.2, 2.9, 4.0, LEGO.slate, { studs: 2, radius: 0.1 });
      for (let row = 0; row < 4; row += 1) {
        const y = 0.55 + row * 0.88;
        drawPanel(ctx, 0.28, y, 2.34, 0.62, "#0b1727", 0.06);
        drawDot(ctx, 0.55, y + 0.31, 0.11, row % 2 === 0 ? LEGO.lime : LEGO.orange);
        drawDot(ctx, 0.88, y + 0.31, 0.11, "rgba(120, 150, 185, 0.6)");
        ctx.fillStyle = "rgba(140, 170, 205, 0.25)";
        ctx.fillRect(1.2, y + 0.24, 1.2, 0.14);
      }
    },
  },
  {
    key: "gamepad",
    w: 4.3,
    h: 2.4,
    draw: (ctx) => {
      drawBrick(ctx, 0, 0.55, 4.3, 1.5, LEGO.blue, { studs: 4, radius: 0.55 });
      drawPanel(ctx, 0.75, 1.05, 0.65, 0.22, "#141a24", 0.04);
      drawPanel(ctx, 0.96, 0.84, 0.22, 0.65, "#141a24", 0.04);
      drawDot(ctx, 3.18, 1.02, 0.16, LEGO.red);
      drawDot(ctx, 3.62, 1.28, 0.16, LEGO.yellow);
      drawDot(ctx, 3.18, 1.54, 0.16, LEGO.lime);
      drawDot(ctx, 2.74, 1.28, 0.16, LEGO.orange);
      drawPanel(ctx, 1.85, 1.5, 0.6, 0.16, "rgba(200, 225, 255, 0.35)", 0.06);
    },
  },
  {
    key: "chip",
    w: 3.2,
    h: 2.8,
    draw: (ctx) => {
      for (let leg = 0; leg < 4; leg += 1) {
        const y = 0.62 + leg * 0.45;
        drawPanel(ctx, 0, y, 0.55, 0.2, LEGO.gray, 0.04);
        drawPanel(ctx, 2.65, y, 0.55, 0.2, LEGO.gray, 0.04);
      }
      drawBrick(ctx, 0.5, 0.35, 2.2, 2.2, LEGO.green, { studs: 2, radius: 0.1 });
      drawPanel(ctx, 0.82, 0.72, 1.56, 1.5, "#0d2418", 0.06);
      ctx.strokeStyle = "rgba(166, 226, 46, 0.6)";
      ctx.lineWidth = 0.06;
      ctx.beginPath();
      ctx.moveTo(1.05, 1.05);
      ctx.lineTo(1.9, 1.05);
      ctx.lineTo(1.9, 1.55);
      ctx.lineTo(1.3, 1.55);
      ctx.lineTo(1.3, 1.9);
      ctx.lineTo(2.05, 1.9);
      ctx.stroke();
      drawDot(ctx, 1.05, 1.05, 0.1, LEGO.lime);
      drawDot(ctx, 2.05, 1.9, 0.1, LEGO.lime);
    },
  },
  {
    key: "phone",
    w: 2.0,
    h: 3.5,
    draw: (ctx) => {
      drawBrick(ctx, 0, 0.2, 2.0, 3.3, LEGO.slate, { studs: 1, radius: 0.24 });
      drawPanel(ctx, 0.22, 0.5, 1.56, 2.5, "#08192c", 0.1);
      const appColors = [LEGO.azure, LEGO.yellow, LEGO.red, LEGO.lime, LEGO.orange, LEGO.white];
      for (let index = 0; index < 6; index += 1) {
        const column = index % 3;
        const row = Math.floor(index / 3);
        drawPanel(ctx, 0.4 + column * 0.46, 0.72 + row * 0.5, 0.32, 0.32, appColors[index], 0.08);
      }
      ctx.fillStyle = "rgba(200, 225, 255, 0.3)";
      ctx.fillRect(0.55, 2.62, 0.9, 0.14);
      drawDot(ctx, 1.0, 3.22, 0.14, "rgba(200, 225, 255, 0.35)");
    },
  },
  {
    key: "bulb",
    w: 2.6,
    h: 3.6,
    draw: (ctx) => {
      const glow = ctx.createRadialGradient(1.3, 1.35, 0.2, 1.3, 1.35, 1.9);
      glow.addColorStop(0, "rgba(242, 205, 55, 0.35)");
      glow.addColorStop(1, "rgba(242, 205, 55, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(1.3, 1.35, 1.9, 0, Math.PI * 2);
      ctx.fill();

      drawStud(ctx, 1.3, 0.25, LEGO.yellow);
      const bulbGradient = ctx.createLinearGradient(1.3, 0.25, 1.3, 2.4);
      bulbGradient.addColorStop(0, shade(LEGO.yellow, 0.25));
      bulbGradient.addColorStop(1, shade(LEGO.yellow, -0.25));
      ctx.fillStyle = bulbGradient;
      ctx.beginPath();
      ctx.arc(1.3, 1.35, 1.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
      ctx.lineWidth = 0.04;
      ctx.stroke();

      ctx.strokeStyle = "rgba(120, 80, 20, 0.7)";
      ctx.lineWidth = 0.08;
      ctx.beginPath();
      ctx.moveTo(0.95, 1.75);
      ctx.lineTo(1.3, 1.15);
      ctx.lineTo(1.65, 1.75);
      ctx.stroke();

      drawBrick(ctx, 0.7, 2.35, 1.2, 1.05, LEGO.gray, { studs: 0, radius: 0.08 });
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 0.07;
      for (let line = 0; line < 3; line += 1) {
        const y = 2.6 + line * 0.28;
        ctx.beginPath();
        ctx.moveTo(0.72, y);
        ctx.lineTo(1.88, y);
        ctx.stroke();
      }
    },
  },
  {
    key: "drone",
    w: 4.6,
    h: 3.0,
    draw: (ctx) => {
      ctx.strokeStyle = LEGO.darkGray;
      ctx.lineWidth = 0.26;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0.9, 0.85);
      ctx.lineTo(3.7, 2.15);
      ctx.moveTo(3.7, 0.85);
      ctx.lineTo(0.9, 2.15);
      ctx.stroke();

      const rotors = [
        [0.9, 0.85],
        [3.7, 0.85],
        [0.9, 2.15],
        [3.7, 2.15],
      ];
      rotors.forEach(([cx, cy]) => {
        ctx.fillStyle = "rgba(180, 205, 235, 0.22)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, 0.85, 0.24, 0, 0, Math.PI * 2);
        ctx.fill();
        drawDot(ctx, cx, cy, 0.17, LEGO.gray);
      });

      drawBrick(ctx, 1.6, 1.05, 1.4, 1.0, LEGO.orange, { studs: 1, radius: 0.1 });
      drawPanel(ctx, 1.82, 1.9, 0.96, 0.4, "#0d1b2a", 0.08);
      drawDot(ctx, 2.05, 2.1, 0.11, LEGO.red);
      drawDot(ctx, 2.55, 2.1, 0.11, LEGO.lime);
    },
  },
];

function LegoBackground() {
  const canvasRef = useRef(null);
  const plateRef = useRef(null);
  const pointerRef = useRef({
    targetX: -9999,
    targetY: -9999,
    currentX: -9999,
    currentY: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const plate = plateRef.current;
    if (!canvas || !plate) {
      return undefined;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return undefined;
    }

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = reduceMotionQuery.matches;
    // clientWidth excludes a classic scrollbar; innerWidth does not, and using
    // it would push edge models under the scrollbar.
    const viewportWidth = () =>
      document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = () =>
      document.documentElement.clientHeight || window.innerHeight;

    let width = viewportWidth();
    let height = viewportHeight();
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let gadgets = [];
    let frameId = 0;
    let resizeFrame = 0;
    let studPitch = STUD_PITCH;

    // The studded baseplate never changes, so it is baked once into a repeating
    // CSS background instead of being redrawn every frame.
    const paintBaseplate = () => {
      const tile = document.createElement("canvas");
      tile.width = Math.floor(studPitch * dpr);
      tile.height = Math.floor(studPitch * dpr);
      const tileContext = tile.getContext("2d");
      if (!tileContext) {
        return;
      }
      tileContext.setTransform(dpr, 0, 0, dpr, 0, 0);

      tileContext.fillStyle = PLATE_COLOR;
      tileContext.fillRect(0, 0, studPitch, studPitch);

      tileContext.strokeStyle = "rgba(120, 160, 220, 0.025)";
      tileContext.lineWidth = 1;
      tileContext.strokeRect(0.5, 0.5, studPitch - 1, studPitch - 1);

      const center = studPitch / 2;
      const studRadius = studPitch * 0.29;

      tileContext.fillStyle = "rgba(0, 0, 0, 0.4)";
      tileContext.beginPath();
      tileContext.arc(center, center + studPitch * 0.045, studRadius, 0, Math.PI * 2);
      tileContext.fill();

      const studGradient = tileContext.createRadialGradient(
        center - studRadius * 0.35,
        center - studRadius * 0.45,
        studRadius * 0.15,
        center,
        center,
        studRadius
      );
      studGradient.addColorStop(0, "rgba(126, 160, 208, 0.5)");
      studGradient.addColorStop(0.55, "rgba(58, 82, 120, 0.32)");
      studGradient.addColorStop(1, "rgba(24, 40, 66, 0.3)");
      tileContext.fillStyle = studGradient;
      tileContext.beginPath();
      tileContext.arc(center, center, studRadius, 0, Math.PI * 2);
      tileContext.fill();

      tileContext.strokeStyle = "rgba(150, 185, 235, 0.16)";
      tileContext.lineWidth = 1;
      tileContext.beginPath();
      tileContext.arc(center, center, studRadius - 0.5, Math.PI * 1.05, Math.PI * 1.95);
      tileContext.stroke();

      plate.style.backgroundImage = `url(${tile.toDataURL()})`;
      plate.style.backgroundSize = `${studPitch}px ${studPitch}px`;
    };

    const createGadget = (model, x, y, scale) => ({
      model,
      x,
      y,
      scale,
      alpha: randomInRange(0.62, 0.9),
      bobPhase: randomInRange(0, Math.PI * 2),
      bobSpeed: randomInRange(0.00028, 0.00052),
      bobAmount: randomInRange(4, 11),
      tiltPhase: randomInRange(0, Math.PI * 2),
      tiltSpeed: randomInRange(0.00016, 0.00032),
      tiltAmount: randomInRange(0.018, 0.055),
      parallax: randomInRange(0.008, 0.028),
      hover: 0,
    });

    const rebuildGadgets = () => {
      const compact = width < COMPACT_WIDTH;
      const targetCount = compact
        ? 4
        : clamp(Math.round((width * height) / 150000), MIN_GADGETS, MAX_GADGETS);
      // The readable content column is centred and capped at 1200px, so gadgets
      // are parked in the gutters either side of it whenever there is room.
      const gutter = (width - Math.min(width * 0.94, 1240)) / 2;
      const useGutters = gutter >= 88;

      const placed = [];
      let attempts = 0;
      // Draw from a shuffled bag so every model shows up before any repeats.
      let modelBag = [];

      while (placed.length < targetCount && attempts < targetCount * 40) {
        attempts += 1;
        if (modelBag.length === 0) {
          modelBag = MODELS.slice().sort(() => Math.random() - 0.5);
        }
        const model = modelBag[modelBag.length - 1];
        let scale;
        if (compact) {
          scale = randomInRange(9, 13);
        } else if (useGutters) {
          scale = randomInRange(17, 30);
        } else {
          scale = randomInRange(12, 19);
        }
        const halfWidth = (model.w * scale) / 2;
        const halfHeight = (model.h * scale) / 2;

        // Models are kept fully on screen, and clear of the fixed nav bar.
        const edgeInset = halfWidth + (compact ? 4 : 10);
        // Without a gutter the copy spans nearly the full width, so models hug
        // the screen edges instead of landing behind it.
        const band = useGutters
          ? Math.max(gutter, edgeInset)
          : Math.max(edgeInset + 12, width * 0.06);
        const x =
          Math.random() < 0.5
            ? randomInRange(edgeInset, band)
            : randomInRange(width - band, width - edgeInset);

        const topLimit = halfHeight + (compact ? 96 : 78);
        const bottomLimit = height - halfHeight - 12;
        if (topLimit >= bottomLimit) {
          continue;
        }
        const y = randomInRange(topLimit, bottomLimit);

        const overlaps = placed.some((other) => {
          const minGapX = halfWidth + (other.model.w * other.scale) / 2 + 18;
          const minGapY = halfHeight + (other.model.h * other.scale) / 2 + 18;
          return Math.abs(other.x - x) < minGapX && Math.abs(other.y - y) < minGapY;
        });

        if (!overlaps) {
          modelBag.pop();
          const gadget = createGadget(model, x, y, scale);
          if (!useGutters) {
            // Narrow viewports have no clear gutter, so gadgets sit behind the
            // copy and have to stay faint.
            gadget.alpha *= 0.42;
            gadget.parallax *= 0.5;
            gadget.bobAmount *= 0.6;
          }
          placed.push(gadget);
        }
      }

      gadgets = placed;
    };

    const resizeCanvas = () => {
      const previousWidth = width;
      const previousHeight = height;
      const previousPitch = studPitch;
      const previousDpr = dpr;

      width = viewportWidth();
      height = viewportHeight();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      studPitch = width < COMPACT_WIDTH ? STUD_PITCH_COMPACT : STUD_PITCH;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (
        studPitch !== previousPitch ||
        dpr !== previousDpr ||
        !plate.style.backgroundImage
      ) {
        paintBaseplate();
      }

      // Mobile browsers fire resize every time the URL bar hides, so the layout
      // is only reshuffled for changes big enough to actually matter.
      const heightJump = Math.abs(height - previousHeight);
      if (gadgets.length === 0 || width !== previousWidth || heightJump > 140) {
        rebuildGadgets();
      }

      if (prefersReducedMotion) {
        drawScene(performance.now());
      }
    };

    const drawPointerGlow = () => {
      const pointer = pointerRef.current;
      if (!pointer.active) {
        return;
      }

      const glow = context.createRadialGradient(
        pointer.currentX,
        pointer.currentY,
        0,
        pointer.currentX,
        pointer.currentY,
        GLOW_RADIUS
      );
      glow.addColorStop(0, "rgba(120, 170, 240, 0.12)");
      glow.addColorStop(1, "rgba(120, 170, 240, 0)");
      context.fillStyle = glow;
      context.fillRect(
        pointer.currentX - GLOW_RADIUS,
        pointer.currentY - GLOW_RADIUS,
        GLOW_RADIUS * 2,
        GLOW_RADIUS * 2
      );

      // Light up the individual studs the cursor is passing over.
      const firstColumn = Math.floor((pointer.currentX - GLOW_RADIUS) / studPitch);
      const lastColumn = Math.ceil((pointer.currentX + GLOW_RADIUS) / studPitch);
      const firstRow = Math.floor((pointer.currentY - GLOW_RADIUS) / studPitch);
      const lastRow = Math.ceil((pointer.currentY + GLOW_RADIUS) / studPitch);
      const studRadius = studPitch * 0.29;

      for (let column = firstColumn; column <= lastColumn; column += 1) {
        for (let row = firstRow; row <= lastRow; row += 1) {
          const cx = column * studPitch + studPitch / 2;
          const cy = row * studPitch + studPitch / 2;
          const distanceX = cx - pointer.currentX;
          const distanceY = cy - pointer.currentY;
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          if (distance > GLOW_RADIUS) {
            continue;
          }
          const proximity = 1 - distance / GLOW_RADIUS;
          context.globalAlpha = proximity * proximity * 0.5;
          context.fillStyle = "rgba(158, 198, 255, 0.55)";
          context.beginPath();
          context.arc(cx, cy, studRadius * 0.82, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.globalAlpha = 1;
    };

    const drawGadget = (gadget, timestamp) => {
      const pointer = pointerRef.current;
      const bob = prefersReducedMotion
        ? 0
        : Math.sin(timestamp * gadget.bobSpeed + gadget.bobPhase) * gadget.bobAmount;
      const tilt = prefersReducedMotion
        ? 0
        : Math.sin(timestamp * gadget.tiltSpeed + gadget.tiltPhase) * gadget.tiltAmount;

      let offsetX = 0;
      let offsetY = 0;
      if (!prefersReducedMotion && pointer.active) {
        offsetX = (pointer.currentX - width / 2) * gadget.parallax;
        offsetY = (pointer.currentY - height / 2) * gadget.parallax;

        const distanceX = gadget.x - pointer.currentX;
        const distanceY = gadget.y - pointer.currentY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const target = distance < GLOW_RADIUS ? 1 - distance / GLOW_RADIUS : 0;
        gadget.hover += (target - gadget.hover) * 0.08;
      } else {
        gadget.hover += (0 - gadget.hover) * 0.08;
      }

      const centerX = gadget.x + offsetX;
      const centerY = gadget.y + offsetY + bob - gadget.hover * 8;
      const modelWidth = gadget.model.w * gadget.scale;
      const modelHeight = gadget.model.h * gadget.scale;

      context.save();
      context.globalAlpha = clamp(gadget.alpha + gadget.hover * 0.25, 0, 1);

      const shadowRadius = modelWidth * 0.45;
      const shadowGradient = context.createRadialGradient(
        centerX,
        centerY + modelHeight * 0.52,
        0,
        centerX,
        centerY + modelHeight * 0.52,
        shadowRadius
      );
      shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0.45)");
      shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = shadowGradient;
      context.beginPath();
      context.ellipse(
        centerX,
        centerY + modelHeight * 0.52,
        shadowRadius,
        shadowRadius * 0.28,
        0,
        0,
        Math.PI * 2
      );
      context.fill();

      context.translate(centerX, centerY);
      context.rotate(tilt);
      context.scale(gadget.scale, gadget.scale);
      context.translate(-gadget.model.w / 2, -gadget.model.h / 2);
      context.lineJoin = "round";
      gadget.model.draw(context);
      context.restore();
    };

    function drawScene(timestamp) {
      const pointer = pointerRef.current;
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.1;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.1;

      context.clearRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        drawPointerGlow();
      }

      for (let index = 0; index < gadgets.length; index += 1) {
        drawGadget(gadgets[index], timestamp);
      }

      context.globalAlpha = 1;
    }

    const renderLoop = (timestamp) => {
      drawScene(timestamp);
      frameId = window.requestAnimationFrame(renderLoop);
    };

    const startRendering = () => {
      window.cancelAnimationFrame(frameId);
      if (prefersReducedMotion) {
        drawScene(performance.now());
      } else {
        frameId = window.requestAnimationFrame(renderLoop);
      }
    };

    const updatePointer = (clientX, clientY) => {
      const pointer = pointerRef.current;
      if (!pointer.active) {
        pointer.currentX = clientX;
        pointer.currentY = clientY;
      }
      pointer.targetX = clientX;
      pointer.targetY = clientY;
      pointer.active = true;
    };

    const onMouseMove = (event) => {
      updatePointer(event.clientX, event.clientY);
    };

    const onTouchMove = (event) => {
      const touch = event.touches[0];
      if (touch) {
        updatePointer(touch.clientX, touch.clientY);
      }
    };

    const clearPointerFocus = () => {
      pointerRef.current.active = false;
      pointerRef.current.targetX = -9999;
      pointerRef.current.targetY = -9999;
    };

    const onResize = () => {
      if (resizeFrame) {
        return;
      }
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resizeCanvas();
      });
    };

    const onMotionPreferenceChange = (event) => {
      prefersReducedMotion = event.matches;
      startRendering();
    };

    resizeCanvas();
    startRendering();

    // The page starts scrollbar-free behind the splash screen; when the
    // scrollbar later appears the viewport narrows without firing "resize".
    let rootObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      rootObserver = new ResizeObserver(onResize);
      rootObserver.observe(document.documentElement);
    }

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", clearPointerFocus);
    window.addEventListener("touchend", clearPointerFocus, { passive: true });
    window.addEventListener("touchcancel", clearPointerFocus, { passive: true });

    if (reduceMotionQuery.addEventListener) {
      reduceMotionQuery.addEventListener("change", onMotionPreferenceChange);
    } else {
      reduceMotionQuery.addListener(onMotionPreferenceChange);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }
      if (rootObserver) {
        rootObserver.disconnect();
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", clearPointerFocus);
      window.removeEventListener("touchend", clearPointerFocus);
      window.removeEventListener("touchcancel", clearPointerFocus);

      if (reduceMotionQuery.removeEventListener) {
        reduceMotionQuery.removeEventListener("change", onMotionPreferenceChange);
      } else {
        reduceMotionQuery.removeListener(onMotionPreferenceChange);
      }
    };
  }, []);

  return (
    <div className="lego-background" aria-hidden="true">
      <div ref={plateRef} className="lego-background__plate" />
      <canvas ref={canvasRef} className="lego-background__canvas" />
      <div className="lego-background__veil" />
    </div>
  );
}

export default LegoBackground;
