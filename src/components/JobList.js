import React from "react";
import FadeInSection from "./FadeInSection";
import Icon from "./Icon";
import { experience } from "../data";

export default function JobList() {
  return (
    <div className="experience-list">
      {experience.map((job) => (
        <FadeInSection as="article" className="experience-panel" key={job.id}>
          <div className="experience-role">
            <span className="experience-mark" aria-hidden="true">
              <Icon name={job.icon} />
            </span>
            <h3>{job.company}</h3>
            <p>{job.role}</p>
            <span>{job.employmentType}</span>
            <span>{job.location}</span>
            <div className="experience-dates">
              <time dateTime={job.startDate}>{job.startLabel}</time>
              {" — "}
              <time dateTime={job.endDate}>{job.endLabel}</time>
            </div>
          </div>
          <div className="experience-details">
            <p>{job.headline}</p>
            {job.highlights && (
              <ul>
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}
            {job.skills && (
              <div className="experience-skills">
                <span>Core skills</span>
                <div>
                  {job.skills.map((skill) => (
                    <span className="tech-pill" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {job.stats && (
              <div className="experience-stats">
                {job.stats.map((stat) => (
                  <div key={stat.label}>
                    <strong>
                      {stat.value}
                      <span>{stat.suffix}</span>
                    </strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeInSection>
      ))}
    </div>
  );
}
