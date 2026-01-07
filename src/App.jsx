import { useState } from "react";
import { motion } from "framer-motion";
import CinematicLoader from "./components/Loader";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import About from "./sections/About";
import Contact from "./sections/Contact";

export default function App() {
  const [showContent, setShowContent] = useState(false);

  return (
    <>
      {!showContent && <CinematicLoader onLoadComplete={() => setShowContent(true)} />}
      {showContent && (
        <motion.main
          className="page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            custom={0}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Hero />
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: (custom) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: custom * 0.15 } }),
            }}
          >
            <About />
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: (custom) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: custom * 0.15 } }),
            }}
          >
            <Projects />
          </motion.div>

          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: (custom) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: custom * 0.15 } }),
            }}
          >
            <Contact />
          </motion.div>
        </motion.main>
      )}
    </>
  );
}
