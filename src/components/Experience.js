import React from "react";
import FadeInSection from "./FadeInSection";
import RevealHeading from "./RevealHeading";
import JobList from "./JobList";
import "../styles/Experience.css";
export default function Experience() {
  return (
    <section
      id="experience"
      className="section experience-section"
      aria-labelledby="experience-heading"
    >
      <div className="section-topline">
        <p className="section-kicker">Experience</p>
        <span className="section-index">03 / 05</span>
      </div>
      <div className="section-intro">
        <RevealHeading className="section-heading" id="experience-heading">
          Human feedback.
          <br />
          <span className="muted">Better intelligence.</span>
        </RevealHeading>
        <FadeInSection as="p">
          Hands-on experience evaluating and improving the large language models
          shaping how we work.
        </FadeInSection>
      </div>
      <JobList />
    </section>
  );
}
