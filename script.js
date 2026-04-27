// 1. Inicializar Lenis (Smooth Scroll Nativo)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sincronizar Lenis com GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{ lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// ==========================================================================
// SPA NAVIGATION LOGIC
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const views = document.querySelectorAll('.view-section');
  const navLinks = document.querySelectorAll('[data-view]');
  const header = document.getElementById('main-header');
  let isAnimating = false;

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetViewId = link.getAttribute('data-view');
      const currentActiveView = document.querySelector('.view-section.active').id;

      // Lógica Especial para Contato
      if (targetViewId === 'contato') {
        if (currentActiveView === 'view-home') {
          // Na Home, apenas rola para o rodapé sem marcar o link como ativo
          lenis.scrollTo('#home-footer', { offset: 0, duration: 1.5 });
          return; // Não executa o switchView
        }
      }

      window.switchView(targetViewId);
    });
  });

  window.switchView = function(viewId) {
    if (isAnimating) return;
    isAnimating = true;

    // Atualiza links ativos
    navLinks.forEach(link => {
      if (link.getAttribute('data-view') === viewId) {
        link.classList.add('active-link');
      } else {
        link.classList.remove('active-link');
      }
    });

    const currentView = document.querySelector('.view-section.active');
    const nextView = document.getElementById(`view-${viewId}`);

    if (currentView === nextView) {
      isAnimating = false;
      return;
    }

    // Esconder todas as views
    views.forEach(v => {
      v.classList.remove('active');
      v.style.display = 'none';
    });

    // Mostrar a view solicitada
    if (nextView) {
      nextView.style.display = 'block';
      setTimeout(() => {
        nextView.classList.add('active');
        
        // Fazer o scroll ir para o topo imediatamente
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true });

        // Reiniciar e recriar os triggers do GSAP para a nova view
        ScrollTrigger.refresh();
        initAnimations();
        isAnimating = false;
      }, 50);
    }
  }

  // ==========================================================================
  // LIGHTBOX LOGIC
  // ==========================================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  window.openLightbox = function(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    lenis.stop(); // Pausa o scroll
  };

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    lenis.start(); // Retoma o scroll
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      lenis.start();
    }
  });

  // ==========================================================================
  // HERO SLIDESHOW
  // ==========================================================================
  const slides = document.querySelectorAll('.slide');
  if(slides.length > 0) {
    let currentSlide = 0;
    const slideInterval = 5000;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, slideInterval);
  }

  // ==========================================================================
  // GSAP ANIMATIONS
  // ==========================================================================
  function initAnimations() {
    // Matar triggers anteriores para não bugar ao trocar de página
    ScrollTrigger.getAll().forEach(t => t.kill());
    
    // Animação do Título do Hero
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.closest('.active')) {
      gsap.fromTo(heroTitle, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
      );
    }

    // Títulos de Páginas Internas (Projetos / Sobre)
    const pageTitles = document.querySelectorAll('.active .page-title');
    pageTitles.forEach(title => {
      gsap.fromTo(title, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
      );
    });

    // Fade Elements Genéricos
    const fadeElements = document.querySelectorAll('.active .fade-element');
    fadeElements.forEach(el => {
      gsap.fromTo(el, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Animação dos Projetos (Grid Home)
    const projetos = document.querySelectorAll('.active .projeto-item');
    projetos.forEach((projeto) => {
      gsap.fromTo(projeto, 
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: projeto,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Parallax Imagens (Projetos Home)
    const imagens = document.querySelectorAll('.active .projeto-img-wrapper img');
    imagens.forEach((img) => {
      gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // Animação da seção Sobre (Home)
    const sobreTexto = document.querySelector('.active .sobre-texto');
    if (sobreTexto) {
      gsap.fromTo(sobreTexto,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.sobre-section',
            start: "top 70%",
          }
        }
      );
    }

    // Animação do Footer (se existir na view ativa)
    const footerTitle = document.querySelector('.active .footer-title');
    if (footerTitle) {
      gsap.fromTo(footerTitle,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerTitle.closest('.footer'),
            start: "top 80%",
          }
        }
      );
    }
  }

  // Função para renderizar as galerias dos projetos
  function loadProjectGalleries() {
    const projects = [
      { id: 'grid-residencial', folder: 'residencial D.E 1', prefix: 'Portfólio Residencial 1 - Luana Macedo - (', count: 19 },
      { id: 'grid-auditorio', folder: 'Auditorio Dois Candangos', prefix: 'Comercial Auditório Dois Candangos (', count: 11 },
      { id: 'grid-mesp', folder: 'Vestiário MESP', prefix: 'comercial -Vestiário MESP (', count: 8 },
      { id: 'grid-maker', folder: 'Espaço Maker', prefix: 'Comercial Espaço Maker (', count: 6 }
    ];

    projects.forEach(p => {
      const container = document.getElementById(p.id);
      if (!container) return;
      
      let html = '';
      for (let i = 1; i <= p.count; i++) {
        const imgSrc = `../portfolio/imagens/${p.folder}/${p.prefix}${i}).png`;
        html += `
          <article class="gallery-item" onclick="openLightbox('${imgSrc}')">
            <div class="gallery-img">
              <img src="${imgSrc}" alt="Galeria ${i}" loading="lazy">
            </div>
          </article>
        `;
      }
      container.innerHTML = html;
    });
  }

  // Inicializar galerias
  loadProjectGalleries();

  // Inicializar a primeira vez
  window.switchView('home');
});
