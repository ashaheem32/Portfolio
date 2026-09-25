import React from "react";
export default function FadeInSection({
  as: Wrapper = "div",
  className = "",
  children,
}) {
  return (
    <Wrapper className={`fade-in-section ${className}`}>{children}</Wrapper>
  );
}
