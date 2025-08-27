// Theme management with system preference detection
class ThemeManager {
  constructor() {
    this.init();
  }

  init() {
    // Check for saved theme or default to system preference
    const savedTheme = this.getStoredTheme();
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    this.setTheme(initialTheme);
    this.updateToggleIcon();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.setTheme(e.matches ? 'dark' : 'light');
        this.updateToggleIcon();
      }
    });
  }

  getStoredTheme() {
    return window.localStorage ? localStorage.getItem('theme') : null;
  }

  setTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    if (window.localStorage) {
      localStorage.setItem('theme', theme);
    }
  }

  toggle() {
    const isDark = document.body.classList.contains('dark');
    this.setTheme(isDark ? 'light' : 'dark');
    this.updateToggleIcon();
  }

  updateToggleIcon() {
    const toggleBtn = document.getElementById('mode-toggle');
    const isDark = document.body.classList.contains('dark');
    const icon = toggleBtn.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Projects Data with enhanced information
const projects = [
  {
    title: "Smart Irrigation System",
    description: "An intelligent IoT-based system that monitors soil moisture, weather conditions, and automatically waters plants. Features real-time data visualization, mobile app control, and cloud integration for remote monitoring.",
    technologies: ["NodeMCU", "React", "Firebase", "Sensors"],
    link: "https://github.com/yourusername/smart-irrigation",
    status: "Live",
    icon: "fas fa-seedling"
  },
  {
    title: "Portfolio Website",
    description: "A modern, responsive personal portfolio built with vanilla JavaScript and advanced CSS. Features dark/light mode, smooth animations, and an interactive design system.",
    technologies: ["HTML5", "CSS3", "JavaScript", "GSAP"],
    link: "#",
    status: "Active",
    icon: "fas fa-globe"
  },
  {
    title: "Autonomous Robot",
    description: "Advanced line-following robot with computer vision capabilities. Implements object detection, path planning, and real-time decision making using OpenCV and machine learning algorithms.",
    technologies: ["Python", "OpenCV", "Raspberry Pi", "TensorFlow"],
    link: "#",
    status: "Beta",
    icon: "fas fa-robot"
  }
];

// Enhanced achievements data
const achievements = [
  {
    category: "Academics",
    icon: "fas fa-graduation-cap",
    items: [
      "Top 5% in National Math Olympiad 2024",
      "Distinction in Physics Research Challenge",
      "Dean's List for 3 consecutive semesters",
      "Best Final Year Project Award"
    ]
  },
  {
    category: "Robotics",
    icon: "fas fa-robot",
    items: [
      "1st Place – RoboCup Junior 2024",
      "Built autonomous line-following robot using OpenMV",
      "Best Design Award in University Robotics Competition",
      "Published research on swarm robotics"
    ]
  },
  {
    category: "Development",
    icon: "fas fa-code",
    items: [
      "Published NPM package with 10k+ downloads",
      "Open source contributor to 5+ projects",
      "Hackathon winner at CodeForGood 2023",
      "Mentored 15+ junior developers"
    ]
  }
];

// Particle system for background animation
class ParticleSystem {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.setup();
  }

  setup() {
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.opacity = '0.6';
    
    document.querySelector('.particles').appendChild(this.canvas);
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const isDark = document.body.classList.contains('dark');
    const primaryColor = isDark ? '102, 170, 255' : '0, 119, 255';
    const accentColor = isDark ? '0, 212, 170' : '0, 212, 170';
    
    this.particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
      
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      
      const color = index % 2 === 0 ? primaryColor : accentColor;
      gradient.addColorStop(0, `rgba(${color}, ${particle.opacity})`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Connect nearby particles
      this.particles.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );
          
          if (distance < 100) {
            this.ctx.strokeStyle = `rgba(${primaryColor}, ${0.1 * (1 - distance / 100)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(otherParticle.x, otherParticle.y);
            this.ctx.stroke();
          }
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Scroll progress indicator
class ScrollProgress {
  constructor() {
    this.createIndicator();
    this.updateProgress();
    window.addEventListener('scroll', () => this.updateProgress());
  }

  createIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.innerHTML = '<div class="scroll-progress"></div>';
    document.body.appendChild(indicator);
    this.progressBar = indicator.querySelector('.scroll-progress');
  }

  updateProgress() {
    const scrolled = window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxScroll) * 100;
    this.progressBar.style.width = `${Math.min(progress, 100)}%`;
  }
}

// Enhanced project rendering
function renderProjects() {
  const projectList = document.getElementById("project-list");
  
  projects.forEach((project, index) => {
    const projectItem = document.createElement("div");
    projectItem.className = "project-item fade-init loading";
    projectItem.style.animationDelay = `${index * 0.1}s`;
    
    const techTags = project.technologies.map(tech => 
      `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    projectItem.innerHTML = `
      <div class="project-header">
        <div class="project-icon">
          <i class="${project.icon}"></i>
        </div>
        <div class="project-status ${project.status.toLowerCase()}">
          ${project.status}
        </div>
      </div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-tech">
        ${techTags}
      </div>
      <div class="project-footer">
        <a href="${project.link}" target="_blank" class="project-link">
          <span>View Project</span>
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    `;
    
    projectList.appendChild(projectItem);
    
    // Trigger animation after a brief delay
    setTimeout(() => {
      projectItem.classList.remove('loading');
    }, 100 + index * 100);
  });
}

