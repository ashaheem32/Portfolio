import React, { useRef } from "react";
import Intro from "./components/Intro";
import About from "./components/About";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Expertise from "./components/Expertise";
import Credits from "./components/Credits";
import NavBar from "./components/NavBar";
import useScrollMotion from "./hooks/useScrollMotion";
import "./App.css";
import "./styles/Global.css";

export default function App() {
  const rootRef = useRef(null);
  useScrollMotion(rootRef);

  return (
    <div className="App" ref={rootRef}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <NavBar />
      <main id="main">
        <Intro />
        <About />
        <Projects />
        <Experience />
        <Expertise />
      </main>
      <Credits />
    </div>
  );
}
