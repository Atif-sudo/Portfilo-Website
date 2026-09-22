const portfolioHighlights = [
  { label: 'Years Experience', value: '5+' },
  { label: 'Projects Delivered', value: '28' },
  { label: 'Happy Clients', value: '12' }
];

const skills = [
  { title: 'Design', text: 'Figma, UX flows, visual systems, landing page design.' },
  { title: 'Development', text: 'React, JavaScript, HTML5, CSS, API-driven interfaces.' },
  { title: 'Performance', text: 'Responsive layouts, accessibility, SEO, and speed optimization.' },
  { title: 'Workflow', text: 'Git, GitHub, clean collaboration, iterative release cycles.' }
];

const projects = [
  {
    type: 'Brand Website',
    name: 'Northstar Studio',
    text: 'A premium studio website designed to spotlight storytelling and conversion-focused creative work.',
    accent: 'project-one'
  },
  {
    type: 'E-commerce',
    name: 'Velora Market',
    text: 'A polished storefront concept built to elevate trust, browsing flow, and product clarity.',
    accent: 'project-two'
  },
  {
    type: 'SaaS Product',
    name: 'FlowPilot',
    text: 'A product landing page engineered to explain a complex solution with clarity and confidence.',
    accent: 'project-three'
  }
];

const timeline = [
  {
    period: '2022 — Present',
    title: 'Senior Frontend Developer',
    text: 'Leading product experiences for growing businesses with a focus on UX, conversion, and polish.'
  },
  {
    period: '2019 — 2022',
    title: 'Web Designer & Developer',
    text: 'Created user-first digital experiences for startups and agencies across multiple industries.'
  },
  {
    period: '2017 — 2019',
    title: 'Visual Designer',
    text: 'Crafted brand systems, digital marketing assets, and conversion-driven landing pages.'
  }
];

const testimonials = [
  {
    quote: 'Alex transformed our product story into a cleaner, more convincing experience. The site immediately felt more premium and trustworthy.',
    name: 'Maya Chen',
    role: 'Marketing Lead, Northstar Studio'
  },
  {
    quote: 'The design and development process felt collaborative, strategic, and fast. We launched with more clarity and better conversion flow.',
    name: 'David Brooks',
    role: 'Founder, Velora Market'
  },
  {
    quote: 'A rare mix of visual polish and real business thinking. Alex balances good design with outcomes that support growth.',
    name: 'Rina Patel',
    role: 'Product Director, FlowPilot'
  }
];

const processSteps = [
  {
    step: '01',
    title: 'Discovery & direction',
    text: 'Clarify the audience, strategy, and key outcomes before a single design decision is made.'
  },
  {
    step: '02',
    title: 'Design with intent',
    text: 'Build interfaces that feel premium, are easy to navigate, and guide the user toward action.'
  },
  {
    step: '03',
    title: 'Launch & optimize',
    text: 'Ship clean, responsive experiences and keep improving based on real-world feedback.'
  }
];

const quickPrompts = [
  'What services do you offer?',
  'Show me your project experience.',
  'How can we work together?'
];

const clientLogos = ['Northstar', 'Velora', 'FlowPilot', 'Summit', 'Aster Labs', 'LaunchGrid'];