// Enhanced achievement rendering
function renderAchievements() {
  const achievementList = document.getElementById("achievement-list");
  
  achievements.forEach((achievement, index) => {
    const achievementCategory = document.createElement("div");
    achievementCategory.className = "achievement-category fade-init loading";
    achievementCategory.style.animationDelay = `${index * 0.2}s`;
    
    const itemsList = achievement.items.map(item => 
      `<li>${item}</li>`
    ).join("");
    
    achievementCategory.innerHTML = `
      <div class="achievement-header">
        <i class="${achievement.icon}"></i>
        <h3>${achievement.category}</h3>
      </div>
      <ul>${itemsList}</ul>
    `;
    
    achievementList.appendChild(achievementCategory);
    
    // Trigger animation
    setTimeout(() => {
      achievementCategory.classList.remove('loading');
    }, 100 + index * 200);
  });
}

// Enhanced smooth scrolling with easing
function initSmoothScroll() {
  document.querySelectorAll('.nav-center a, .logo, .btn-primary, .footer-links a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = 80;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu
          const navLinks = document.getElementById('nav-links');
          const hamburger = document.getElementById('hamburger');
          navLinks.classList.remove('show');
          hamburger.classList.remove('active');
        }
      }
    });
  });
}

// Enhanced intersection observer with stagger animation
class AnimationController {
  constructor() {
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.initObserver();
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('fade-in');
        }, delay);
        this.observer.unobserve(entry.target);
      }
    });
  }

  initObserver() {
    document.querySelectorAll('.fade-init').forEach((el, index) => {
      el.dataset.delay = index * 100;
      this.observer.observe(el);
    });
  }
}

// Mobile menu enhancement
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("show");
    document.body.style.overflow = navLinks.classList.contains('show') ? 'hidden' : '';
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.hamburger')) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("show");
      document.body.style.overflow = '';
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('show')) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("show");
      document.body.style.overflow = '';
    }
  });
}

// Contact form enhancement
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual implementation)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show success state
    submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #06d6a0)';
    
    // Reset form
    form.reset();
    
    // Reset button after 3 seconds
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }, 3000);
  });

  // Enhanced form interactions
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  });
}

// Parallax scrolling effect
function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      heroVisual.style.transform = `translateY(${rate * 0.3}px)`;
    }
    
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
      const rate = (index + 1) * 0.1;
      el.style.transform = `translateY(${scrolled * rate}px)`;
    });
  });
}

