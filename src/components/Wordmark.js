import React from "react";
export default function Wordmark({ id, footer = false }) {
  return (
    <svg
      className="wordmark"
      viewBox="0 0 1400 305"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={id}
          x1="0"
          y1="0"
          x2={footer ? "0.1" : "0.3"}
          y2="1"
        >
          <stop offset="0%" stopColor={footer ? "#20100c" : "#a32717"} />
          <stop offset="45%" stopColor="#fa4b2b" />
          <stop offset="100%" stopColor="#ffe7cd" />
        </linearGradient>
      </defs>
      <text
        x="-10"
        y="291"
        textLength="1410"
        lengthAdjust="spacingAndGlyphs"
        fontSize="365"
        letterSpacing="-23"
        fill={`url(#${id})`}
      >
        SHAHEEM
      </text>
    </svg>
  );
}
