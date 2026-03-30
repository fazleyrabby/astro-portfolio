import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

  // ── Hero word stagger ──────────────────────────────────────────────────────
  gsap.from('.hero-word', {
    y: 80, opacity: 0, duration: 0.9,
    stagger: 0.08, ease: 'power3.out', delay: 0.2,
  });

  // ── Decipher text effect on hero name ─────────────────────────────────────
  const decipherEl = document.querySelector('[data-decipher]');
  if (decipherEl) {
    const finalText = decipherEl.getAttribute('data-decipher');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>';
    const totalFrames = 25;
    const staggerFrames = 3; // frames between each letter locking in
    let frame = 0;

    // Start with scrambled text after the slide-up animation finishes
    const startDelay = 0.2 + 0.9 + 0.08; // hero-word delay + duration + stagger
    setTimeout(() => {
      decipherEl.style.fontVariantNumeric = 'tabular-nums';
      const interval = setInterval(() => {
        let result = '';
        for (let i = 0; i < finalText.length; i++) {
          if (finalText[i] === ' ') {
            result += ' ';
          } else if (frame >= i * staggerFrames + totalFrames) {
            result += finalText[i];
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        decipherEl.textContent = result;
        frame++;

        // All letters resolved
        if (frame >= (finalText.length - 1) * staggerFrames + totalFrames) {
          decipherEl.textContent = finalText;
          clearInterval(interval);
        }
      }, 30);
    }, startDelay * 1000);
  }

  // ── Section heading reveals ────────────────────────────────────────────────
  gsap.utils.toArray('.reveal-heading').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      y: 40, opacity: 0, duration: 0.7, ease: 'power2.out',
    });
  });

  // ── Editorial break phrases ────────────────────────────────────────────────
  gsap.utils.toArray('.editorial-phrase').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
      y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
    });
  });

  // ── Project cards stagger ──────────────────────────────────────────────────
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
      y: 50, opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'power2.out',
    });
  });

  // ── Timeline entries ───────────────────────────────────────────────────────
  gsap.utils.toArray('.timeline-entry').forEach(entry => {
    gsap.from(entry, {
      scrollTrigger: { trigger: entry, start: 'top 88%', toggleActions: 'play none none none' },
      x: -24, opacity: 0, duration: 0.6, ease: 'power2.out',
    });
    const dot = entry.querySelector('.timeline-dot');
    if (dot) gsap.from(dot, {
      scrollTrigger: { trigger: entry, start: 'top 88%' },
      scale: 0, duration: 0.4, ease: 'back.out(2)', delay: 0.15,
    });
  });

  // ── Blog post rows ─────────────────────────────────────────────────────────
  gsap.utils.toArray('.post-row').forEach((row, i) => {
    gsap.from(row, {
      scrollTrigger: { trigger: row, start: 'top 92%', toggleActions: 'play none none none' },
      y: 20, opacity: 0, duration: 0.45, delay: i * 0.06, ease: 'power1.out',
    });
  });

  // ── Marquee hover pause ────────────────────────────────────────────────────
  document.querySelectorAll('.marquee-track').forEach(track => {
    const inner = track.querySelector('.marquee-inner');
    if (!inner) return;
    track.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
  });

  // ── Magnetic buttons (desktop only) ───────────────────────────────────────
  if (!('ontouchstart' in window)) {
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.18;
        const y = (e.clientY - r.top  - r.height / 2) * 0.18;
        btn.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
      });
      btn.addEventListener('mouseleave', () => { 
        gsap.to(btn, {
          x: 0, y: 0, scale: 1,
          duration: 0.6, ease: 'elastic.out(1, 0.4)'
        });
      });
    });

    // ── Project card 3D tilt ─────────────────────────────────────────────────
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
      });
      card.addEventListener('mouseleave', () => { 
        gsap.to(card, {
          y: 0, rotateX: 0, rotateY: 0,
          duration: 0.6, ease: 'power2.out'
        });
      });
    });
  }

  // ── Active nav on scroll ───────────────────────────────────────────────────
  const navLinks = document.querySelectorAll('nav a[href^="#"], nav a[href*="/#"]');
  const sections = document.querySelectorAll('section[id]');
  
  if (sections.length > 0) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && (href === `#${entry.target.id}` || href.includes(`/#${entry.target.id}`))) {
            link.classList.add('nav-active');
          } else {
            link.classList.remove('nav-active');
          }
        });
      });
    }, { threshold: 0.45 });

    sections.forEach(section => observer.observe(section));
  }
}
