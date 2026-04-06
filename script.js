document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // AI Particle Canvas (WebGL/Node aesthetic)
    const canvas = document.createElement('canvas');
    canvas.id = 'ai-particles-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 100;
    
    const mouse = { x: null, y: null, radius: 180 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Handle resizing
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.speedY = Math.random() * 0.8 - 0.4;
            this.baseColor = "rgba(56, 189, 248,"; // Tailwind Sky 400
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
            if (this.y > height) this.y = 0;
            if (this.y < 0) this.y = height;
            
            // Mouse Interaction: Magnetic Repulsion / Glow
            if (mouse.x && mouse.y) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    this.x -= dx * 0.03;
                    this.y -= dy * 0.03;
                }
            }
        }
        draw() {
            ctx.fillStyle = this.baseColor + " 0.8)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = dx * dx + dy * dy;
                
                if (distance < 18000) {
                    opacityValue = 1 - (distance / 18000);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${opacityValue * 0.3})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ----------------------------------------
    // HIGH-END GSAP ANIMATIONS
    // ----------------------------------------

    // Navbar Entry
    gsap.from("nav", { y: -50, opacity: 0, duration: 1.5, ease: "power4.out" });

    // Hero Section
    const heroTl = gsap.timeline();
    heroTl.from(".hero-text-content > span", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 })
          .from(".hero-text-content > h1", { y: 50, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.4")
          .from(".hero-text-content > p", { y: 30, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }, "-=0.6")
          .from(".hero-buttons", { scale: 0.9, opacity: 0, duration: 0.8, ease: "expo.out" }, "-=0.4")
          .from(".hero-img-container", { scale: 0.8, opacity: 0, rotationY: 25, duration: 1.5, ease: "power4.out" }, "-=1");

    // Sections
    const revealSections = gsap.utils.toArray('section h2, .about-grid-item, .exp-item, .project-card');
    revealSections.forEach((el) => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            y: 60, opacity: 0, duration: 1, ease: "power3.out"
        });
    });

    // Footer Parallax
    gsap.from("footer", { scrollTrigger: { trigger: "footer", start: "top bottom" }, y: 50, opacity: 0, duration: 1.5, ease: "power3.out" });

    // Magnetic Buttons (Premium UX Logic)
    const magneticBtns = document.querySelectorAll('.btn-futuristic');
    magneticBtns.forEach((btn) => {
        btn.addEventListener('mousemove', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: "power2.out" });
        });
        btn.addEventListener('mouseleave', function() {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
        });
    });

    // Link Smooth Scroll Hook
    // Mobile menu toggle logic
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if(menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
});


// -----------------------------
// MOBILE MENU TOGGLE LOGIC
// -----------------------------
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const menuIcon = menuBtn ? menuBtn.querySelector('span') : null;

if(menuBtn && mobileMenu) {
  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    if(isMenuOpen) {
      mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
      mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
      if(menuIcon) menuIcon.innerText = 'close';
      document.body.style.overflow = 'hidden'; // prevent bg scroll
    } else {
      mobileMenu.classList.add('opacity-0', 'pointer-events-none');
      mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
      if(menuIcon) menuIcon.innerText = 'menu';
      document.body.style.overflow = '';
    }
  };

  menuBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if(isMenuOpen) toggleMenu();
    });
  });
}
