import { motion, AnimatePresence } from "framer-motion";

export default function ProjectDetailsOverlay({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0, x: 30, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 30, y: 10, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="project-overlay"
        >
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <small>{project.tech.join(" · ")}</small>

          <div className="links" style={{ marginTop: "1rem" }}>
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="button button-primary">Live</a>
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="button">Code</a>
            <button onClick={onClose} className="button" style={{ marginLeft: "auto" }}>
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
