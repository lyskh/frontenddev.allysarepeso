import { useState } from "react";
import { motion } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "Smart Digital Visitor Logbook",
    description: "QR-based visitor management system with offline fallback and real-time tracking.",
    tech: ["React", "Firebase", "QR Codes"],
    liveUrl: "https://digital-visitor-log-12121.web.app/",
    repoUrl: "#",
    imageUrl: "/3dcards/visitor-logbook.png",
  },
  {
    id: 2,
    title: "The Everything Journal",
    description: "A personal journaling application for capturing thoughts, memories, and daily reflections.",
    tech: ["React", "JavaScript", "CSS"],
    liveUrl: "https://theeverythingjournal.netlify.app/",
    repoUrl: "#",
    imageUrl: "/3dcards/journal.png",
  },
  {
    id: 3,
    title: "ACS Project",
    description: "Advanced system for managing and organizing complex data structures and workflows.",
    tech: ["React", "HTML", "JavaScript"],
    liveUrl: "https://lyskh.github.io/ACS/",
    repoUrl: "#",
    imageUrl: "/3dcards/acs-project.png",
  },
  {
    id: 4,
    title: "Allysa Repeso - Portfolio",
    description: "A modern, responsive portfolio website built with React.js, featuring a clean design and smooth user experience.",
    tech: ["React", "Netlify"],
    liveUrl: "https://allysarepeso.netlify.app/",
    repoUrl: "#",
    imageUrl: "/3dcards/ally-sa-repeso.png",
  },
];

function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="project-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="project-card-image-wrapper">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="project-card-image"
        />
        <motion.div
          className="project-card-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="cta-button primary">
            View Live
          </a>
          {project.repoUrl !== "#" && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="cta-button secondary">
              View Code
            </a>
          )}
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="project-card-content">
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-description">{project.description}</p>

        {/* Tech Badges */}
        <div className="project-card-tech">
          {project.tech.map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section className="section projects">
      <div className="projects-header" style={{ marginBottom: 32 }}>
        <p className="eyebrow">Portfolio</p>
        <h2 className="section-heading">Selected Projects</h2>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
