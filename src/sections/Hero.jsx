import { useState, useEffect } from "react";
import CanvasContainer from "../components/CanvasContainer";
import HeroScene from "../components/HeroScene";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="hero" style={{ display: isMobile ? "flex" : "grid" }}>
      <div className="hero-canvas">
        <CanvasContainer className="hero-canvas-element" enableOrbit={false}>
          <HeroScene />
        </CanvasContainer>
      </div>

      <div className="hero-overlay">
        <p className="eyebrow">Frontend · Creative Tech</p>
        <h1 className="hero-title">Allysa Repeso</h1>
        <p className="hero-subtitle">
          Frontend engineer crafting thoughtful interfaces and calm, performant 3D
          experiences.
        </p>
        <div className="hero-actions">
          <a className="button" href="#projects">View Projects</a>
          <a className="button" href="#contact">Get in Touch</a>
        </div>
      </div>
    </section>
  );
}

