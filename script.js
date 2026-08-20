/* ==========================================================================
   NXT Chapter - Interactive JavaScript
   Stat Counters, Modal Dialogs, Navbar Scroll, Form Handlers, Program Tabs & Toasts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initPageNavigation();
  initHeroSlideshow();
  initImpactSlideshow();
});

/* ==========================================================================
   HERO PHOTO SLIDESHOW CONTROLLER
   ========================================================================== */

let heroSlideIndex = 0;
let heroSlideTimer = null;

function showHeroSlide(index) {
  const slides = document.querySelectorAll('#hero-slideshow .hero-slide');
  const dots = document.querySelectorAll('#hero-slide-dots .hero-dot');
  if (!slides.length) return;

  if (index >= slides.length) heroSlideIndex = 0;
  else if (index < 0) heroSlideIndex = slides.length - 1;
  else heroSlideIndex = index;

  slides.forEach((slide, i) => {
    if (i === heroSlideIndex) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  dots.forEach((dot, i) => {
    if (i === heroSlideIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function moveHeroSlide(direction) {
  showHeroSlide(heroSlideIndex + direction);
  resetHeroSlideTimer();
}

function setHeroSlide(index) {
  showHeroSlide(index);
  resetHeroSlideTimer();
}

function resetHeroSlideTimer() {
  if (heroSlideTimer) clearInterval(heroSlideTimer);
  heroSlideTimer = setInterval(() => {
    moveHeroSlide(1);
  }, 4000);
}

function initHeroSlideshow() {
  const slideshowContainer = document.getElementById('hero-slideshow');
  if (!slideshowContainer) return;

  showHeroSlide(0);
  resetHeroSlideTimer();

  slideshowContainer.addEventListener('mouseenter', () => {
    if (heroSlideTimer) clearInterval(heroSlideTimer);
  });

  slideshowContainer.addEventListener('mouseleave', () => {
    resetHeroSlideTimer();
  });
}

/* ==========================================================================
   IMPACT INFOGRAPHIC CAROUSEL CONTROLLER
   ========================================================================== */

let impactSlideIndex = 0;
let impactSlideTimer = null;
const impactSlidesData = [
  { src: 'assets/impact_slide_metrics.png', alt: 'Key Success Metrics (2024-2025)', title: 'Key Success Metrics (2024–2025)' },
  { src: 'assets/impact_slide_employment.png', alt: 'Where Second Chances Begin: Employment Access', title: 'Where Second Chances Begin: Employment Access' },
  { src: 'assets/impact_slide_why_reentry.png', alt: 'Why Reentry Matters', title: 'Why Reentry Support Matters' },
  { src: 'assets/impact_slide_corrections.png', alt: 'The Bigger Picture: U.S. Corrections System', title: 'The Bigger Picture: U.S. Corrections System' },
  { src: 'assets/impact_slide_challenges.jpg', alt: 'Challenges Returning Citizens Face', title: 'Challenges Facing Returning Citizens' }
];

function showImpactSlide(index) {
  const slides = document.querySelectorAll('#impact-carousel-viewport .impact-slide-item');
  const dots = document.querySelectorAll('#impact-carousel-dots .impact-dot-pill');
  const captionEl = document.getElementById('impact-carousel-caption');
  const counterEl = document.getElementById('impact-carousel-counter');

  if (!slides.length) return;

  if (index >= slides.length) impactSlideIndex = 0;
  else if (index < 0) impactSlideIndex = slides.length - 1;
  else impactSlideIndex = index;

  slides.forEach((slide, i) => {
    if (i === impactSlideIndex) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  dots.forEach((dot, i) => {
    if (i === impactSlideIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  if (captionEl && impactSlidesData[impactSlideIndex]) {
    captionEl.textContent = impactSlidesData[impactSlideIndex].title;
  }
  if (counterEl) {
    counterEl.textContent = `Slide ${impactSlideIndex + 1} of ${slides.length}`;
  }
}

function moveImpactSlide(direction) {
  showImpactSlide(impactSlideIndex + direction);
  resetImpactSlideTimer();
}

function setImpactSlide(index) {
  showImpactSlide(index);
  resetImpactSlideTimer();
}

function resetImpactSlideTimer() {
  if (impactSlideTimer) clearInterval(impactSlideTimer);
  impactSlideTimer = setInterval(() => {
    moveImpactSlide(1);
  }, 5000);
}

function initImpactSlideshow() {
  const carouselContainer = document.getElementById('impact-carousel-viewport');
  if (!carouselContainer) return;

  showImpactSlide(0);
  resetImpactSlideTimer();

  carouselContainer.addEventListener('mouseenter', () => {
    if (impactSlideTimer) clearInterval(impactSlideTimer);
  });

  carouselContainer.addEventListener('mouseleave', () => {
    resetImpactSlideTimer();
  });
}

/* ==========================================================================
   EXCLUSIVE PAGE NAVIGATION CONTROLLER
   ========================================================================== */

function navigateToPage(pageId) {
  if (!pageId) pageId = 'home';
  pageId = pageId.replace(/^#/, '');

  const validPages = ['home', 'programs', 'impact', 'news', 'departments', 'skillvrse', 'insight', 'about', 'contact'];
  if (!validPages.includes(pageId)) {
    pageId = 'home';
  }

  // Hide all page containers and activate the target container
  const pageContainers = document.querySelectorAll('.page-container');
  pageContainers.forEach(container => {
    container.classList.remove('active');
  });

  const targetContainer = document.getElementById(`page-${pageId}`);
  if (targetContainer) {
    targetContainer.classList.add('active');
  }

  // Scroll window to top exclusively for the selected page
  window.scrollTo(0, 0);

  // Blur active element to prevent persistent browser focus outlines
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }

  // Update navbar active links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === `#${pageId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Re-observe counters when landing on active page
  if (typeof initCounters === 'function') {
    initCounters();
  }
}

function initPageNavigation() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    // Ignore modal overlays and policies toast triggers
    const modalIds = ['#youth-modal', '#adult-modal', '#referral-modal', '#donate-modal', '#mission-modal', '#story-modal', '#policies'];
    if (modalIds.includes(href)) return;

    const pageId = href.replace(/^#/, '');
    const validPages = ['home', 'programs', 'impact', 'news', 'departments', 'skillvrse', 'insight', 'about', 'contact'];

    if (validPages.includes(pageId)) {
      e.preventDefault();
      navigateToPage(pageId);
      history.pushState(null, '', `#${pageId}`);
    }
  });

  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace(/^#/, '');
    navigateToPage(hash || 'home');
  });

  const initialHash = window.location.hash.replace(/^#/, '');
  navigateToPage(initialHash || 'home');
}

/* ==========================================================================
   NAVBAR & MOBILE MENU
   ========================================================================== */

function initNavbar() {
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      showToast('Navigating NXT Chapter Sections...');
    });
  }
}

/* ==========================================================================
   PROGRAM TABS CONTROLLER (S.E.E.D Program vs Youth Program)
   ========================================================================== */

function switchProgramTab(tabName) {
  navigateToPage('programs');

  // Update Buttons
  const seedBtn = document.getElementById('tab-btn-seed');
  const youthBtn = document.getElementById('tab-btn-youth');
  
  // Update Content Panels
  const seedContent = document.getElementById('tab-content-seed');
  const youthContent = document.getElementById('tab-content-youth');

  if (tabName === 'seed') {
    if (seedBtn) seedBtn.classList.add('active');
    if (youthBtn) youthBtn.classList.remove('active');
    if (seedContent) seedContent.classList.add('active');
    if (youthContent) youthContent.classList.remove('active');
  } else if (tabName === 'youth') {
    if (youthBtn) youthBtn.classList.add('active');
    if (seedBtn) seedBtn.classList.remove('active');
    if (youthContent) youthContent.classList.add('active');
    if (seedContent) seedContent.classList.remove('active');
  }
}

/* ==========================================================================
   PROGRAMS MEGA DROPDOWN TAB CONTROLLER
   ========================================================================== */

function switchProgramsDropdownTab(tabName, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const seedTabHead = document.getElementById('drop-tab-program-seed');
  const youthTabHead = document.getElementById('drop-tab-program-youth');
  const paneSeed = document.getElementById('pane-program-seed');
  const paneYouth = document.getElementById('pane-program-youth');

  if (tabName === 'seed') {
    if (seedTabHead) seedTabHead.className = 'impact-tab-head active-purple';
    if (youthTabHead) youthTabHead.className = 'impact-tab-head inactive-teal';
    if (paneSeed) paneSeed.classList.add('active');
    if (paneYouth) paneYouth.classList.remove('active');
  } else if (tabName === 'youth') {
    if (youthTabHead) youthTabHead.className = 'impact-tab-head active-teal';
    if (seedTabHead) seedTabHead.className = 'impact-tab-head inactive-purple';
    if (paneYouth) paneYouth.classList.add('active');
    if (paneSeed) paneSeed.classList.remove('active');
  }
}

/* ==========================================================================
   IMPACT MEGA DROPDOWN TAB CONTROLLER
   ========================================================================== */

function switchImpactDropdownTab(tabName, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const impactTabHead = document.getElementById('drop-tab-impact');
  const testimonialsTabHead = document.getElementById('drop-tab-testimonials');
  const paneImpact = document.getElementById('pane-impact');
  const paneTestimonials = document.getElementById('pane-testimonials');

  if (tabName === 'impact') {
    if (impactTabHead) impactTabHead.className = 'impact-tab-head active-purple';
    if (testimonialsTabHead) testimonialsTabHead.className = 'impact-tab-head inactive-teal';
    if (paneImpact) paneImpact.classList.add('active');
    if (paneTestimonials) paneTestimonials.classList.remove('active');
  } else if (tabName === 'testimonials') {
    if (testimonialsTabHead) testimonialsTabHead.className = 'impact-tab-head active-teal';
    if (impactTabHead) impactTabHead.className = 'impact-tab-head inactive-purple';
    if (paneTestimonials) paneTestimonials.classList.add('active');
    if (paneImpact) paneImpact.classList.remove('active');
  }
}

function switchImpactPageTab(tabName) {
  const impactTabHead = document.getElementById('page-tab-impact');
  const testimonialsTabHead = document.getElementById('page-tab-testimonials');
  const paneImpact = document.getElementById('page-pane-impact');
  const paneTestimonials = document.getElementById('page-pane-testimonials');

  if (tabName === 'impact') {
    if (impactTabHead) impactTabHead.className = 'impact-tab-head active-purple';
    if (testimonialsTabHead) testimonialsTabHead.className = 'impact-tab-head inactive-teal';
    if (paneImpact) paneImpact.classList.add('active');
    if (paneTestimonials) paneTestimonials.classList.remove('active');
  } else if (tabName === 'testimonials') {
    if (testimonialsTabHead) testimonialsTabHead.className = 'impact-tab-head active-teal';
    if (impactTabHead) impactTabHead.className = 'impact-tab-head inactive-purple';
    if (paneTestimonials) paneTestimonials.classList.add('active');
    if (paneImpact) paneImpact.classList.remove('active');
  }
}

/* ==========================================================================
   ANIMATED STAT COUNTERS (Intersection Observer)
   ========================================================================== */

function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number, .impact-percent');

  const observerOptions = {
    threshold: 0.4
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.getAttribute('data-target'), 10);
        const isPercent = el.classList.contains('impact-percent');

        if (!isNaN(targetValue) && !el.classList.contains('counted')) {
          el.classList.add('counted');
          animateValue(el, 0, targetValue, 1800, isPercent);
        }
        observerInstance.unobserve(el);
      }
    });
  }, observerOptions);

  statNumbers.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration, isPercent) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentValue = Math.floor(easeProgress * (end - start) + start);

    element.textContent = isPercent ? `${currentValue}%` : currentValue;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = isPercent ? `${end}%` : end;
    }
  };
  window.requestAnimationFrame(step);
}

