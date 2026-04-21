import "./App.css";

const highlightMetrics = [
  { value: "4+ years", label: "Professional software engineering experience" },
  { value: "~10%", label: "profit uplift from shipped product features" },
  { value: "~25%", label: "repeat purchase improvement through re-order flows" },
];

const selectedWork = [
  {
    title: "Agentic AI Support Triage System",
    summary:
      "Designed and developed an agentic AI-based support triage system to automatically classify, prioritise, and route customer queries in real time using LLMs.",
    impact:
      "Reduced response time and improved issue resolution efficiency through intelligent decision-making agents and dynamic ticket categorisation.",
    stack: "Python, LLM APIs, Node.js, REST APIs",
  },
  {
    title: "Payments and transaction orchestration",
    summary:
      "Designed and implemented a payment microservice for production transaction flows, including webhook handling, status reconciliation, and real-time updates.",
    impact:
      "Strengthened payment reliability for live transactions and gave the product team a cleaner backend boundary for future payment features.",
    stack: "NestJS, FastAPI, Razorpay webhooks, REST APIs",
  },
  {
    title: "E-Commerce platform",
    summary:
      "Designed a modular backend architecture using NestJS, exposing scalable RESTful APIs with services for authentication, payments, and order management.",
    impact:
      "Engineered secure JWT-based authentication and payment workflows with CI/CD via GitHub Actions, hosted on Firebase.",
    stack: "Next.js, NestJS, Firebase Firestore, JWT, Firebase Hosting",
  },
];

const experience = [
  {
    company: "Devaseva",
    role: "Software Developer",
    period: "March 2022 – August 2025",
    location: "Hyderabad, India",
    bullets: [
      "Built and scaled web and mobile applications handling high-volume transactions, improving user experience and increasing repeat purchases by 25%.",
      "Designed and deployed a payment microservice using NestJS, enabling reliable processing and analysis of financial transaction data.",
      "Developed internal APIs and backend systems to expose structured data for reporting, analytics, and operational insights.",
      "Integrated analytics tools (Google Analytics, Firebase Crashlytics), enabling data-driven improvements in performance and user engagement.",
    ],
  },
  {
    company: "Wipro Limited",
    role: "Project Engineer",
    period: "July 2021 – March 2022",
    location: "Chennai, India",
    bullets: [
      "Designed and optimised complex MSSQL queries and data transformation pipelines for SAP Customer Master Data automation, improving data accuracy and system reliability.",
      "Performed SQL validation and reconciliation across integrated systems, ensuring reliable data synchronisation between MSSQL and SAP.",
      "Applied analytical thinking and structured problem-solving to identify edge cases and improve system performance.",
    ],
  },
];

const proofPoints = [
  {
    label: "Campaign discovery",
    href: "https://www.devaseva.com/exploreCampaigns",
  },
  {
    label: "Live campaign page",
    href: "https://www.devaseva.com/campaigns/Raja-Shyamala-Matangi-Jayanti-Sevas-April26",
  },
  {
    label: "Automation workflow",
    href: "https://www.devaseva.com/sadhana/rama-japa-yagna",
  },
];

const aboutPoints = [
  "Full-stack engineer with 4+ years of experience building scalable web, mobile, and data-driven systems. Recently focused on applying AI and LLM-based tools to solve real-world business problems.",
  "Currently pursuing an MSc in Computer Science at UCD, with hands-on experience in data science, cloud computing, and software engineering.",
  "Interested in building AI-powered products that translate complex data into actionable insights in fast-moving environments.",
];

const strengths = [
  "Backend-heavy full-stack development",
  "AI & LLM workflow integration",
  "Production APIs and service design",
  "Payments and webhook integrations",
  "Internal tools and workflow automation",
  "Cross-functional product delivery",
];

const stack = [
  "TypeScript",
  "JavaScript",
  "Python",
  "React",
  "Next.js",
  "Node.js",
  "NestJS",
  "REST APIs",
  "Microservices",
  "Flutter",
  "MySQL",
  "MongoDB",
  "Firebase",
  "AWS",
  "Docker",
  "GitHub Actions",
  "CI/CD",
  "LLM APIs",
  "Prompt Engineering",
  "Pandas",
  "NumPy",
];

const principles = [
  {
    title: "Production over prototypes",
    text: "The strongest story is live software with users, money movement, operations, and measurable business outcomes — not side projects.",
  },
  {
    title: "Systems over screenshots",
    text: "Show architecture, ownership, and tradeoffs. Quickly communicate what was built, why it mattered, and where the engineering depth sits.",
  },
  {
    title: "Depth over breadth",
    text: "Lead with backend execution and product impact, then let full-stack and AI range support that core story.",
  },
];

