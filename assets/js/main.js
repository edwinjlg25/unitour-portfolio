/*
  Unitour portfolio interactions
  Goals:
  - Keep the UI fast and dependency-free.
  - Prefer early returns over else branches.
  - Ensure menus are accessible and close on outside click or Escape.
*/

(function () {
  const headerElement = document.querySelector('[data-header]');
  const navElement = document.querySelector('[data-nav]');
  const navToggleButton = document.querySelector('[data-nav-toggle]');
  const navListElement = document.querySelector('[data-nav-list]');
  const dropdownElements = Array.from(document.querySelectorAll('[data-dropdown]'));
  const contactForm = document.querySelector('[data-contact-form]');
  const formNote = document.querySelector('[data-form-note]');
  const yearElement = document.querySelector('[data-year]');
  const premiumNetwork = document.querySelector('[data-premium-network]');
  const premiumPanel = document.querySelector('[data-premium-panel]');
  const premiumTitle = document.querySelector('[data-premium-title]');
  const premiumLead = document.querySelector('[data-premium-lead]');
  const premiumQuotes = document.querySelector('[data-premium-quotes]');
  const premiumStars = document.querySelector('[data-premium-stars]');

  const setAriaExpanded = (element, isExpanded) => {
    if (!element) return;
    element.setAttribute('aria-expanded', String(isExpanded));
  };

  const closeAllDropdowns = () => {
    dropdownElements.forEach((dropdown) => {
      dropdown.classList.remove('is-open');
      const toggleButton = dropdown.querySelector('[data-dropdown-toggle]');
      setAriaExpanded(toggleButton, false);
    });
  };

  const closeMobileNav = () => {
    if (!navElement) return;
    navElement.classList.remove('is-open');
    setAriaExpanded(navToggleButton, false);
    closeAllDropdowns();
  };

  const openMobileNav = () => {
    if (!navElement) return;
    navElement.classList.add('is-open');
    setAriaExpanded(navToggleButton, true);
  };

  const toggleMobileNav = () => {
    if (!navElement) return;
    const isOpen = navElement.classList.contains('is-open');
    if (isOpen) {
      closeMobileNav();
      return;
    }
    openMobileNav();
  };

  const setHeaderState = () => {
    if (!headerElement) return;
    const shouldSetScrolled = window.scrollY > 8;
    headerElement.classList.toggle('is-scrolled', shouldSetScrolled);
  };

  const shouldIgnoreOutsideClick = (eventTarget) => {
    if (!navElement) return false;
    if (navElement.contains(eventTarget)) return true;
    return false;
  };

  const handleOutsideClick = (event) => {
    const eventTarget = event.target;
    if (!eventTarget) return;
    if (shouldIgnoreOutsideClick(eventTarget)) return;

    closeMobileNav();
    closeAllDropdowns();
  };

  const handleEscapeKey = (event) => {
    if (event.key !== 'Escape') return;
    closeMobileNav();
    closeAllDropdowns();
  };

  const handleNavLinkClick = (event) => {
    const linkElement = event.target.closest('a');
    if (!linkElement) return;
    if (!navListElement) return;
    if (!navListElement.contains(linkElement)) return;

    closeMobileNav();
  };

  const handleDropdownToggle = (toggleButton) => {
    if (!toggleButton) return;

    const dropdownElement = toggleButton.closest('[data-dropdown]');
    if (!dropdownElement) return;

    const isOpen = dropdownElement.classList.contains('is-open');
    closeAllDropdowns();

    if (isOpen) return;

    dropdownElement.classList.add('is-open');
    setAriaExpanded(toggleButton, true);
  };

  const wireDropdowns = () => {
    dropdownElements.forEach((dropdown) => {
      const toggleButton = dropdown.querySelector('[data-dropdown-toggle]');
      if (!toggleButton) return;

      toggleButton.addEventListener('click', () => handleDropdownToggle(toggleButton));
    });
  };

  const wireNavToggle = () => {
    if (!navToggleButton) return;
    navToggleButton.addEventListener('click', toggleMobileNav);
  };

  const wireContactForm = () => {
    if (!contactForm) return;
    if (!formNote) return;

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('message') || '').trim();

      if (!email) {
        formNote.textContent = 'Por favor, ingresa un correo electrónico válido.';
        return;
      }

      if (!message) {
        formNote.textContent = 'Por favor, escribe un mensaje breve para poder ayudarte.';
        return;
      }

      contactForm.reset();
      formNote.textContent = 'Mensaje listo. Reemplaza este mock por tu endpoint backend cuando lo necesites.';
    });
  };

  const setCurrentYear = () => {
    if (!yearElement) return;
    yearElement.textContent = String(new Date().getFullYear());
  };

  const getPremiumDataset = () => {
    return {
      career: {
        ing: {
          title: 'Ingeniería',
          lead: 'Opiniones agregadas sobre la experiencia de carrera y su carga académica.',
          rating: 4,
          quotes: [
            { text: 'Buen equilibrio entre teoría y práctica, especialmente en laboratorios.', meta: 'Reseña verificada · 4° semestre' },
            { text: 'Requiere disciplina, pero el plan se siente bien estructurado.', meta: 'Reseña anónima · 2° semestre' },
          ],
        },
        sis: {
          title: 'Sistemas',
          lead: 'Comentarios enfocados en programación, proyectos y materias clave.',
          rating: 5,
          quotes: [
            { text: 'Las materias de programación son muy completas si practicas desde el inicio.', meta: 'Reseña verificada · 5° semestre' },
            { text: 'Muy recomendado: proyectos integradores y buena progresión por semestres.', meta: 'Reseña anónima · 3° semestre' },
          ],
        },
      },
      semester: {
        s1: {
          title: 'Semestre 1',
          lead: 'Expectativas, nivelación y primeras materias base.',
          rating: 4,
          quotes: [
            { text: 'Ideal para adaptarse al ritmo; con buen hábito de estudio se pasa bien.', meta: 'Reseña verificada · Semestre 1' },
            { text: 'Las bases son importantes: matemática y comunicación marcan la diferencia.', meta: 'Reseña anónima · Semestre 2' },
          ],
        },
        s5: {
          title: 'Semestre 5',
          lead: 'Mayor carga y materias troncales; aquí se nota la especialización.',
          rating: 3,
          quotes: [
            { text: 'Semestre retador por la cantidad de proyectos; recomiendo planificar.', meta: 'Reseña verificada · Semestre 5' },
            { text: 'Muy útil, pero se siente pesado si no llevas buen orden con tareas.', meta: 'Reseña anónima · Semestre 6' },
          ],
        },
      },
      subject: {
        mat: {
          title: 'Matemática',
          lead: 'Opiniones por materia: dificultad, utilidad y recomendaciones.',
          rating: 4,
          quotes: [
            { text: 'Clave para materias futuras; practicar ejercicios todos los días ayuda.', meta: 'Reseña verificada · Ingeniería' },
            { text: 'Si te apoyas con guías y grupos de estudio, se vuelve mucho más llevadera.', meta: 'Reseña anónima · Sistemas' },
          ],
        },
        fis: {
          title: 'Física',
          lead: 'Experiencia de laboratorio, evaluaciones y ritmo de contenido.',
          rating: 3,
          quotes: [
            { text: 'Contenido interesante, pero exige constancia para no atrasarse.', meta: 'Reseña verificada · 3° semestre' },
            { text: 'Los laboratorios ayudan muchísimo a entender la teoría.', meta: 'Reseña anónima · 2° semestre' },
          ],
        },
        prog: {
          title: 'Programación',
          lead: 'Calidad de proyectos, prácticas y progresión por semestres.',
          rating: 5,
          quotes: [
            { text: 'La mejor materia: práctica real y proyectos que sí aportan al portafolio.', meta: 'Reseña verificada · Sistemas' },
            { text: 'Si entregas ejercicios semanales, avanzas rápido y se hace muy disfrutable.', meta: 'Reseña anónima · Ingeniería' },
          ],
        },
      },
    };
  };

  const setStarRating = (rating) => {
    if (!premiumStars) return;
    const starElements = Array.from(premiumStars.querySelectorAll('.star'));
    starElements.forEach((star, index) => {
      const isOn = index < rating;
      star.classList.toggle('is-on', isOn);
    });
  };

  const renderPremiumQuotes = (quotes) => {
    if (!premiumQuotes) return;
    premiumQuotes.innerHTML = '';
    const fragment = document.createDocumentFragment();

    quotes.forEach((quote) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'quote';

      const text = document.createElement('p');
      text.textContent = quote.text;
      text.style.margin = '0';

      const meta = document.createElement('p');
      meta.className = 'quote-meta';
      meta.textContent = quote.meta;

      wrapper.appendChild(text);
      wrapper.appendChild(meta);
      fragment.appendChild(wrapper);
    });

    premiumQuotes.appendChild(fragment);
  };

  const setPremiumContent = ({ title, lead, rating, quotes }) => {
    if (premiumTitle) premiumTitle.textContent = title;
    if (premiumLead) premiumLead.textContent = lead;
    setStarRating(rating);
    renderPremiumQuotes(quotes);
  };

  const clearPremiumSelection = () => {
    if (!premiumNetwork) return;
    const nodes = Array.from(premiumNetwork.querySelectorAll('[data-node]'));
    nodes.forEach((node) => node.setAttribute('aria-pressed', 'false'));
  };

  const handlePremiumNodeClick = (nodeButton) => {
    if (!nodeButton) return;
    const nodeType = String(nodeButton.getAttribute('data-node') || '');
    const nodeId = String(nodeButton.getAttribute('data-id') || '');
    if (!nodeType || !nodeId) return;

    const dataset = getPremiumDataset();
    const record = dataset?.[nodeType]?.[nodeId];
    if (!record) return;

    clearPremiumSelection();
    nodeButton.setAttribute('aria-pressed', 'true');
    setPremiumContent(record);
  };

  const wirePremiumDemo = () => {
    if (!premiumNetwork) return;
    if (!premiumPanel) return;

    premiumNetwork.addEventListener('click', (event) => {
      const target = event.target;
      if (!target) return;
      const button = target.closest('button[data-node]');
      if (!button) return;
      handlePremiumNodeClick(button);
    });
  };

  const init = () => {
    setHeaderState();
    setCurrentYear();
    wireNavToggle();
    wireDropdowns();
    wireContactForm();
    wirePremiumDemo();

    window.addEventListener('scroll', setHeaderState, { passive: true });
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('click', handleNavLinkClick);
  };

  init();
})();
