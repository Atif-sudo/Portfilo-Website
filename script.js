const portfolioHighlights = [
  { label: 'Experience', value: '1.5+' },
  { label: 'Security Focus', value: 'BAS' },
  { label: 'Primary Domain', value: 'Banking & Finance' }
];

const skills = [
  { title: 'Breach & Attack Simulation', text: 'Using Cymulate to validate EDR, DLP, email security, proxy, and web-security controls across client environments.' },
  { title: 'Attack Surface Management', text: 'Assessing external exposure and supporting visibility into digital assets and control effectiveness.' },
  { title: 'Phishing Readiness', text: 'Running phishing-awareness simulations and supporting user-risk awareness programs for operational resilience.' },
  { title: 'Offensive Security Growth', text: 'Building hands-on skills in infrastructure, Active Directory, web applications, APIs, and red-team fundamentals.' }
];

const projects = [
  {
    type: 'Security Validation',
    name: 'Cymulate BAS Program',
    titleLines: ['Cymulate BAS', 'Program'],
    text: 'Validated EDR, DLP, email security, proxy and web security controls for multiple enterprise and banking clients.',
    accent: 'project-one'
  },
  {
    type: 'Client Assessment',
    name: 'Security Control Reporting',
    titleLines: ['Security Control', 'Reporting'],
    text: 'Prepared assessment summaries, tracked client gaps, and coordinated remediation-focused findings with stakeholders.',
    accent: 'project-two'
  },
  {
    type: 'Hands-on Learning',
    name: 'Penetration Testing Roadmap',
    titleLines: ['Penetration', 'Testing'],
    text: 'Expanding practical knowledge across infrastructure, Active Directory, web applications and APIs with a red-team mindset.',
    accent: 'project-three'
  }
];

const timeline = [
  {
    period: '2024 — Present',
    title: 'Cybersecurity Analyst',
    text: 'Working at Digital Track Solutions, Mumbai, performing Breach and Attack Simulation using Cymulate and validating enterprise security controls for banking and financial-services clients.'
  },
  {
    period: '2022 — 2024',
    title: 'Security Operations & Growth',
    text: 'Built exposure in ASM, phishing-awareness simulations, client coordination, assessment reporting, and continuous security validation practices.'
  },
  {
    period: '2019 — 2022',
    title: 'MCA — Pondicherry University',
    text: 'Completed my Master of Computer Applications, with a focus on practical application, systems thinking and technical foundation building.'
  },
  {
    period: '2017 — 2020',
    title: 'BCA — Indira Gandhi National Tribal University',
    text: 'Completed my Bachelor of Computer Applications at Indira Gandhi National Tribal University, Amarkantak.'
  }
];

const testimonials = [
  {
    quote: 'Strong understanding of control validation and client reporting, with a disciplined approach to identifying real security gaps and communicating them clearly.',
    name: 'Security Assessment Team',
    role: 'Client Engagement Perspective'
  },
  {
    quote: 'Atif brings a practical mindset to cybersecurity validation. He translates technical findings into clear, actionable security outcomes for stakeholders.',
    name: 'Client Coordination Review',
    role: 'Operational Security Lens'
  },
  {
    quote: 'His current focus on BAS, ASM, and offensive security fundamentals shows the right blend of hands-on skill and long-term growth potential.',
    name: 'Career Progression View',
    role: 'Security Capability Development'
  }
];

const processSteps = [
  {
    step: '01',
    title: 'Assess the risk surface',
    text: 'Review the environment, exposures, and security controls to identify the real gaps before any action is taken.'
  },
  {
    step: '02',
    title: 'Validate controls in practice',
    text: 'Use real-world validation methods such as BAS, phishing testing, and review of EDR, DLP, proxy, and web security controls.'
  },
  {
    step: '03',
    title: 'Report and improve',
    text: 'Translate technical results into clear client-facing guidance and support a measurable path toward stronger resilience.'
  }
];

const quickPrompts = [
  'What is your cybersecurity experience?',
  'How do you validate security controls?',
  'Can you help with BAS and phishing awareness?'
];

const clientLogos = ['FinSecure', 'Aegis Bank', 'CrestID', 'IronGate', 'NorthStar', 'CyberOne'];