function PortfolioApp() {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState([]);
  const [draft, setDraft] = React.useState('');
  const [chatHasStarted, setChatHasStarted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Website Design',
    budget: 'Under $2k',
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
    doc.text('Alex Carter', margin, 72);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(185, 199, 216);
    doc.text('Frontend Developer & UI Designer', margin, 96);
    doc.text('alex@portfolio.dev  •  New York, USA', margin, 118);

    doc.setDrawColor(116, 225, 255);
    doc.setLineWidth(1);
    doc.line(margin, 136, pageWidth - margin, 136);

    doc.setTextColor(237, 244, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Profile', margin, 170);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const profile = 'Frontend-focused designer and developer building premium digital experiences with a strong focus on clarity, conversion, and polished product storytelling.';
    const profileLines = doc.splitTextToSize(profile, pageWidth - margin * 2);
    doc.text(profileLines, margin, 192);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Core strengths', margin, 258);
    doc.setFont('helvetica', 'normal');
    const strengths = [
      '• Responsive frontend development',
      '• UX-first design and conversion strategy',
      '• Design systems and polished product experiences',
      '• Performance optimization and accessibility'
    ];
    strengths.forEach((item, index) => {
      doc.text(item, margin, 282 + index * 18);
    });

    doc.setFont('helvetica', 'bold');
    doc.text('Experience', margin, 370);
    doc.setFont('helvetica', 'normal');
    const experience = [
      'Senior Frontend Developer | 2022 — Present',
      'Leading product experiences for growing businesses with a focus on UX, conversion, and polish.',
      '',
      'Web Designer & Developer | 2019 — 2022',
      'Created user-first digital experiences for startups and agencies across multiple industries.',
      '',
      'Visual Designer | 2017 — 2019',
      'Crafted brand systems, digital marketing assets, and conversion-driven landing pages.'
    ];
    experience.forEach((line, index) => {
      doc.text(line, margin, 392 + index * 18);
    });

    doc.save('Alex-Carter-Resume.pdf');
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
          <a href="#home" className="brand">Alex<span>Carter</span></a>

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
            <div className="hero-copy reveal">
              <p className="eyebrow">Web Developer & UI Designer</p>
              <h1>Building digital experiences that feel <span>human.</span></h1>
              <p className="lead">
                I design and build thoughtful, high-performing websites that help brands communicate clearly, convert visitors, and stay memorable.
              </p>
              <div className="hero-actions">
                <a href="#projects" className="btn btn-primary">View Projects</a>
                <a href="#contact" className="btn btn-secondary">Let’s Talk</a>
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

            <div className="hero-card reveal">
              <div className="profile-frame">
                <div className="badge">Available for freelance</div>
                <div className="avatar-wrap">
                  <div className="avatar-glow" />
                  <div className="avatar-illustration">
                    <div className="head" />
                    <div className="body" />
                  </div>
                </div>
                <div className="card-details">
                  <h3>Alex Carter</h3>
                  <p>Frontend Developer</p>
                </div>
              </div>
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
              <h2>Turning ideas into polished digital products.</h2>
            </div>
            <div className="about-grid">
              <div className="about-copy reveal">
                <p>
                  I’m a multidisciplinary developer with a love for building experiences that feel effortless. My work blends design thinking, frontend craftsmanship, and product strategy to shape digital experiences that look sharp and perform well.
                </p>
                <p>
                  From product ideas to fully launched interfaces, I help teams create websites that communicate confidently and convert attention into action.
                </p>
              </div>
              <div className="about-panel reveal">
                <div>
                  <span>Based in</span>
                  <strong>New York, USA</strong>
                </div>
                <div>
                  <span>Specialty</span>
                  <strong>Responsive Web Design</strong>
                </div>
                <div>
                  <span>Focus</span>
                  <strong>UX + Front-end Performance</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section muted">
          <div className="container">
            <div className="section-heading reveal">
              <p className="eyebrow">Skills</p>
              <h2>Tools and technologies I use every day.</h2>
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
              <p className="eyebrow">Projects</p>
              <h2>Selected work that blends strategy and execution.</h2>
            </div>
            <div className="projects-grid">
              {projects.map((project) => (
                <article key={project.name} className="project-card reveal">
                  <div className={`project-image ${project.accent}`} />
                  <div className="project-content">
                    <span>{project.type}</span>
                    <h3>{project.name}</h3>
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
              <p className="eyebrow">Testimonials</p>
              <h2>Trusted by teams that care about clarity and momentum.</h2>
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
              <h2>Clear strategy, thoughtful design, measurable outcomes.</h2>
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
              <h2>My professional journey.</h2>
            </div>
            <div className="timeline reveal">
              {timeline.map((item) => (
                <div key={item.title} className="timeline-item">
                  <div className="time">{item.period}</div>
                  <div className="content">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <div className="container footer-wrap">
          <div>
            <p className="eyebrow">Let’s Connect</p>
            <h2>Need a sharper digital presence or a better conversion flow?</h2>
          </div>
          <div className="lead-cta-group">
            <a href="mailto:alex@portfolio.dev" className="btn btn-primary">alex@portfolio.dev</a>
            <button type="button" className="btn btn-secondary" onClick={handleDownloadResume}>Download PDF Resume</button>
          </div>
        </div>

        <div className="container contact-section reveal">
          <div className="contact-layout">
            <div className="lead-intel-card">
              <h3>What I can help with</h3>
              <ul>
                <li>Brand and product websites</li>
                <li>Landing pages with strong CTAs</li>
                <li>UX-focused design and frontend build</li>
                <li>Design systems and marketing experiences</li>
              </ul>
              <div className="lead-intel-meta">
                <span>Typical response time: within 24 hours</span>
                <span>Available for freelance and product work</span>
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
                  placeholder="Company or brand"
                  onChange={(event) => setContactForm({ ...contactForm, company: event.target.value })}
                />
                <select
                  value={contactForm.projectType}
                  onChange={(event) => setContactForm({ ...contactForm, projectType: event.target.value })}
                >
                  <option>Website Design</option>
                  <option>Landing Page</option>
                  <option>E-commerce UX</option>
                  <option>Product Design</option>
                  <option>Frontend Development</option>
                </select>
              </div>
              <select
                value={contactForm.budget}
                onChange={(event) => setContactForm({ ...contactForm, budget: event.target.value })}
              >
                <option>Under $2k</option>
                <option>$2k - $5k</option>
                <option>$5k - $10k</option>
                <option>$10k+</option>
              </select>
              <textarea
                rows="4"
                value={contactForm.message}
                placeholder="Tell me about your project, timeline, and what you need help with..."
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
          <p>© <span>{new Date().getFullYear()}</span> Alex Carter. All rights reserved.</p>
          <div className="socials">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://dribbble.com" target="_blank" rel="noreferrer">Dribbble</a>
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
        Chat with Alex
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
