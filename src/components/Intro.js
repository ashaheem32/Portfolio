import React from "react";
import Icon from "./Icon";
import Wordmark from "./Wordmark";
import { profile } from "../data";
import "../styles/Intro.css";
export default function Intro() {
  return (
    <section id="intro" className="hero" aria-labelledby="hero-heading">
      <div className="hero-top">
        <div className="hero-identity">
          <span className="status-dot" />
          Available for my next chapter
        </div>
        <div className="hero-introduction">
          <p className="hero-name">{profile.name}</p>
          <h1 id="hero-heading">
            Building intelligent systems for a more human world.
          </h1>
          <a className="text-link" href="#projects">
            Explore my work <Icon />
          </a>
        </div>
      </div>
      <div className="hero-bottom">
        <div className="hero-meta">
          <p>{profile.role}</p>
          <p className="hero-specialties">
            LLMs <span>·</span> Computer vision <span>·</span> Data science
          </p>
          <a href="#about">
            Scroll to explore <Icon name="down" />
          </a>
        </div>
        <div className="hero-art">
          <div className="hero-glow" />
          <Wordmark id="hero-wordmark-gradient" />
          <div className="hero-grain" />
        </div>
      </div>
    </section>
  );
}
