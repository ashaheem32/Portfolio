import React from "react";
import FadeInSection from "./FadeInSection";
import Icon from "./Icon";
import { expertise } from "../data";
import "../styles/Expertise.css";
const tools = [
  "Python",
  "TensorFlow",
  "LangChain",
  "OpenAI API",
  "React",
  "FastAPI",
  "OpenCV",
  "TypeScript",
  "MySQL",
];
export default function Expertise() {
  return (
    <section
      id="expertise"
      className="section expertise-section"
      aria-labelledby="expertise-heading"
    >
      <div className="section-topline">
        <p className="section-kicker">My toolkit</p>
        <span className="section-index">04 / 05</span>
      </div>
      <div className="expertise-layout">
        <FadeInSection className="expertise-intro">
          <h2 className="section-heading" id="expertise-heading">
            The right tools.
            <br />
            <span className="muted">A curious mind.</span>
          </h2>
          <p>
            From evaluating language models to building the applications around
            them. Always learning, always making.
          </p>
          <a href="#projects" className="text-link">
            See them in action <Icon />
          </a>
        </FadeInSection>
        <div className="expertise-list">
          {expertise.map((item, index) => (
            <details
              key={item.title}
              className="expertise-item"
              open={index === 0}
            >
              <summary>
                <span className="expertise-number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <Icon name="plus" />
              </summary>
              <div className="expertise-body">
                <p>{item.description}</p>
                <div>
                  {item.tools.map((tool) => (
                    <span className="tech-pill" key={tool}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
      <div className="tool-ribbon" aria-label="Technologies I work with">
        {tools.map((tool, index) => (
          <span key={tool}>
            <span className="tool-symbol" aria-hidden="true">
              {["Py", "tf", "⌘", "✳", "⚛", "ƒ", "◎", "TS", "SQL"][index]}
            </span>
            {tool}
          </span>
        ))}
      </div>
    </section>
  );
}
