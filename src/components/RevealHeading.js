import React, { useLayoutEffect, useRef } from "react";

const headingText = (children) =>
  React.Children.toArray(children)
    .map((child) => {
      if (!React.isValidElement(child)) return child;
      return child.type === "br" ? " " : headingText(child.props.children);
    })
    .join("");

const splitWords = (children) =>
  React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return child.split(/(\s+)/).map((word, index) =>
        word.trim() ? (
          <span className="heading-word" key={index}>
            {word}
          </span>
        ) : (
          word
        )
      );
    }
    if (!React.isValidElement(child) || child.type === "br") return child;
    return React.cloneElement(child, {}, splitWords(child.props.children));
  });

export default function RevealHeading({
  as: Heading = "h2",
  className = "",
  children,
  ...props
}) {
  const headingRef = useRef(null);

  useLayoutEffect(() => {
    const heading = headingRef.current;
    const words = Array.from(heading.querySelectorAll(".heading-word"));
    let frame = 0;
    let active = true;

    const measureLines = () => {
      frame = 0;
      if (!active) return;
      // offsetTop ignores entrance transforms. Words on one rendered line
      // share a delay, including when an authored line wraps on mobile.
      const tops = words.map((word) => word.offsetTop);
      let line = 0;
      const lines = tops.map((top, index) => {
        if (index > 0 && Math.abs(top - tops[index - 1]) > 2) line += 1;
        return line;
      });
      // Keep every line staggered, but finish even a narrow heading promptly.
      const stagger = Math.min(70, 210 / Math.max(1, line));
      words.forEach((word, index) => {
        word.style.setProperty(
          "--heading-delay",
          `${lines[index] * stagger}ms`
        );
      });
    };

    const scheduleMeasure = () => {
      if (active && !frame) frame = window.requestAnimationFrame(measureLines);
    };

    measureLines();
    const observer = window.ResizeObserver
      ? new ResizeObserver(scheduleMeasure)
      : null;
    if (observer) observer.observe(heading);
    window.addEventListener("resize", scheduleMeasure);
    if (document.fonts) {
      document.fonts.ready.then(scheduleMeasure);
      document.fonts.addEventListener("loadingdone", scheduleMeasure);
    }

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      if (document.fonts)
        document.fonts.removeEventListener("loadingdone", scheduleMeasure);
    };
  }, [children]);

  return (
    <Heading
      {...props}
      ref={headingRef}
      className={`heading-reveal ${className}`}
      aria-label={headingText(children).replace(/\s+/g, " ").trim()}
    >
      <span aria-hidden="true">{splitWords(children)}</span>
    </Heading>
  );
}
