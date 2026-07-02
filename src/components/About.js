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
        Aspiring AI/ML Engineer experienced in LLM evaluation, RLHF, 
        computer vision, and data science. Currently a Freelance Coding Expert at Outlier AI, 
        focused on prompt optimization, algorithm design, and model behavior analysis. 
        Skilled in Python, SQL, TensorFlow, Scikit-learn, and LLM frameworks like the OpenAI API and LangChain, 
        with a track record of building real-world AI applications. Seeking internship or entry-level roles in AI, 
        Machine Learning, or Data Science.
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
      "RAG",
      "Typescript",
      "MySQL",

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
