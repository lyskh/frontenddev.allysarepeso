export default function Contact() {
  return (
    <section className="section" id="contact" style={{ textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <p className="eyebrow">Get in Touch</p>
      <h2 className="section-heading">Let's Work Together</h2>
      <p className="text-muted" style={{ maxWidth: "600px", marginBottom: 32 }}>
        I'm always interested in hearing about new projects and opportunities to collaborate on thoughtful, performant interfaces.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <a className="button button-primary" href="mailto:allysakhaer@gmail.com">Send Email</a>
        <a className="button" href="https://www.linkedin.com/in/allysarepeso" target="_blank" rel="noreferrer">LinkedIn</a>
        <a className="button" href="https://github.com/lyskh" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </section>
  );
}

