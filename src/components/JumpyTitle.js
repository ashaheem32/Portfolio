import React, { useEffect, useMemo, useRef } from "react";

const makeLetters = (text, keyPrefix) =>
  Array.from(text).map((char, index) => ({
    char,
    key: `${keyPrefix}-${index}-${char === " " ? "space" : char}`,
    index,
  }));

function JumpyRun({ text, className, indexOffset = 0 }) {
  const letters = useMemo(() => makeLetters(text, className || "run"), [text, className]);

  return (
    <span className={className}>
      {letters.map((letter) => (
        <span
          key={letter.key}
          className="jumpy-letter"
          data-jumpy-letter="1"
          data-jumpy-index={letter.index + indexOffset}
        >
          {letter.char === " " ? "\u00A0" : letter.char}
        </span>
      ))}
    </span>
  );
}

function JumpyTitle() {
  const rootRef = useRef(null);
  const lettersRef = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const centersRef = useRef([]);
  const velocitiesRef = useRef([]);
  const rafRef = useRef(0);

  const rebuildCache = () => {
    if (!rootRef.current) return;
    const nodes = Array.from(rootRef.current.querySelectorAll("[data-jumpy-letter='1']"));
    lettersRef.current = nodes;
    centersRef.current = nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
    velocitiesRef.current = nodes.map(() => ({ x: 0, y: 0 }));
  };

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotionQuery.matches) {
      return undefined;
    }

    rebuildCache();

    const onMove = (event) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      pointerRef.current.active = true;
    };

    const onLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.x = -9999;
      pointerRef.current.y = -9999;
    };

    const onResize = () => {
      rebuildCache();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize, { passive: true });

    const tick = () => {
      const nodes = lettersRef.current;
      const centers = centersRef.current;
      const vels = velocitiesRef.current;
      const pointer = pointerRef.current;
      const now = performance.now();

      const radius = 140;
      const k = 0.12; // spring strength
      const damping = 0.82; // velocity damping
      const maxOffset = 26;

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        const center = centers[i];
        const vel = vels[i];

        const idx = Number(node.dataset.jumpyIndex || i);
        const seedA = Math.sin(idx * 12.9898) * 43758.5453;
        const seedB = Math.sin((idx + 7) * 78.233) * 12345.6789;
        const randX = (seedA - Math.floor(seedA)) * 2 - 1;
        const randY = (seedB - Math.floor(seedB)) * 2 - 1;

        let targetX = 0;
        let targetY = 0;

        // subtle idle float
        targetY += Math.sin(now * 0.002 + idx * 0.35) * 0.6;
        targetX += Math.cos(now * 0.0016 + idx * 0.42) * 0.45;

        if (pointer.active) {
          const dx = center.x - pointer.x;
          const dy = center.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < radius) {
            const proximity = 1 - dist / radius;
            const push = (proximity * proximity) * 34;
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);

            targetX += nx * push + randX * proximity * 8;
            targetY += ny * push + randY * proximity * 8;
          }
        }

        // spring towards target
        const currentX = Number(node.dataset.jumpyX || 0);
        const currentY = Number(node.dataset.jumpyY || 0);

        vel.x = (vel.x + (targetX - currentX) * k) * damping;
        vel.y = (vel.y + (targetY - currentY) * k) * damping;

        const nextX = Math.max(-maxOffset, Math.min(maxOffset, currentX + vel.x));
        const nextY = Math.max(-maxOffset, Math.min(maxOffset, currentY + vel.y));

        node.dataset.jumpyX = String(nextX);
        node.dataset.jumpyY = String(nextY);
        node.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <span className="jumpy-title" ref={rootRef} aria-label="hi, Mohammed Shaheem here.">
      <JumpyRun text={"hi, "} className="intro-title" indexOffset={0} />
      <JumpyRun text={"Mohammed Shaheem"} className="intro-name" indexOffset={100} />
      <JumpyRun text={" here."} className="intro-title" indexOffset={220} />
    </span>
  );
}

export default JumpyTitle;

