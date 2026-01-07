import { motion, AnimatePresence } from "framer-motion";

export default function ProjectTechBadges({ project }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="project-tech-badges"
        >
          {/* Tech Stack Column */}
          <div className="tech-stack-column">
            <div className="tech-label">Tech Stack</div>
            <div className="tech-grid">
              {project.tech.map((tech, idx) => (
                <motion.span
                  key={`${project.id}-${tech}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  className="tech-badge"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Description Column */}
          <div className="project-description-column">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <div className="description-label">About</div>
              <p className="description-text">{project.description}</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
