const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const year = document.querySelector('#year');
const revealItems = document.querySelectorAll('.reveal');
const agentForm = document.querySelector('#agent-form');
const agentInput = document.querySelector('#agent-input');
const agentChat = document.querySelector('#agent-chat');
const chatWidget = document.querySelector('#chat-widget');
const chatLauncher = document.querySelector('.chat-launcher');
const chatClose = document.querySelector('#chat-close');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function toggleChat(forceState) {
  if (!chatWidget || !chatLauncher) return;

  const shouldOpen = typeof forceState === 'boolean' ? forceState : !chatWidget.classList.contains('is-open');
  chatWidget.classList.toggle('is-open', shouldOpen);
  chatWidget.setAttribute('aria-hidden', String(!shouldOpen));
  chatLauncher.setAttribute('aria-expanded', String(shouldOpen));
}

if (chatLauncher) {
  chatLauncher.addEventListener('click', () => toggleChat());
}

if (chatClose) {
  chatClose.addEventListener('click', () => toggleChat(false));
}

function addMessage(role, text) {
  if (!agentChat) return;

  const message = document.createElement('div');
  message.className = `message ${role}`;

  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  message.appendChild(paragraph);

  agentChat.appendChild(message);
  agentChat.scrollTop = agentChat.scrollHeight;
}

async function askPortfolioAgent(prompt) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: prompt })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.details || data.error || 'The agent could not respond.');
  }

  return data.reply || 'I could not generate a response right now.';
}

if (agentForm && agentInput && agentChat) {
  const quickButtons = document.querySelectorAll('.prompt-btn');

  quickButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.textContent.trim();
      agentInput.value = value;
      agentInput.focus();
      if (chatWidget) {
        toggleChat(true);
      }
      agentForm.requestSubmit();
    });
  });

  agentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = agentInput.value.trim();

    if (!value) {
      agentInput.focus();
      return;
    }

    addMessage('user', value);
    agentInput.value = '';

    try {
      const reply = await askPortfolioAgent(value);
      addMessage('agent', reply);
    } catch (error) {
      addMessage('agent', error.message || 'The assistant is unavailable right now.');
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));
