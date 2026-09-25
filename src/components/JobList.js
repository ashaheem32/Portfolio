import React from "react";
import FadeInSection from "./FadeInSection";
import Icon from "./Icon";
export default function JobList() {
  return (
    <FadeInSection className="experience-panel">
      <div className="experience-role">
        <span className="outlier-mark" aria-hidden="true">
          <Icon name="spark" />
        </span>
        <h3>Outlier AI</h3>
        <p>AI Trainer</p>
        <span>Freelance Coding Expert</span>
        <time>Oct 2024 — Dec 2025</time>
      </div>
      <div className="experience-details">
        <p>
          Turning human insight into
          <br />
          stronger model performance.
        </p>
        <ul>
          <li>
            Delivered high-quality outputs for LLM evaluation, prompt
            optimization, and AI model fine-tuning using Reinforcement Learning
            with Human Feedback (RLHF).
          </li>
          <li>
            Completed 1000+ AI focused tasks, including algorithm design and
            model behavior debugging, earning over $3,000 in performance-based
            payouts.
          </li>
        </ul>
        <div className="experience-stats">
          <div>
            <strong>
              1,000<span>+</span>
            </strong>
            <span>AI tasks completed</span>
          </div>
          <div>
            <strong>
              $3,000<span>+</span>
            </strong>
            <span>Performance-based earnings</span>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
