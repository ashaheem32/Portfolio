import React from "react";
import Icon from "./Icon";
import Wordmark from "./Wordmark";
import FadeInSection from "./FadeInSection";
import { profile } from "../data";
import "../styles/Credits.css";
export default function Credits() {
  return (
    <footer
      id="contact"
      className="site-footer"
      aria-labelledby="contact-heading"
    >
      <div className="footer-content">
        <div className="section-topline">
          <p className="section-kicker">What’s next?</p>
          <span className="section-index">05 / 05</span>
        </div>
        <FadeInSection className="contact-main">
          <div>
            <p className="contact-availability">
              <span className="status-dot" />
              Open to internships & entry-level roles
            </p>
            <h2 id="contact-heading">
              Let’s build something
              <br />
              <span>intelligent.</span>
            </h2>
            <a className="button" href={`mailto:${profile.email}`}>
              <Icon name="spark" />
              Get in touch <Icon />
            </a>
          </div>
          <p>
            Have an opportunity in AI, Machine Learning, or Data Science?
            <br />
            <br />
            I’d love to hear from you.
          </p>
        </FadeInSection>
        <div className="footer-links">
          <a className="footer-email" href={`mailto:${profile.email}`}>
            {profile.email}
            <Icon />
          </a>
          <div>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub <Icon />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <Icon />
            </a>
            <a href={profile.resume} download="Mohammed_Shaheem_CV.pdf">
              Résumé <Icon name="download" />
            </a>
          </div>
        </div>
        <div className="footer-meta">
          <p>
            © {new Date().getFullYear()} {profile.name}.<br />
            <span>Built by Mohammed Shaheem. All rights reserved.</span>
          </p>
          <a href="#intro">
            Back to top <Icon />
          </a>
        </div>
      </div>
      <div className="footer-wordmark">
        <Wordmark id="footer-wordmark-gradient" footer />
      </div>
    </footer>
  );
}
