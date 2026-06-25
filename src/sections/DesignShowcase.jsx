import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gvm1 from "../assets/carousel-pictures/gvm-1.jpg";
import gvm2 from "../assets/carousel-pictures/gvm-2.png";
import gvm3 from "../assets/carousel-pictures/gvm-3.png";
import jtm1 from "../assets/carousel-pictures/jtm-1.png";
import jtm2 from "../assets/carousel-pictures/jtm-2.png";
import jtm3 from "../assets/carousel-pictures/jtm-3.jpeg";
import jtm4 from "../assets/carousel-pictures/jtm-4.jpeg";
import jtm5 from "../assets/carousel-pictures/jtm-5.jpeg";
import jtm6 from "../assets/carousel-pictures/jtm-6.jpeg";
import jtm7 from "../assets/carousel-pictures/jtm-7.png";
import loanmarket1 from "../assets/carousel-pictures/loanmarket-1.png";
import loanmarket2 from "../assets/carousel-pictures/loanmarket-2.png";
import loanmarket3 from "../assets/carousel-pictures/loanmarket-3.png";
import loanmarket4 from "../assets/carousel-pictures/loanmarket-4.png";
import loanmarket5 from "../assets/carousel-pictures/loanmarket-5.png";
import loanmarket6 from "../assets/carousel-pictures/loanmarket-6.png";
import loanmarket7 from "../assets/carousel-pictures/loanmarket-7.png";
import tej1 from "../assets/carousel-pictures/tej-1.png";
import tej2 from "../assets/carousel-pictures/tej-2.png";
import tej3 from "../assets/carousel-pictures/tej-3.png";
import tej4 from "../assets/carousel-pictures/tej-4.png";
import tej5 from "../assets/carousel-pictures/tej-5.png";
import yrp1 from "../assets/carousel-pictures/yrp-1.png";
import yrp2 from "../assets/carousel-pictures/yrp-2.png";
import yrp3 from "../assets/carousel-pictures/yrp-3.png";
import yrp4 from "../assets/carousel-pictures/yrp-4.png";
import yrp5 from "../assets/carousel-pictures/yrp-5.png";

const categories = [
  { key: "all", label: "All Samples" },
  { key: "jtm", label: "JTM - Joan Trumpauer Mulholland" },
  { key: "yrp", label: "YRP - Your Restoration Place" },
  { key: "loanmarket", label: "Loan Market" },
  { key: "gvm", label: "GVM - Go Viral Marketing" },
  { key: "tej", label: "TEJ - The Everything Journal" },
];

