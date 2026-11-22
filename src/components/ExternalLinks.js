import React from "react";
import Icon from "./Icon";
export default function ExternalLinks({ githubLink, openLink, title }) {
  return (
    <div className="project-links">
      <a
        href={githubLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${title} source on GitHub`}
      >
        GitHub <Icon name="code" />
      </a>
      {openLink && (
        <a
          href={openLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${title} website`}
        >
          Visit website <Icon />
        </a>
      )}
    </div>
  );
}