const narrativePoints = [
  "Backend-first product engineering",
  "AI & LLM workflow integration",
  "Payments, workflows, and internal systems",
  "Professional experience across web and mobile",
];

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <div className="brand-lockup">
            <a className="brand" href="#top">
              Varun Hameer Dutia
            </a>
            <span className="brand-note">Software Engineer</span>
          </div>
          <nav className="site-nav" aria-label="Primary">
            <a href="#work">Work</a>
            <a href="#stack">Skills</a>
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero section">
          <div className="hero-main">
            <div className="hero-intro">
              <p className="eyebrow">Dublin, Ireland</p>
              <span className="availability-pill">Actively seeking software engineering roles</span>
            </div>

            <h1>
              Full-stack engineer building AI-powered systems, payment flows, and scalable products.
            </h1>

            <div className="hero-layout">
              <div className="hero-copy">
                <p className="hero-text">
                  4+ years of professional experience shipping production web and mobile software.
                  Recently focused on applying AI and LLM-based tools to solve real-world business
                  problems — from automation and analytics to decision-support systems.
                </p>
                <p className="hero-role-note">
                  Currently pursuing an MSc in Computer Science at UCD. Looking for backend,
                  full-stack, or AI-focused engineering roles in Ireland.
                </p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#work">
                    View featured work
                  </a>
                  <a className="button button-secondary" href="#contact">
                    Get in touch
                  </a>
                </div>
              </div>

              <aside className="hero-rail">
                <p className="rail-label">What I bring</p>
                <div className="narrative-list">
                  {narrativePoints.map((item, index) => (
                    <div className="narrative-item" key={item}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="metrics section" aria-label="Highlights">
          {highlightMetrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </section>

        <section id="work" className="section">
          <div className="section-heading">
            <p className="eyebrow">Featured projects</p>
            <h2>Selected systems showing product judgment and engineering depth.</h2>
            <p>
              Live software and production systems — from AI triage pipelines to payment
              microservices and full-stack e-commerce platforms.
            </p>
          </div>

          <div className="card-grid">
            {selectedWork.map((item, index) => (
              <article className="content-card" key={item.title}>
                <div className="card-index">{String(index + 1).padStart(2, "0")}</div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <p className="impact">{item.impact}</p>
                <p className="stack-line">{item.stack}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="stack" className="section split-section">
          <div className="section-pane">
            <div className="section-heading compact">
              <p className="eyebrow">Skills and tools</p>
              <h2>Technology focus</h2>
            </div>
            <div className="tag-grid">
              {stack.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="section-pane">
            <div className="section-heading compact">
              <p className="eyebrow">Live proof</p>
              <h2>Relevant product surfaces</h2>
            </div>
            <div className="link-list">
              {proofPoints.map((item) => (
                <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section split-section">
          <div className="section-pane about-pane">
            <div className="section-heading compact">
              <p className="eyebrow">About me</p>
              <h2>Backend-focused, AI-curious, and comfortable with real ownership.</h2>
            </div>
            <div className="about-list">
              {aboutPoints.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>

          <div className="section-pane">
            <div className="section-heading compact">
              <p className="eyebrow">Core strengths</p>
              <h2>What I lead with.</h2>
            </div>
            <div className="tag-grid">
              {strengths.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section principles-section">
          <div className="section-heading">
            <p className="eyebrow">Engineering principles</p>
            <h2>How I think about building software.</h2>
          </div>
          <div className="principles-grid">
            {principles.map((item) => (
              <article className="principle-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="section">
          <div className="section-heading">
            <p className="eyebrow">Experience</p>
            <h2>Professional background</h2>
          </div>

          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-item" key={item.company}>
                <div className="timeline-header">
                  <div>
                    <h3>{item.role}</h3>
                    <p className="timeline-company">{item.company} — {item.location}</p>
                  </div>
                  <p className="timeline-period">{item.period}</p>
                </div>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="education-card">
            <p className="eyebrow">Education</p>
            <h3>MSc Computer Science</h3>
            <p>University College Dublin — August 2025 to 2026</p>
            <p>Relevant coursework: Python for Data Science, Data Structures &amp; Algorithms, SQL, Cloud Computing</p>
            <h3>B.Tech Electrical and Electronics Engineering (Minor in CS)</h3>
            <p>VIT Chennai — 2017 to 2021 &nbsp;·&nbsp; CGPA 7.89</p>
            <p>Relevant coursework: Data Structures &amp; Algorithms, Web Development, DBMS</p>
          </div>
        </section>

        <section id="contact" className="section contact-card">
          <p className="eyebrow">Contact</p>
          <h2>Available for software engineering opportunities in Ireland.</h2>
          <p>
            If you are hiring for backend, full-stack, or AI-focused engineering roles, I would
            love to talk.
          </p>
          <div className="contact-links">
            <a href="mailto:varundutia.hameer@gmail.com">Email</a>
            <a href="tel:+353899466706">Phone</a>
            <a href="https://github.com/varundutia" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/varun-dutia-a735a2153/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </section>

        <footer className="site-footer">
          <span>Varun Hameer Dutia</span>
          <div className="footer-links">
            <a href="https://github.com/varundutia" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/varun-dutia-a735a2153/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
