import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { profile } from "../data";
import "../styles/NavBar.css";
const links = [
  ["Home", "intro"],
  ["About", "about"],
  ["Projects", "projects"],
  ["Experience", "experience"],
  ["Expertise", "expertise"],
  ["Contact", "contact"],
];
export default function NavBar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onPointer = (event) => {
      if (!menuRef.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <header className="site-header">
      <a className="brand" href="#intro" aria-label={`${profile.name} — home`}>
        <span className="brand-mark">s.</span>
        <span>shaheem</span>
      </a>
      <div
        className={`navigation ${open ? "is-open" : ""}`}
        data-lenis-prevent
        ref={menuRef}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setOpen(false);
        }}
      >
        <button
          className="menu-toggle"
          ref={toggleRef}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="site-navigation"
        >
          <span className="menu-label">
            <Icon name={open ? "close" : "grid"} />
            {open ? "Close" : "Menu"}
          </span>
          <span className="nav-availability">
            <span className="status-dot" />
            Open to opportunities
          </span>
        </button>
        <nav id="site-navigation" aria-label="Main navigation" hidden={!open}>
          <div className="menu-links">
            {links.map(([label, id], index) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
                <span className="menu-number">0{index + 1}</span>
                {label}
                <Icon />
              </a>
            ))}
          </div>
          <div className="menu-bottom">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub <Icon />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <Icon />
            </a>
            <a href={profile.resume} download>
              Résumé <Icon name="download" />
            </a>
          </div>
        </nav>
      </div>
      <a className="button header-contact" href={`mailto:${profile.email}`}>
        <Icon name="spark" />
        <span>Get in touch</span>
      </a>
    </header>
  );
}