/* ==========================================================================
   MODAL CONTROLLER
   ========================================================================== */

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

/* Donation Tier Selector */
function selectTier(btnElement, amount) {
  const tierButtons = document.querySelectorAll('.tier-btn');
  tierButtons.forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

  const customInput = document.getElementById('custom-amount');
  if (customInput) {
    customInput.value = amount;
  }
}

/* Form Submissions */
function handleDonateSubmit(event) {
  event.preventDefault();
  const amountInput = document.getElementById('custom-amount');
  const nameInput = document.getElementById('donor-name');
  
  const amount = amountInput.value || 25;
  const name = nameInput.value;

  closeModal('donate-modal');
  showToast(`Thank you ${name}! Your contribution of $${amount} empowers lives.`);
  event.target.reset();
}

function handleYouthSubmit(event) {
  event.preventDefault();
  const nameInput = document.getElementById('youth-name');
  const name = nameInput.value;

  closeModal('youth-modal');
  showToast(`Welcome ${name}! Youth enrollment application submitted successfully.`);
  event.target.reset();
}

function handleAdultSubmit(event) {
  event.preventDefault();
  const nameInput = document.getElementById('adult-name');
  const name = nameInput.value;

  closeModal('adult-modal');
  showToast(`Thank you ${name}! Your adult registration has been submitted.`);
  event.target.reset();
}

