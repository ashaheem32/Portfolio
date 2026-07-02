import React, { useEffect, useState } from "react";
import Intro from "./components/Intro";
import Experience from "./components/Experience";
import About from "./components/About";
import Projects from "./components/Projects";
import Credits from "./components/Credits";
import NavBar from "./components/NavBar";
import SpaceBackground from "./components/SpaceBackground";
import "./App.css";
import "./styles/Global.css";
import "rsuite/dist/styles/rsuite-default.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setFadeSplash(true);
    }, 1700);

    const hideTimer = window.setTimeout(() => {
      setShowSplash(false);
      setShowMainContent(true);
    }, 2400);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = showSplash ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showSplash]);

  return (
    <div className="App">
      <SpaceBackground />
      {showSplash && (
        <div className={`opening-banner ${fadeSplash ? "is-exiting" : ""}`}>
          <h1 className="opening-banner__name">Mohammed Shaheem</h1>
        </div>
      )}
      <div className={`main-site ${showMainContent ? "is-visible" : ""}`}>
        {showMainContent && (
          <>
            <NavBar></NavBar>
            <div id="content">
              <Intro></Intro>
              <About></About>
              <Experience></Experience>
              <Projects></Projects>
              <Credits></Credits>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
