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
      "Chat Seeker": {
        title: "Chat Seeker",
        desc:
          "AI-powered chat analysis dashboard that turns any chat export into deep insights on emotion, vocabulary, conflicts, love languages, and overall communication health.",
        techStack: "Next.js, FastAPI, Claude AI, pgvector",
        link: "https://github.com/ashaheem32/Chat_seeker.git",
        image: "/assets/chatseeker.png",
      },
      "Lead_Pilot": {
        title: "Lead Pilot",
        desc:
          "LeadPilot AI is an AI-powered platform that automates B2B lead generation, enrichment, and outreach using a multi-agent system.",
        techStack: "React, RAG, Multi-Agent System",
        link: "https://github.com/ashaheem32/lead-pilot-ai-710837.git",
        open: "https://lead-pilot-jet.vercel.app/",
        image: "/assets/leadpilot.jpg",
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
      "Utley Architecture":{
        desc:
        "A boutique architecture firm specializing in residential and commercial design.",
        techStack: "Astro,React,Tailwind CSS",
        link: "https://github.com/ashaheem32/Utley-Architecture.git",
        open: "utley-architecture.vercel.app",
      },
      "AI-Based Hand Gesture Mouse Control Using Computer Vision": {
        desc:
          "Developed a real-time AI system using MediaPipe and OpenCV to control the mouse with hand gestures.",
        techStack: "Python, OpenCV, MediaPipe",
        link: "https://github.com/ashaheem32/AI-Based-Hand-Gesture-Mouse-Control-Using-Computer-Vision.git",
        open: "https://github.com/ashaheem32/AI-Based-Hand-Gesture-Mouse-Control-Using-Computer-Vision.git",
      },
      "Store Intelligence": {
        desc:
          "Real-time retail store intelligence system — an end-to-end pipeline from raw CCTV footage to a live analytics API. Detects visitors, tracks movement, computes conversion rates, and alerts on operational anomalies in real time.",
        techStack: "Python, YOLOv8, ByteTrack, FastAPI",
        link: "https://github.com/ashaheem32/Store_Intelligence.git",
      },
    };

    return (
      <div id="projects">
        <FadeInSection>
          <div className="section-header ">
            <span className="section-title">/ pet projects</span>
          </div>
          <Carousel>
            {Object.keys(spotlightProjects).map((key, i) => (
              <Carousel.Item>
                <a
                  href={spotlightProjects[key]["link"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-block spotlight-image-link"
                >
                  <img
                    className="d-block w-100"
                    src={spotlightProjects[key]["image"]}
                    alt={key}
                  />
                </a>
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
            <Carousel
              className="projects-carousel"
              interval={null}
              indicators={false}
              wrap
            >
              {(() => {
                const keys = Object.keys(projects);
                const groups = [];
                for (let g = 0; g < keys.length; g += 3) {
                  groups.push(keys.slice(g, g + 3));
                }
                return groups.map((group, gi) => (
                  <Carousel.Item key={gi}>
                    <ul className="projects-grid">
                      {group.map((key, i) => (
                        <li className="projects-card" key={i}>
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
                          <div className="card-desc">
                            {projects[key]["desc"]}
                          </div>
                          <div className="card-tech">
                            {projects[key]["techStack"]}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Carousel.Item>
                ));
              })()}
            </Carousel>
          </div>
        </FadeInSection>
      </div>
    );
  }
}

export default Projects;
