import React from "react";
import FadeInSection from "./FadeInSection";
import Icon from "./Icon";
import { profile } from "../data";
import "../styles/About.css";
export default function About() {
  return (
    <section
      id="about"
      className="section about-section"
      aria-labelledby="about-heading"
    >
      <div className="section-topline">
        <p className="section-kicker">A little about me</p>
        <span className="section-index">01 / 05</span>
      </div>
      <FadeInSection>
        <h2 id="about-heading" className="section-heading about-heading">
          Curiosity meets code.
          <br />
          <span className="muted">Ideas become</span>
          <br />
          real-world intelligence.
        </h2>
      </FadeInSection>
      <div className="about-grid">
        <FadeInSection className="portrait-wrap">
          <img
            src={profile.portrait}
            alt={profile.name}
            width="1122"
            height="1402"
            loading="lazy"
          />
          <div className="portrait-caption">
            <span>Mohammed Shaheem</span>
            <Icon name="spark" />
          </div>
        </FadeInSection>
        <FadeInSection className="about-copy">
          <p className="about-lead">
            Hi, I’m Shaheem.{" "}
            <span>
              An aspiring AI/ML engineer turning complex problems into
              thoughtful, practical applications.
            </span>
          </p>
          <p>
            I focus on LLMs, RLHF, computer vision, and data science, with
            hands-on experience optimizing and evaluating large-scale language
            models. As a Freelance Coding Expert at Outlier AI, my work has
            centered on prompt optimization, algorithm design, and model
            behavior analysis.
          </p>
          <p>
            Skilled in Python, SQL, TensorFlow, Scikit-learn, and LLM frameworks
            like the OpenAI API and LangChain, I have a track record of building
            real-world AI applications. I’m seeking internship or entry-level
            roles in AI, Machine Learning, or Data Science.
          </p>
          <div className="about-technologies">
            <span>Recently working with</span>
            <div>
              {["Python", "RAG", "TypeScript", "MySQL"].map((tool) => (
                <span key={tool} className="tech-pill">
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <p className="about-personal">
            Away from the keyboard? Tech gadgets, literary fiction, and probably
            one too many battle royale games.
          </p>
          <a
            className="button button--outline"
            href={profile.resume}
            download="Mohammed_Shaheem_CV.pdf"
          >
            Download my résumé <Icon name="download" />
          </a>
        </FadeInSection>
      </div>
    </section>
  );
}