function handleReferralSubmit(event) {
  event.preventDefault();
  const agencyInput = document.getElementById('agency-name');
  const clientInput = document.getElementById('client-name');

  closeModal('referral-modal');
  showToast(`Referral received from ${agencyInput.value} for ${clientInput.value}.`);
  event.target.reset();
}

function handleContactSubmit(event) {
  event.preventDefault();
  const nameInput = document.getElementById('contact-name');

  showToast(`Thank you ${nameInput.value}! Your message has been sent to our team.`);
  event.target.reset();
}

/* ==========================================================================
   TOAST NOTIFICATION SYSTEM
   ========================================================================== */

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

/* ==========================================================================
   TESTIMONIAL CAROUSEL CONTROLLER
   ========================================================================== */

const testimonialsData = [
  {
    quote: `"NxtChapter gave me purpose. It helped me see the power of positive change—not just in others, but in myself. It’s taught me to believe in my people and reminded me that anything is possible."`,
    author: "Don F."
  },
  {
    quote: `"I attended a job fair hosted by NxtChapter six months ago and found stable employment through one of their partners. Now, I’ve come full circle—returning to support the youth at another job fair from the other side of the table. I’m incredibly grateful for the opportunity and proud to give back."`,
    author: "Daphne"
  },
  {
    quote: `"NxtChapter showed me how to believe in myself and gave me the tools to move forward. Their support helped me get back on my feet and stay focused on my goals."`,
    author: "Marcus L."
  },
  {
    quote: `"The mentoring and resources I received changed my outlook. Being part of NxtChapter made me realize I’m not alone, and it’s possible to create a better future."`,
    author: "Jasmine R."
  }
];

