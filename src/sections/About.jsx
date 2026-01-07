import { motion } from "framer-motion";
import TechStack from "../components/TechStack";

const paragraphs = [
  "I craft calm, performant interfaces with React, Three.js, and a focus on accessibility.",
  "My work balances minimal aesthetics with purposeful animation and thoughtful interaction.",
  "I value clarity, performance, and systems thinking—building experiences that age well.",
];

export default function About() {
  return (
    <section className="section" id="about" style={{ position: "relative" }}>
      <div className="projects-header" style={{ marginBottom: 24 }}>
        <p className="eyebrow">About</p>
        <h2 className="section-heading">Thoughtful, Calm Interfaces</h2>
        <p className="text-muted" style={{ margin: "6px 0 0", maxWidth: 720 }}>
          Frontend craft, accessible 3D, and calm interactions tuned for performance and clarity.
        </p>
      </div>

      <TechStack />

      <div className="about-content" style={{ minWidth: 0 }}>
        {paragraphs.map((text, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-muted"
            style={{ marginBottom: 16 }}
          >
            {text}
          </motion.p>
        ))}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
          <span className="pill">React</span>
          <span className="pill">Three.js</span>
          <span className="pill">Accessibility</span>
          <span className="pill">Performance</span>
        </div>

        <div className="skills-grid cards-grid">
          {[
            {
              title: "Web Development",
              items: ["HTML, CSS, JavaScript (ES6+), React", "Tailwind CSS"],
            },
            {
              title: "CMS & Deployment",
              items: ["WordPress", "Netlify, Hugo", "GitHub"],
            },
            {
              title: "Design & UI",
              items: ["Canva, Framer", "Layout & Interaction"],
            },
            {
              title: "Analytics & SEO",
              items: ["Google Analytics", "SEO Fundamentals"],
            },
            {
              title: "Technical Skills",
              items: ["Python, APIs", "Troubleshooting", "L1 Support"],
            },
            {
              title: "Productivity & CRM",
              items: ["Notion", "Google Workspace", "HubSpot, Meta Suite"],
            },
          ].map((card, idx) => (
            <motion.div
              key={card.title}
              className="skill-card"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
            >
              <div className="skill-card__header">
                <span className="skill-dot" aria-hidden />
                <h3>{card.title}</h3>
                <span className="skill-count" aria-hidden>{card.items.length} items</span>
              </div>
              <ul>
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
