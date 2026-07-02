import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";

class About extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true,
      activeKey: "1",
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey,
    });
  }
  render() {
    const one = (
      <p>
        Aspiring <b>AI and Machine Learning Engineer</b> with practical experience in LLM evaluation, 
        reinforcement learning with human feedback (RLHF), computer vision, and data science. 
        Currently a Freelance Coding Expert at <b>Outlier AI</b> , where I work on prompt optimization, 
        algorithm design, and model behavior analysis to enhance the quality, alignment, and performance of large language models.
      </p>
    );
    const two = (
      <p>
        Outside of work, I’m nerdy about tech gadgets, love literary fiction,
        and play way too many battle royale games.
      </p>
    );

    const tech_stack = [
      "Python",
      "Typescript",
      "React.js",
      "SQL",

    ];

    return (
      <div id="about">
        <FadeInSection>
          <div className="section-header ">
            <span className="section-title">/ about me</span>
          </div>
          <div className="about-content">
            <div className="about-description">
              {[one]}
              {"Here are some technologies I have been working with:"}
              <ul className="tech-stack">
                {tech_stack.map(function (tech_item, i) {
                  return (
                    <FadeInSection delay={`${i + 1}00ms`}>
                      <li>{tech_item}</li>
                    </FadeInSection>
                  );
                })}
              </ul>
              {[two]}
            </div>
            <div className="about-image">
              <img alt="Mohammed Shaheem" src={"/assets/shaheem.png"} />
            </div>
          </div>
        </FadeInSection>
      </div>
    );
  }
}

export default About;
