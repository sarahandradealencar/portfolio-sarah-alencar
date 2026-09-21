const root = document.documentElement;
const body = document.body;
const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const themeButton = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

function setMenu(open) {
  mainNav.classList.toggle('is-open', open);
  mainNav.inert = !open && window.matchMedia('(max-width: 960px)').matches;
  body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.sr-only').textContent = open ? 'Fechar menu' : 'Abrir menu';
}

mainNav.inert = window.matchMedia('(max-width: 960px)').matches;
menuButton.addEventListener('click', () => setMenu(!mainNav.classList.contains('is-open')));
mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
    setMenu(false);
    menuButton.focus({ preventScroll: true });
  }
});
window.addEventListener('resize', () => { if (!mainNav.classList.contains('is-open')) mainNav.inert = window.matchMedia('(max-width: 960px)').matches; });

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeIcon.textContent = theme === 'dark' ? '☼' : '◐';
  themeButton.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
}

let storedTheme = null;
try { storedTheme = localStorage.getItem('portfolio-theme'); } catch {}
const initialTheme = root.dataset.theme || storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(initialTheme);

themeButton.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  try { localStorage.setItem('portfolio-theme', nextTheme); } catch {}
});

const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      card.classList.toggle('is-hidden', filter !== 'all' && !categories.includes(filter));
    });
  });
});

const copyButton = document.querySelector('.copy-button');
const copyStatus = document.querySelector('.copy-status');
copyButton?.addEventListener('click', async () => {
  const email = copyButton.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    try {
      const temporaryInput = document.createElement('input');
      temporaryInput.value = email;
      temporaryInput.setAttribute('readonly', '');
      temporaryInput.style.position = 'fixed';
      temporaryInput.style.opacity = '0';
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      if (!document.execCommand('copy')) throw new Error('copy failed');
      temporaryInput.remove();
    } catch {
      copyStatus.textContent = 'Não foi possível copiar. Selecione o endereço acima.';
      return;
    }
  }
  copyStatus.textContent = 'E-mail copiado com sucesso.';
  window.setTimeout(() => { copyStatus.textContent = ''; }, 3500);
});

const travelDialog = document.querySelector('#travel-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogDetail = document.querySelector('#dialog-detail');
const dialogClose = document.querySelector('.dialog-close');

document.querySelectorAll('.travel-card').forEach((card) => {
  card.addEventListener('click', () => {
    dialogTitle.textContent = card.dataset.place;
    dialogDetail.textContent = card.dataset.detail;
    travelDialog.showModal();
  });
});

dialogClose?.addEventListener('click', () => travelDialog.close());
travelDialog?.addEventListener('click', (event) => {
  if (event.target === travelDialog) travelDialog.close();
});

const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = formData.get('nome').trim();
  const email = formData.get('email').trim();
  const message = formData.get('mensagem').trim();
  const subject = encodeURIComponent(`Contato pelo portfólio — ${name}`);
  const bodyText = `Olá, Sarah!\n\n${message}\n\nNome: ${name}\nE-mail: ${email}`;
  window.location.href = `mailto:sarahandradealencar@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
});