const designSamples = [
  { id: 1, title: "JTM Campaign Highlights", description: "Social and campaign visuals for Joan Trumpauer Mulholland.", tools: ["Canva", "Branding", "Campaign"], category: "jtm", imageUrl: jtm1 },
  { id: 2, title: "JTM Launch Content", description: "Launch asset set designed for strong visual storytelling.", tools: ["Visual Strategy", "Layout", "Typography"], category: "jtm", imageUrl: jtm2 },
  { id: 3, title: "JTM Press Kit", description: "A media kit concept created for press distribution and event promotion.", tools: ["Presentation", "Collateral", "Brand"], category: "jtm", imageUrl: jtm3 },
  { id: 4, title: "JTM Campaign Signage", description: "Branded signage and communications designed for campaign consistency.", tools: ["Art Direction", "Print", "Visual Design"], category: "jtm", imageUrl: jtm4 },
  { id: 5, title: "JTM Story Graphics", description: "A visual story series created to support campaign messaging online.", tools: ["Content", "Layout", "Brand Identity"], category: "jtm", imageUrl: jtm5 },
  { id: 6, title: "JTM Social Layout", description: "Social post assets with strong hierarchy and polished typography.", tools: ["Social Media", "Composition", "Brand"], category: "jtm", imageUrl: jtm6 },
  { id: 7, title: "JTM Campaign Poster", description: "Poster and print collateral designed for attention and clarity.", tools: ["Print Design", "Grid", "Patterns"], category: "jtm", imageUrl: jtm7 },
  { id: 8, title: "YRP Brand Refresh", description: "A restoration business brand update with clean structure.", tools: ["Branding", "Color", "Layout"], category: "yrp", imageUrl: yrp1 },
  { id: 9, title: "YRP Service Cards", description: "Service cards created for client communications and web promotion.", tools: ["Digital Design", "UI", "Copy"], category: "yrp", imageUrl: yrp2 },
  { id: 10, title: "YRP Campaign Visuals", description: "Campaign assets created for restoration messaging and trust-building.", tools: ["Brand Strategy", "Visual Identity", "Marketing"], category: "yrp", imageUrl: yrp3 },
  { id: 11, title: "YRP Website Elements", description: "Web-ready design components for restoration and repair services.", tools: ["UX", "Design System", "Illustration"], category: "yrp", imageUrl: yrp4 },
  { id: 12, title: "YRP Promotional Graphics", description: "Promotional layouts created for digital and local marketing.", tools: ["Campaign", "Layout", "Photography"], category: "yrp", imageUrl: yrp5 },
  { id: 13, title: "Loan Market Brand System", description: "Visual system for lending and finance marketing materials.", tools: ["Branding", "Typography", "Asset Production"], category: "loanmarket", imageUrl: loanmarket1 },
  { id: 14, title: "Loan Market Campaign Book", description: "A campaign book concept designed for loan service messaging.", tools: ["Infographics", "Publication", "Hierarchy"], category: "loanmarket", imageUrl: loanmarket2 },
  { id: 15, title: "Loan Market Social Set", description: "Social visuals crafted to communicate clear financial benefits.", tools: ["Social Media", "Visual Design", "Copy"], category: "loanmarket", imageUrl: loanmarket3 },
  { id: 16, title: "Loan Market Ad Layout", description: "Paid ad assets created for conversion-focused campaigns.", tools: ["Advertising", "Layout", "Brand"], category: "loanmarket", imageUrl: loanmarket4 },
  { id: 17, title: "Loan Market Product Page", description: "Digital presentation for loan products and customer guidance.", tools: ["UX", "Wireframe", "Design"], category: "loanmarket", imageUrl: loanmarket5 },
  { id: 18, title: "Loan Market Print Collateral", description: "Print collateral adapted for finance audience and credibility.", tools: ["Print", "Brand", "Composition"], category: "loanmarket", imageUrl: loanmarket6 },
  { id: 19, title: "Loan Market Branding Detail", description: "Detail-oriented branding elements for financial messaging.", tools: ["Identity", "Color", "Typography"], category: "loanmarket", imageUrl: loanmarket7 },
  { id: 20, title: "TEJ Editorial Graphics", description: "Visuals created for the personal blog The Everything Journal.", tools: ["Editorial", "Illustration", "Layout"], category: "tej", imageUrl: tej1 },
  { id: 21, title: "TEJ Feature Art", description: "Feature art designed for blog post hero visuals.", tools: ["Illustration", "Typography", "Brand"], category: "tej", imageUrl: tej2 },
  { id: 22, title: "TEJ Social Story", description: "Social content created to promote journal articles and updates.", tools: ["Social Media", "Content", "Design"], category: "tej", imageUrl: tej3 },
  { id: 23, title: "TEJ Poster Concept", description: "Poster concept created for personal journal promotion.", tools: ["Print", "Layout", "Brand Voice"], category: "tej", imageUrl: tej4 },
  { id: 24, title: "TEJ Editorial Layout", description: "Blog layout and editorial styling for long-form content.", tools: ["Editorial", "Typography", "Spacing"], category: "tej", imageUrl: tej5 },
  { id: 25, title: "GVM Campaign Snapshot", description: "Campaign creative for Go Viral Marketing — hero visual.", tools: ["Branding", "Visual Design", "Campaign"], category: "gvm", imageUrl: gvm1 },
  { id: 26, title: "GVM Social Kit", description: "Social-ready creative tiles for engagement and sharing.", tools: ["Social Media", "Layout", "Copy"], category: "gvm", imageUrl: gvm2 },
  { id: 27, title: "GVM Detail Art", description: "Detailed art used across GVM campaign materials.", tools: ["Illustration", "Texture", "Composition"], category: "gvm", imageUrl: gvm3 },
];