function PortfolioApp() {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState([]);
  const [draft, setDraft] = React.useState('');
  const [chatHasStarted, setChatHasStarted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [activeExperience, setActiveExperience] = React.useState(0);
  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Breach & Attack Simulation',
    budget: 'Under ₹2L',
    message: ''
  });
  const [contactStatus, setContactStatus] = React.useState('');
  const [contactState, setContactState] = React.useState('idle');
  const [isSending, setIsSending] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 420);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const sections = document.querySelectorAll('main section[id], footer[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (!visibleEntries.length) return;

        const topEntry = visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = topEntry.target.getAttribute('id');
        if (id) setActiveSection(id);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: '-10% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message) return;

    setChatHasStarted(true);
    setChatMessages((current) => {
      const next = [...current, { role: 'user', text: message }];
      return next.length > 2 ? next.slice(-2) : next;
    });
    setDraft('');
    setIsChatOpen(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      if (!response.ok && !data.reply) {
        throw new Error(data.details || data.error || 'The assistant could not respond.');
      }

      const assistantReply = data.reply || 'I am here to help.';
      setChatMessages((current) => {
        const next = [...current, { role: 'agent', text: assistantReply }];
        return next.length > 2 ? next.slice(-2) : next;
      });
    } catch (error) {
      setChatMessages((current) => {
        const next = [...current, { role: 'agent', text: 'The assistant is temporarily unavailable. Please try again in a moment.' }];
        return next.length > 2 ? next.slice(-2) : next;
      });
    }
  };

  const handleDownloadResume = () => {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      window.alert('The PDF export library is not available right now.');
      return;
    }

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 52;

    doc.setFillColor(7, 17, 31);
    doc.rect(0, 0, pageWidth, 842, 'F');
    doc.setTextColor(237, 244, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Mohammad Atif Ansari', margin, 72);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(185, 199, 216);
    doc.text('Cybersecurity Analyst', margin, 96);
    doc.text('Digital Track Solutions, Mumbai  •  atifansari.security@gmail.com', margin, 118);

    doc.setDrawColor(116, 225, 255);
    doc.setLineWidth(1);
    doc.line(margin, 136, pageWidth - margin, 136);

    doc.setTextColor(237, 244, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Profile', margin, 170);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const profile = 'Cybersecurity Analyst with hands-on experience in Breach and Attack Simulation using Cymulate, control validation for EDR, DLP, email security, proxy and web security, and active learning in infrastructure, AD, web applications and API security.';
    const profileLines = doc.splitTextToSize(profile, pageWidth - margin * 2);
    doc.text(profileLines, margin, 192);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Core strengths', margin, 258);
    doc.setFont('helvetica', 'normal');
    const strengths = [
      '• Breach and Attack Simulation using Cymulate',
      '• Security control validation for EDR, DLP, email, proxy and web security',
      '• ASM, phishing-awareness simulations and client reporting',
      '• Manual penetration testing growth across infra, AD, web apps and APIs'
    ];
    strengths.forEach((item, index) => {
      doc.text(item, margin, 282 + index * 18);
    });

    doc.setFont('helvetica', 'bold');
    doc.text('Education & Experience', margin, 370);
    doc.setFont('helvetica', 'normal');
    const experience = [
      'Cybersecurity Analyst | Digital Track Solutions, Mumbai | 2024 — Present',
      'Validate security controls for banking and financial-services clients with Cymulate BAS.',
      '',
      'MCA | Pondicherry University | 2022',
      'Completed Master of Computer Applications.',
      '',
      'BCA | Indira Gandhi National Tribal University, Amarkantak | 2020',
      'Completed Bachelor of Computer Applications.'
    ];
    experience.forEach((line, index) => {
      doc.text(line, margin, 392 + index * 18);
    });

    doc.save('Mohammad-Atif-Ansari-Resume.pdf');
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    const { name, email, company, projectType, budget, message } = contactForm;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setContactStatus('Please add your name, email, and project details before sending.');
      setContactState('error');
      return;
    }

    const enrichedMessage = [
      message.trim(),
      company ? `Company: ${company}` : '',
      `Project type: ${projectType}`,
      `Budget: ${budget}`
    ].filter(Boolean).join('\n');

    setIsSending(true);
    setContactStatus('Sending your project inquiry...');
    setContactState('pending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: enrichedMessage })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to send your message right now.');
      }

      setContactForm({ name: '', email: '', company: '', projectType: 'Website Design', budget: 'Under $2k', message: '' });
      setContactStatus(data.message || 'Your message has been saved successfully.');
      setContactState('success');
    } catch (error) {
      setContactStatus(error.message || 'Something went wrong. Please try again.');
      setContactState('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="container nav-wrap">
          <a href="#home" className="brand">Atif<span>Ansari</span></a>

          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            ☰
          </button>

          <nav className={`site-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
            {['about', 'skills', 'projects', 'approach', 'experience', 'contact'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className={activeSection === item ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item === 'approach' ? 'Approach' : item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="container hero-grid">
            <div className="hero-visual reveal" aria-hidden="true" />
            <div className="hero-copy reveal">
              <p className="eyebrow">Cybersecurity Analyst</p>
              <h1>Selected security validation and <span>assessment work.</span></h1>
              <p className="lead">
                I’m Mohammad Atif Ansari, a cybersecurity analyst based in Mumbai with 1.5 years of hands-on experience in breach and attack simulation, security validation, and client-focused assessment reporting.
              </p>
              <div className="hero-actions">
                <a href="#projects" className="btn btn-primary">View Security Work</a>
                <a href="#contact" className="btn btn-secondary">Let’s Connect</a>
                <button type="button" className="btn btn-tertiary" onClick={handleDownloadResume}>Download PDF Resume</button>
              </div>
              <ul className="mini-stats">
                {portfolioHighlights.map((item) => (
                  <li key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <div className="container trust-wrap reveal">
            <p>Trusted by teams building with clarity</p>
            <div className="logo-row">
              {clientLogos.map((logo) => (
                <span key={logo} className="logo-pill">{logo}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">About Me</p>
              <h2>Focused on validating security controls and building resilience.</h2>
            </div>
            <div className="about-grid">
              <div className="about-copy reveal">
                <p>
                  I completed my BCA from Indira Gandhi National Tribal University, Amarkantak, and then my MCA from Pondicherry University, graduating in 2022. I currently work as a Cybersecurity Analyst at Digital Track Solutions in Mumbai.
                </p>
                <p>
                  My primary work is Breach and Attack Simulation using Cymulate, where I validate controls such as EDR, DLP, email security, proxy and web security across clients in banking and financial-services environments. I also support ASM, phishing-awareness activities, client coordination and detailed assessment reporting.
                </p>
              </div>
              <div className="about-panel reveal">
                <div>
                  <span>Based in</span>
                  <strong>Mumbai, India</strong>
                </div>
                <div>
                  <span>Specialty</span>
                  <strong>Breach & Attack Simulation</strong>
                </div>
                <div>
                  <span>Focus</span>
                  <strong>Control Validation & Red-Team Growth</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section muted">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">Skills</p>
              <h2>Security capabilities and learning focus.</h2>
            </div>
            <div className="skills-grid">
              {skills.map((skill) => (
                <div key={skill.title} className="skill-card reveal">
                  <h3>{skill.title}</h3>
                  <p>{skill.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">Security Work</p>
              <h2>Selected security validation and assessment work.</h2>
            </div>
            <div className="projects-grid">
              {projects.map((project) => (
                <article key={project.name} className="project-card reveal">
                  <div className={`project-image ${project.accent}`} />
                  <div className="project-content">
                    <span>{project.type}</span>
                    <h3>
                      {project.titleLines ? project.titleLines.map((line, index) => (
                        <React.Fragment key={`${project.name}-${index}`}>
                          {line}
                          {index < project.titleLines.length - 1 && <br />}
                        </React.Fragment>
                      )) : project.name}
                    </h3>
                    <p>{project.text}</p>
                    <a href="#contact">Case Study</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="section">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">Credibility</p>
              <h2>Built around practical security validation and client readiness.</h2>
            </div>
            <div className="testimonial-grid">
              {testimonials.map((testimonial) => (
                <blockquote key={testimonial.name} className="testimonial-card reveal">
                  <div className="stars" aria-label="5 star rating">★★★★★</div>
                  <p>“{testimonial.quote}”</p>
                  <footer>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="approach" className="section muted">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">Approach</p>
              <h2>Security validation backed by practical offensive learning.</h2>
            </div>
            <div className="process-grid">
              {processSteps.map((step) => (
                <div key={step.step} className="process-card reveal">
                  <span className="step-number">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="section muted">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">Experience</p>
              <h2>Academic and professional journey.</h2>
            </div>
            <div className="timeline reveal">
              {timeline.map((item, index) => {
                const isOpen = activeExperience === index;
                return (
                  <div key={item.title} className={`timeline-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="timeline-toggle"
                      onClick={() => setActiveExperience(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                    >
                      <div className="time">{item.period}</div>
                      <div className="timeline-header-copy">
                        <h3>{item.title}</h3>
                        <span className="timeline-indicator">{isOpen ? '−' : '+'}</span>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="timeline-content">
                        <p>{item.text}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <div className="container footer-wrap">
          <div>
            <p className="eyebrow">Let’s Connect</p>
            <h2>Available for security validation, control assessment, and growth-focused opportunities.</h2>
          </div>
          <div className="lead-cta-group">
            <a href="mailto:atifansari.security@gmail.com" className="btn btn-primary">atifansari.security@gmail.com</a>
            <button type="button" className="btn btn-secondary" onClick={handleDownloadResume}>Download PDF Resume</button>
          </div>
        </div>

        <div className="container contact-section reveal">
          <div className="contact-layout">
            <div className="lead-intel-card">
              <h3>What I can help with</h3>
              <ul>
                <li>Breach & Attack Simulation</li>
                <li>Security control validation</li>
                <li>Phishing awareness and ASM support</li>
                <li>Client coordination and risk reporting</li>
              </ul>
              <div className="lead-intel-meta">
                <span>Typical response time: within 24 hours</span>
                <span>Open to security assessment and validation opportunities</span>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="input-row">
                <input
                  type="text"
                  value={contactForm.name}
                  placeholder="Your name"
                  onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })}
                />
                <input
                  type="email"
                  value={contactForm.email}
                  placeholder="Email address"
                  onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })}
                />
              </div>
              <div className="input-row">
                <input
                  type="text"
                  value={contactForm.company}
                  placeholder="Company or organization"
                  onChange={(event) => setContactForm({ ...contactForm, company: event.target.value })}
                />
                <select
                  value={contactForm.projectType}
                  onChange={(event) => setContactForm({ ...contactForm, projectType: event.target.value })}
                >
                  <option>Breach & Attack Simulation</option>
                  <option>Security Assessment</option>
                  <option>Phishing Awareness Program</option>
                  <option>Attack Surface Review</option>
                  <option>Red-Team / PT Practice</option>
                  <option>Other Security Need</option>
                </select>
              </div>
              <select
                value={contactForm.budget}
                onChange={(event) => setContactForm({ ...contactForm, budget: event.target.value })}
              >
                <option>Under ₹2L</option>
                <option>₹2L - ₹5L</option>
                <option>₹5L - ₹10L</option>
                <option>₹10L+</option>
              </select>
              <textarea
                rows="4"
                value={contactForm.message}
                placeholder="Tell me about your security requirement, timeline, and what you need help with..."
                onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })}
              />
              <div className="contact-actions">
                <button type="submit" className="btn btn-primary" disabled={isSending}>
                  {isSending ? 'Sending...' : 'Send Project Inquiry'}
                </button>
                <p className={`form-status ${contactState}`}>{contactStatus}</p>
              </div>
            </form>
          </div>
        </div>

        <div className="container bottom-bar">
          <p>© <span>{new Date().getFullYear()}</span> Mohammad Atif Ansari. All rights reserved.</p>
          <div className="socials">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:atifansari.security@gmail.com">Email</a>
          </div>
        </div>
      </footer>

      <button
        type="button"
        className={`back-to-top ${showBackToTop ? 'is-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>

      <button type="button" className="chat-launcher" onClick={() => setIsChatOpen((value) => !value)} aria-expanded={isChatOpen}>
        <span className="chat-launcher-icon">💬</span>
        Chat with Atif
      </button>

      <aside className={`chat-widget ${isChatOpen ? 'is-open' : ''}`} aria-hidden={!isChatOpen}>
        <div className="chat-header">
          <div className="chat-title-wrap">
            <span className="status-dot" />
            <div>
              <strong>Portfolio AI</strong>
              <small>Online</small>
            </div>
          </div>
          <button type="button" className="chat-close" onClick={() => setIsChatOpen(false)} aria-label="Close chat">
            ✕
          </button>
        </div>

        {chatHasStarted && (
          <div className="agent-chat" aria-live="polite">
            {chatMessages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
        )}

        {!chatHasStarted && (
          <div className="quick-prompts" aria-label="Suggested prompts">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" className="prompt-btn" onClick={() => setDraft(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        )}

        <form className="agent-form" onSubmit={handleChatSubmit}>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about projects, services, or process..."
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
      </aside>
    </>
  );
}

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach((element) => {
  element.classList.add('visible');
  revealObserver.observe(element);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PortfolioApp />);
