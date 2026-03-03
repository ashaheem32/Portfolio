import React, { useEffect, useRef } from "react";
import "../styles/SpaceBackground.css";

const STAR_DENSITY = 0.00012;
const MIN_STARS = 120;
const MAX_STARS = 420;
const INTERACTION_RADIUS = 115;
const INTERACTION_BRIGHTNESS = 1.35;
const DRIFT_LEFT_SPEED = 0.0045;
const SHOOTING_STAR_INTERVAL = 10000;

const randomInRange = (min, max) => min + Math.random() * (max - min);
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function SpaceBackground() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({
    targetX: -9999,
    targetY: -9999,
    currentX: -9999,
    currentY: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!context) {
      return undefined;
    }

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = reduceMotionQuery.matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    let shootingStars = [];
    let frameId = 0;
    let resizeFrame = 0;
    let lastTimestamp = performance.now();
    let lastShootingStarAt = lastTimestamp;

    const createStar = () => {
      const radius = randomInRange(0.45, 1.6);

      return {
        x: randomInRange(0, width),
        y: randomInRange(0, height),
        driftSpeed: randomInRange(DRIFT_LEFT_SPEED * 0.7, DRIFT_LEFT_SPEED * 1.35),
        radius,
        alpha: randomInRange(0.2, 0.8),
        twinklePhase: randomInRange(0, Math.PI * 2),
        twinkleSpeed: randomInRange(0.5, 1.8),
        hoverPhase: randomInRange(0, Math.PI * 2),
      };
    };

    const spawnShootingStar = (timestamp) => {
      shootingStars.push({
        bornAt: timestamp,
        duration: randomInRange(950, 1300),
        startX: randomInRange(width * 0.72, width * 1.06),
        startY: randomInRange(height * 0.08, height * 0.42),
        velocityX: randomInRange(-1.0, -0.72),
        velocityY: randomInRange(0.28, 0.46),
        trailLength: randomInRange(100, 165),
        brightness: randomInRange(0.55, 0.82),
      });
    };

    const rebuildStars = () => {
      const nextCount = clamp(
        Math.floor(width * height * STAR_DENSITY),
        MIN_STARS,
        MAX_STARS
      );
      stars = Array.from({ length: nextCount }, () => createStar());
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      rebuildStars();
    };

    const updatePointer = (clientX, clientY) => {
      pointerRef.current.targetX = clientX;
      pointerRef.current.targetY = clientY;
      pointerRef.current.active = true;
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
      rebuildStars();
      shootingStars = [];
      lastShootingStarAt = performance.now();
    };

    const drawFrame = (timestamp) => {
      const deltaTime = Math.min(40, timestamp - lastTimestamp);
      lastTimestamp = timestamp;

      const pointer = pointerRef.current;
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.12;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.12;

      context.clearRect(0, 0, width, height);

      for (let index = 0; index < stars.length; index += 1) {
        const star = stars[index];
        if (!prefersReducedMotion) {
          star.x -= star.driftSpeed * deltaTime;
          if (star.x < -4) {
            star.x = width + 4;
            star.y = randomInRange(0, height);
          }
        }

        const twinkle =
          0.58 +
          0.42 * Math.sin(timestamp * 0.001 * star.twinkleSpeed + star.twinklePhase);
        let drawAlpha = clamp(star.alpha * twinkle, 0.05, 0.9);
        const x = star.x;
        const y = star.y;

        if (!prefersReducedMotion && pointer.active) {
          const distanceX = x - pointer.currentX;
          const distanceY = y - pointer.currentY;
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          if (distance < INTERACTION_RADIUS) {
            const proximity = 1 - distance / INTERACTION_RADIUS;
            const blink =
              0.45 + 0.55 * Math.sin(timestamp * 0.012 + star.hoverPhase);
            const boost = 1 + INTERACTION_BRIGHTNESS * proximity * blink;
            drawAlpha = clamp(drawAlpha * boost, 0.06, 1);
          }
        }

        context.globalAlpha = drawAlpha;
        context.fillStyle = "#d8e6ff";
        context.beginPath();
        context.arc(x, y, star.radius, 0, Math.PI * 2);
        context.fill();

        if (star.radius > 1.1) {
          context.globalAlpha = drawAlpha * 0.12;
          context.beginPath();
          context.arc(x, y, star.radius * 3.4, 0, Math.PI * 2);
          context.fill();
        }
      }

      if (!prefersReducedMotion && timestamp - lastShootingStarAt >= SHOOTING_STAR_INTERVAL) {
        spawnShootingStar(timestamp);
        lastShootingStarAt = timestamp;
      }

      if (!prefersReducedMotion && shootingStars.length > 0) {
        for (let starIndex = shootingStars.length - 1; starIndex >= 0; starIndex -= 1) {
          const shootingStar = shootingStars[starIndex];
          const elapsed = timestamp - shootingStar.bornAt;
          const lifeProgress = elapsed / shootingStar.duration;

          if (lifeProgress >= 1) {
            shootingStars.splice(starIndex, 1);
            continue;
          }

          const headX = shootingStar.startX + shootingStar.velocityX * elapsed;
          const headY = shootingStar.startY + shootingStar.velocityY * elapsed;
          const speedMagnitude = Math.sqrt(
            shootingStar.velocityX * shootingStar.velocityX +
              shootingStar.velocityY * shootingStar.velocityY
          );
          const tailX =
            headX - (shootingStar.velocityX / speedMagnitude) * shootingStar.trailLength;
          const tailY =
            headY - (shootingStar.velocityY / speedMagnitude) * shootingStar.trailLength;
          const fade = 1 - lifeProgress;

          const gradient = context.createLinearGradient(headX, headY, tailX, tailY);
          gradient.addColorStop(
            0,
            `rgba(225, 238, 255, ${0.78 * fade * shootingStar.brightness})`
          );
          gradient.addColorStop(
            1,
            `rgba(225, 238, 255, ${0.02 * fade * shootingStar.brightness})`
          );

          context.strokeStyle = gradient;
          context.lineWidth = 1.1;
          context.beginPath();
          context.moveTo(headX, headY);
          context.lineTo(tailX, tailY);
          context.stroke();

          context.globalAlpha = 0.65 * fade * shootingStar.brightness;
          context.fillStyle = "#f3f8ff";
          context.beginPath();
          context.arc(headX, headY, 1.3, 0, Math.PI * 2);
          context.fill();
          context.globalAlpha = 1;
        }
      }

      context.globalAlpha = 1;
      frameId = window.requestAnimationFrame(drawFrame);
    };

    resizeCanvas();
    frameId = window.requestAnimationFrame(drawFrame);

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
    <div className="space-background" aria-hidden="true">
      <canvas ref={canvasRef} className="space-background__canvas" />
    </div>
  );
}

export default SpaceBackground;
