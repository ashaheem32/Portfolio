import React, { useEffect, useRef, useState } from "react";
export default function FadeInSection({
  as: Wrapper = "div",
  delay,
  className = "",
  children,
}) {
  const [state, setState] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    if (
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const element = ref.current;
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    setState("is-pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -32px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <Wrapper
      ref={ref}
      className={`fade-in-section ${state} ${className}`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </Wrapper>
  );
}
