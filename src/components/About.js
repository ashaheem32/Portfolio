import React from "react";
import FadeInSection from "./FadeInSection";
import RevealHeading from "./RevealHeading";
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
      <RevealHeading
        id="about-heading"
        className="section-heading about-heading"
      >
        Curiosity meets code.
        <br />
        <span className="muted">Ideas become</span>
        <br />
        real-world intelligence.
      </RevealHeading>
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
            Hi, I’m Mohammed Shaheem.{" "}
            <span>
              An AI engineer turning complex problems into thoughtful, practical
              applications.
            </span>
          </p>
          <p>
            I focus on LLMs, RAG, computer vision, and data science. My
            experience includes a full-time AI Engineer role at Atyuttama
            Enterprises LLP, working with Python, RAG, and natural language
            processing, and 1,000+ freelance LLM evaluation and RLHF tasks at
            Outlier.
          </p>
          <p>
            I work with Python, SQL, FastAPI, and LangChain to build
            citation-grounded AI applications and vector-search pipelines. I’m
            seeking entry-level roles in AI, Machine Learning, or Data Science.
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
            Download my resume <Icon name="download" />
          </a>
        </FadeInSection>
      </div>
    </section>
  );
}
