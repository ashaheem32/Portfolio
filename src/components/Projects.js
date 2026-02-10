import React from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@material-ui/icons/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Carousel from "react-bootstrap/Carousel";
import ExternalLinks from "./ExternalLinks";

class Projects extends React.Component {
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
    const spotlightProjects = {
      "No Man's Land": {
        title: "Nearme AI",
        desc:
          "AI-driven local search and recommendation system to help users discover nearby places",
        techStack: "Javascript",
        link: "https://github.com/ashaheem32/Nearme_Ai.git",
        open: "https://nearmeai.vercel.app/",
        image: "/assets/nearmeai.png",
      },
      // Truth: {
      //   title: "truth",
      //   desc:
      //     "A three.js simulation of the planet system revolving around a monolith.",
      //   techStack: "JAVASCRIPT (THREE.JS)",
      //   link: "https://github.com/gazijarin/truth",
      //   open: "https://gazijarin.github.io/Truth/",
      //   image: "/assets/truth.png"
      // },
      "AI-Based Hand Gesture Mouse Control Using Computer Vision": {
        title: "AI-Based Hand Gesture Mouse Control Using Computer Vision",
        desc:
          "Developed a real-time AI system using MediaPipe and OpenCV to control the mouse with hand gestures.",
        techStack: "Python, OpenCV, MediaPipe",
        link: "https://github.com/ashaheem32/AI-Based-Hand-Gesture-Mouse-Control-Using-Computer-Vision.git",
        open: "https://github.com/ashaheem32/AI-Based-Hand-Gesture-Mouse-Control-Using-Computer-Vision.git",
        image: "/assets/handgestures.jpeg",
      },
      Portfolio: {
        title: "portfolio.js",
        desc:
          "A small JS library that helps with clear and succinct data presentation.",
        techStack: "NODE.JS (EXPRESS.JS)",
        link: "https://github.com/ashaheem32/Portfolio.git",
        open: "https://github.com/ashaheem32/Portfolio.git",
        image: "/assets/portfolio.png",
      },
    };
    const projects = {
      "Maternity Weight Prediction": {
        desc:
          "Predicting newborn weight using maternal and pregnancy features through data analysis and machine learning.",
        techStack: "Python, Machine Learning",
        link: "https://github.com/ashaheem32/Maternity-Weight-Prediction.git",
        open: "https://github.com/ashaheem32/Maternity-Weight-Prediction.git",
      },
      "AI-Based Credit Card Application Approval System": {
        desc:
          "To develop a predictive model that automates credit card approval using machine learning techniques.",
        techStack: "Python, Machine Learning",
        link:
          "https://github.com/ashaheem32/AI-Based-Credit-Card-Application-Approval-System.git",
      },
      "Gold Price Prediction Contest Web Application": {
        desc:
          "A robust ASP.NET Core 8 Razor Pages application designed to manage a gold price prediction contest.",
        techStack: "C#, .NET Core, Razor Pages",
        link: "https://github.com/ashaheem32/Gold-Price-Prediction-Contest-Web-Application.git",
        open: "https://github.com/ashaheem32/Gold-Price-Prediction-Contest-Web-Application.git",
      },
      
    };

    return (
      <div id="projects">
        <div className="section-header ">
          <span className="section-title">/ pet projects</span>
        </div>
        <Carousel>
          {Object.keys(spotlightProjects).map((key, i) => (
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={spotlightProjects[key]["image"]}
                alt={key}
              />
              <div className="caption-bg">
                <Carousel.Caption>
                  <h3>{spotlightProjects[key]["title"]}</h3>
                  <p>
                    {spotlightProjects[key]["desc"]}
                    <p className="techStack">
                      {spotlightProjects[key]["techStack"]}
                    </p>
                  </p>
                  <ExternalLinks
                    githubLink={spotlightProjects[key]["link"]}
                    openLink={spotlightProjects[key]["open"]}
                  ></ExternalLinks>
                </Carousel.Caption>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="project-container">
          <ul className="projects-grid">
            {Object.keys(projects).map((key, i) => (
              <FadeInSection delay={`${i + 1}00ms`}>
                <li className="projects-card">
                  <div className="card-header">
                    <div className="folder-icon">
                      <FolderOpenRoundedIcon
                        style={{ fontSize: 35 }}
                      ></FolderOpenRoundedIcon>
                    </div>
                    <ExternalLinks
                      githubLink={projects[key]["link"]}
                      openLink={projects[key]["open"]}
                    ></ExternalLinks>
                  </div>

                  <div className="card-title">{key}</div>
                  <div className="card-desc">{projects[key]["desc"]}</div>
                  <div className="card-tech">{projects[key]["techStack"]}</div>
                </li>
              </FadeInSection>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Projects;
