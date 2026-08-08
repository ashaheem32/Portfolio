import React from "react";

// `as` lets callers pick the wrapper element — a plain <div> is invalid inside
// a <ul>, so list items pass as="li".
export default function FadeInSection({ as: Wrapper = "div", delay, children }) {
  const [isVisible, setVisible] = React.useState(false);
  const domRef = React.useRef();

  React.useEffect(() => {
    const currentRef = domRef.current;
    if (!currentRef) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Wrapper
      className={`fade-in-section ${isVisible ? "is-visible" : ""}`}
      style={{ transitionDelay: delay || undefined }}
      ref={domRef}
    >
      {children}
    </Wrapper>
  );
}