// Mouse tracking for interactive elements
function initMouseTracking() {
  const projectItems = document.querySelectorAll('.project-item');
  
  projectItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
}

// Typing animation for hero subtitle
function initTypingAnimation() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;
  
  const text = subtitle.textContent;
  subtitle.textContent = '';
  subtitle.style.borderRight = '2px solid var(--primary)';
  
  let index = 0;
  const speed = 50;
  
  function typeWriter() {
    if (index < text.length) {
      subtitle.textContent += text.charAt(index);
      index++;
      setTimeout(typeWriter, speed);
    } else {
      // Remove cursor after typing is complete
      setTimeout(() => {
        subtitle.style.borderRight = 'none';
      }, 1000);
    }
  }
  
  // Start typing animation after page loads
  setTimeout(typeWriter, 1000);
}

// Dynamic counter animation for stats
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });
  
  statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
  const target = parseInt(element.textContent);
  const duration = 2000;
  const start = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * easedProgress);
    
    element.textContent = current + (element.textContent.includes('+') ? '+' : '');
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Enhanced project card interactions
function enhanceProjectCards() {
  const projectItems = document.querySelectorAll('.project-item');
  
  projectItems.forEach(item => {
    const header = item.querySelector('.project-header');
    const icon = item.querySelector('.project-icon i');
    
    item.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.2) rotate(5deg)';
      icon.style.color = 'var(--accent)';
    });
    
    item.addEventListener('mouseleave', () => {
      icon.style.transform = '';
      icon.style.color = '';
    });
  });
}

// Lazy loading for performance
function initLazyLoading() {
  const lazyElements = document.querySelectorAll('[data-lazy]');
  
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.classList.add('loaded');
        lazyObserver.unobserve(element);
      }
    });
  });
  
  lazyElements.forEach(el => lazyObserver.observe(el));
}

// Keyboard navigation support
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case '1':
          e.preventDefault();
          document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
          break;
        case '2':
          e.preventDefault();
          document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
          break;
        case '3':
          e.preventDefault();
          document.querySelector('#achievements').scrollIntoView({ behavior: 'smooth' });
          break;
        case '4':
          e.preventDefault();
          document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
          break;
      }
    }
  });
}

// Performance monitoring
function initPerformanceMonitoring() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Page loaded in ${Math.round(loadTime)}ms`);
      
      // Add performance badge in development
      if (window.location.hostname === 'localhost') {
        const badge = document.createElement('div');
        badge.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: var(--primary);
          color: white;
          padding: 0.5rem;
          border-radius: 8px;
          font-size: 0.8rem;
          z-index: 1000;
        `;
        badge.textContent = `${Math.round(loadTime)}ms`;
        document.body.appendChild(badge);
      }
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  renderProjects();
  renderAchievements();
  initSmoothScroll();
  initMobileMenu();
  initContactForm();
  
  // Enhanced features
  new ParticleSystem();
  new ScrollProgress();
  new AnimationController();
  
  // Interactive features
  initParallax();
  initMouseTracking();
  initTypingAnimation();
  initCounterAnimation();
  initKeyboardNavigation();
  initPerformanceMonitoring();
  
  // Theme toggle
  const modeToggle = document.getElementById('mode-toggle');
  modeToggle.addEventListener('click', () => {
    themeManager.toggle();
  });
  
  // Enhanced project cards after rendering
  setTimeout(enhanceProjectCards, 500);
});

// Window resize handler for responsive adjustments
window.addEventListener('resize', () => {
  // Recalculate particle system if needed
  if (window.innerWidth < 768) {
    document.querySelectorAll('.floating-element').forEach(el => {
      el.style.display = 'none';
    });
  } else {
    document.querySelectorAll('.floating-element').forEach(el => {
      el.style.display = 'flex';
    });
  }
});

// Add loading class to body initially
document.body.classList.add('loading');

// Remove loading class after everything is initialized
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.remove('loading');
  }, 500);
});