// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 50);
  lastScroll = scrollY;
});

// ===== Mobile Menu Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollY = window.scrollY + 150;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ===== Scroll Animations (Intersection Observer) =====
const animElements = document.querySelectorAll('.anim-fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.style.getPropertyValue('--delay') || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay * 100);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

animElements.forEach(el => observer.observe(el));

// ===== Hero Slider =====
const heroSlider = document.getElementById('heroSlider');
const heroDots = document.getElementById('heroDots');
const heroImages = document.getElementById('heroImages');

if (heroSlider && heroDots) {
  const slides = heroSlider.querySelectorAll('.hero-slide');
  const dots = heroDots.querySelectorAll('.slider-dot');
  const images = heroImages ? heroImages.querySelectorAll('.hero-img') : [];
  let current = 0;
  let autoplayTimer;
  const AUTOPLAY_DELAY = 5000;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    if (images[current]) images[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    if (images[current]) images[current].classList.add('active');
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goToSlide(current + 1), AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
      startAutoplay();
    });
  });

  // Arrow clicks
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(current - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(current + 1); startAutoplay(); });

  // Keyboard navigation
  heroSlider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goToSlide(current - 1); startAutoplay(); }
    if (e.key === 'ArrowRight') { goToSlide(current + 1); startAutoplay(); }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  heroSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  heroSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? current + 1 : current - 1);
    }
    startAutoplay();
  }, { passive: true });

  // Pause on hover
  heroSlider.addEventListener('mouseenter', stopAutoplay);
  heroSlider.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 20;
      const top = target.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Message Sent!
      `;
      btn.style.background = 'var(--color-primary-dark)';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 2500);
    }, 1200);
  });
}

// ===== Parallax Glow on Mouse Move (Desktop Only) =====
if (window.innerWidth > 768) {
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      heroGlow.style.transform = `translate(${x - 50}px, ${y - 50}px)`;
    });
  }
}