let currentTestimonialIndex = 0;

function updateTestimonialUI() {
  const quoteEl = document.getElementById('testimonial-quote');
  const authorEl = document.getElementById('testimonial-author');
  const dots = document.querySelectorAll('.testimonial-dots-bar .dot-btn');

  if (quoteEl && authorEl) {
    quoteEl.style.opacity = '0';
    authorEl.style.opacity = '0';

    setTimeout(() => {
      quoteEl.textContent = testimonialsData[currentTestimonialIndex].quote;
      authorEl.textContent = testimonialsData[currentTestimonialIndex].author;
      quoteEl.style.opacity = '1';
      authorEl.style.opacity = '1';
    }, 150);
  }

  if (dots) {
    dots.forEach((dot, index) => {
      if (index === currentTestimonialIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

function nextTestimonial(direction) {
  currentTestimonialIndex = (currentTestimonialIndex + direction + testimonialsData.length) % testimonialsData.length;
  updateTestimonialUI();
}

function setTestimonial(index) {
  if (index >= 0 && index < testimonialsData.length) {
    currentTestimonialIndex = index;
    updateTestimonialUI();
  }
}

/* ==========================================================================
   5-TAB NEWS & EVENTS PAGE CONTROLLER
   ========================================================================== */

function switchNewsTab(tabName) {
  const tabs = ['news', 'events', 'blog', 'newsletter', 'impact'];
  
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const pane = document.getElementById(`news-pane-${t}`);

    if (t === tabName) {
      if (btn) btn.classList.add('active');
      if (pane) pane.classList.add('active');
    } else {
      if (btn) btn.classList.remove('active');
      if (pane) pane.classList.remove('active');
    }
  });
}

/* LIVE COUNTDOWN TIMER FOR EVENTS TAB */
function startEventCountdown() {
  const targetDate = new Date('2025-07-22T09:00:00').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = Math.max(0, targetDate - now);

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMinutes = document.getElementById('cd-minutes');
    const cdSeconds = document.getElementById('cd-seconds');

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  startEventCountdown();
});

/* SEARCH & NEWSLETTER FORM HANDLERS */
function handleNewsSearch() {
  const searchInput = document.getElementById('news-search-field');
  if (searchInput && searchInput.value.trim() !== '') {
    showToast(`Searching news archive for: "${searchInput.value.trim()}"`);
  }
}

function filterNewsSearch(event) {
  if (event.key === 'Enter') {
    handleNewsSearch();
  }
}

function handleNewsletterPaneSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById('pane-newsletter-email');
  if (emailInput && emailInput.value) {
    showToast(`Thank you for subscribing to The NxtChapter Dispatch (${emailInput.value})!`);
    event.target.reset();
  }
}

function handleInsightPilotSubmit(event) {
  event.preventDefault();
  const fname = document.getElementById('insight-fname')?.value;
  const email = document.getElementById('insight-email')?.value;
  if (fname && email) {
    showToast(`Thank you, ${fname}! Your INSiGHT pilot site application has been submitted.`);
    event.target.reset();
  }
}

function handleContactPageSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-page-name')?.value;
  const email = document.getElementById('contact-page-email')?.value;
  if (name && email) {
    showToast(`Thank you, ${name}! Your message has been sent to NxtChapter. (Expected Response: 3-5 business days)`);
    event.target.reset();
  }
}
