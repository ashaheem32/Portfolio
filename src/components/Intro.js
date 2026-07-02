import React from "react";

import "../styles/Intro.css";
import Typist from "react-typist";
import "react-typist/dist/Typist.css";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import FadeInSection from "./FadeInSection";
import JumpyTitle from "./JumpyTitle";

class Intro extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true,
      activeKey: "1",
      visible: true,
      typingDone: false,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey,
    });
  }
  render() {
    return (
      <div id="intro">
        <div className="intro-block">
          {!this.state.typingDone ? (
            <Typist
              avgTypingDelay={120}
              onTypingDone={() => this.setState({ typingDone: true })}
            >
              <span className="intro-title">
                {"hi, "}
                <span className="intro-name">{"Mohammed Shaheem"}</span>
                {" here."}
              </span>
            </Typist>
          ) : (
            <JumpyTitle />
          )}
          <FadeInSection>
            <div className="intro-desc">
            I'm a <b>AI & Machine Learning Engineer</b> focused on LLMs, RLHF, computer vision, and data-driven systems, 
            with hands-on experience optimizing and evaluating large-scale language models.
            </div>
            <a href="mailto:ashaheem32@gmail.com" className="intro-contact">
              <EmailRoundedIcon></EmailRoundedIcon>
              {" Say hi!"}
            </a>
          </FadeInSection>
        </div>
      </div>
    );
  }
}

export default Intro;
