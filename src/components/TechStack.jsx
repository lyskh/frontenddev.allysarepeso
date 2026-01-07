import { motion } from "framer-motion";

export default function TechStack() {
  const techs = [
    { name: "React", icon: "⚛️" },
    { name: "Three.js", icon: "🎨" },
    { name: "Tailwind CSS", icon: "🎯" },
    { name: "JavaScript", icon: "✨" },
    { name: "HTML & CSS", icon: "🏗️" },
    { name: "WordPress", icon: "📱" },
    { name: "Netlify", icon: "🚀" },
    { name: "Git", icon: "🔧" },
    { name: "Python", icon: "🐍" },
    { name: "Accessibility", icon: "♿" },
  ];

  // Duplicate the array for seamless looping
  const repeatedTechs = [...techs, ...techs];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        marginBottom: 32,
        overflow: "hidden",
        background: "linear-gradient(90deg, rgba(6,9,16,0.8) 0%, transparent 10%, transparent 90%, rgba(6,9,16,0.8) 100%)",
        padding: "12px 0",
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          display: "flex",
          gap: "12px",
          width: "max-content",
        }}
      >
        {repeatedTechs.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "999px",
              background: "rgba(93, 216, 255, 0.08)",
              border: "1px solid rgba(128, 255, 234, 0.2)",
              fontSize: "13px",
              color: "var(--text-secondary)",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(93, 216, 255, 0.15)";
              e.currentTarget.style.borderColor = "rgba(128, 255, 234, 0.4)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(93, 216, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(128, 255, 234, 0.2)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <span style={{ fontSize: "16px" }}>{tech.icon}</span>
            <span>{tech.name}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
