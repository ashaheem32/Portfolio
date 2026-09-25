import React, { useState } from "react";
import FadeInSection from "./FadeInSection";
import RevealHeading from "./RevealHeading";
import ExternalLinks from "./ExternalLinks";
import Icon from "./Icon";
import { featuredProjects, otherProjects, profile } from "../data";
import "../styles/Projects.css";
export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  return (
    <section
      id="projects"
      className="section projects-section"
      aria-labelledby="projects-heading"
    >
      <div className="section-topline">
        <p className="section-kicker">Selected work</p>
        <span className="section-index">02 / 05</span>
      </div>
      <div className="section-intro">
        <RevealHeading id="projects-heading" className="section-heading">
          Built with curiosity.
          <br />
          <span className="muted">Made to be useful.</span>
        </RevealHeading>
        <FadeInSection as="p">
          A selection of AI experiments, intelligent tools, and digital
          experiences I’ve brought to life.
        </FadeInSection>
      </div>
      <div className="featured-projects">
        {featuredProjects.map((project, index) => (
          <article
            className={`featured-project project--${project.theme}`}
            key={project.title}
          >
            <a
              className="project-visual fade-in-section"
              href={project.live || project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Explore ${project.title}`}
            >
              <div className="project-visual-top">
                <span>0{index + 1}</span>
                <span>{project.category}</span>
                <span className="project-open">
                  <Icon />
                </span>
              </div>
              <div className="project-image-wrap">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/${project.image}`}
                  alt={project.imageAlt}
                  loading="lazy"
                  width={
                    project.theme === "legal"
                      ? 1200
                      : project.theme === "chat"
                      ? 1344
                      : 1536
                  }
                  height={
                    project.theme === "legal"
                      ? 600
                      : project.theme === "chat"
                      ? 752
                      : 811
                  }
                />
              </div>
              {project.theme === "legal" && (
                <span className="legal-art-title">
                  JurisGPT<span>Intelligence, grounded in law.</span>
                </span>
              )}
              <span className="project-hover-cta">
                Explore project <Icon />
              </span>
            </a>
            <div className="project-info">
              <div>
                <RevealHeading as="h3">{project.title}</RevealHeading>
                <FadeInSection as="p">{project.description}</FadeInSection>
              </div>
              <FadeInSection className="project-details">
                <div className="project-tech">
                  {project.technologies.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
                <ExternalLinks
                  githubLink={project.github}
                  openLink={project.live}
                  title={project.title}
                />
              </FadeInSection>
            </div>
          </article>
        ))}
      </div>
      <div className="archive-heading">
        <div>
          <p className="section-kicker">The project archive</p>
          <RevealHeading as="h3">More things I’ve built.</RevealHeading>
        </div>
        <span className="archive-count">06 projects</span>
      </div>
      <div className="project-archive" id="project-archive">
        {otherProjects.map((project, index) => (
          <article
            className="archive-project"
            key={project.title}
            hidden={index > 2 && !showAll}
          >
            <div className="archive-project-top">
              <span className="archive-number">0{index + 4}</span>
              <span>{project.category}</span>
              <Icon name="code" />
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="archive-project-bottom">
              <div className="project-tech">
                {project.technologies.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
              <ExternalLinks
                githubLink={project.github}
                openLink={project.live}
                title={project.title}
              />
            </div>
          </article>
        ))}
      </div>
      <div className="archive-actions">
        <button
          className="button button--outline"
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
          aria-controls="project-archive"
        >
          {showAll ? "Show fewer projects" : "View all 9 projects"}
          <Icon name={showAll ? "close" : "plus"} />
        </button>
        <a
          className="text-link"
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore GitHub <Icon />
        </a>
      </div>
    </section>
  );
}