function DesignCard({ sample }) {
  return (
    <div className="design-slide">
      <img
        src={sample.imageUrl}
        alt={sample.title}
        className="design-slide-image"
        draggable="false"
        onDragStart={(event) => event.preventDefault()}
      />
      <div className="design-slide-caption">
        <div className="design-slide-title">{sample.title}</div>
      </div>
    </div>
  );
}

export default function DesignShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const pointerStartXRef = useRef(null);

  const filteredSamples =
    selectedCategory === "all"
      ? designSamples
      : designSamples.filter((sample) => sample.category === selectedCategory);

  const hasSamples = filteredSamples.length > 0;

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const sample = hasSamples ? filteredSamples[currentIndex] || filteredSamples[0] : null;

  const goPrevious = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? filteredSamples.length - 1 : prev - 1
    );
  const goNext = () =>
    setCurrentIndex((prev) =>
      prev === filteredSamples.length - 1 ? 0 : prev + 1
    );

  const onPointerDown = (event) => {
    // Ignore pointerdown events that start on interactive children (buttons, dots)
    if (event.target !== event.currentTarget) return;

    pointerStartXRef.current = event.clientX;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch (err) {
      // Some browsers may throw if pointerId is invalid; ignore
    }
  };

  const onPointerUp = (event) => {
    const startX = pointerStartXRef.current;
    if (startX === null) return;
    // If pointerup originated on an interactive child, skip swipe handling
    if (event.target !== event.currentTarget) {
      pointerStartXRef.current = null;
      try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {};
      return;
    }

    const diff = event.clientX - startX;
    const threshold = 40;

    if (diff > threshold) {
      goPrevious();
    } else if (diff < -threshold) {
      goNext();
    }
    pointerStartXRef.current = null;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
  };

  const onPointerCancel = () => {
    pointerStartXRef.current = null;
  };

  return (
    <section className="section design-showcase" id="design">
      <div className="projects-header" style={{ marginBottom: 32 }}>
        <p className="eyebrow">Graphic Design</p>
        <h2 className="section-heading">Creative Design Showcase</h2>
        <p className="text-muted" style={{ maxWidth: 720 }}>
          Visual design samples made for clients, highlighting branding, campaign assets, and polished social content.
        </p>
      </div>

      <div className="design-carousel-filters">
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            className={`filter-button ${selectedCategory === category.key ? "active" : ""}`}
            onClick={() => setSelectedCategory(category.key)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="design-carousel">
        <motion.div
          key={sample ? sample.id : "empty"}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45 }}
          className="design-carousel-panel"
          {...(hasSamples
            ? {
                onPointerDown: onPointerDown,
                onPointerUp: onPointerUp,
                onPointerCancel: onPointerCancel,
                onPointerLeave: onPointerCancel,
              }
            : {})}
        >
          {hasSamples ? (
            <DesignCard sample={sample} />
          ) : (
            <div className="design-empty" role="status">
              <p style={{ margin: 0, padding: 24, textAlign: "center", color: "var(--text-secondary)" }}>
                No samples available for this category.
              </p>
            </div>
          )}

          {hasSamples && (
            <>
              <button
                type="button"
                className="carousel-button carousel-button-prev"
                onClick={goPrevious}
                aria-label="Previous design sample"
              >
                ←
              </button>
              <button
                type="button"
                className="carousel-button carousel-button-next"
                onClick={goNext}
                aria-label="Next design sample"
              >
                →
              </button>

              <div className="design-carousel-dots">
                {filteredSamples.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`View design sample ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
