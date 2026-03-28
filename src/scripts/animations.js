import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {

  // Nav entrance
  gsap.from("nav", { y: -80, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.1 });

  // Hero word stagger
  gsap.from(".hero-word", {
    y: 70, opacity: 0, duration: 0.9,
    stagger: 0.07, ease: "power4.out", delay: 0.3
  });

  // Hero supporting elements
  gsap.from(".hero-tagline", { opacity: 0, y: 20, duration: 0.7, delay: 0.9,  ease: "power2.out" });
  gsap.from(".hero-body",    { opacity: 0, y: 20, duration: 0.7, delay: 1.1,  ease: "power2.out" });
  gsap.from(".hero-ctas",   { opacity: 0, y: 20, duration: 0.7, delay: 1.3,  ease: "power2.out" });

  // Section headings
  gsap.utils.toArray("h1, h2, .section-label").forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
      y: 20, opacity: 0, duration: 0.5, ease: "power2.out"
    });
  });

  // Project cards
  gsap.utils.toArray(".project-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" },
      y: 30, opacity: 0, duration: 0.5, delay: i * 0.1, ease: "power2.out"
    });
  });

  // Timeline entries
  gsap.utils.toArray(".timeline-entry").forEach(entry => {
    gsap.from(entry, {
      scrollTrigger: { trigger: entry, start: "top 90%", toggleActions: "play none none none" },
      x: -20, opacity: 0, duration: 0.5, ease: "power2.out"
    });
  });

  // Post rows
  gsap.utils.toArray(".post-row").forEach((row, i) => {
    gsap.from(row, {
      scrollTrigger: { trigger: row, start: "top 92%", toggleActions: "play none none none" },
      x: -10, opacity: 0, duration: 0.4, delay: i * 0.05, ease: "power2.out"
    });
  });

  // Skills matrix rows
  gsap.utils.toArray(".skills-row").forEach((row, i) => {
    gsap.from(row, {
      scrollTrigger: { trigger: row, start: "top 90%", toggleActions: "play none none none" },
      x: -10, opacity: 0, duration: 0.4, delay: i * 0.08, ease: "power2.out"
    });
  });

  // Marquee (just fade in)
  gsap.from(".marquee-track", {
    scrollTrigger: { trigger: ".marquee-track", start: "top 95%", toggleActions: "play none none none" },
    y: 20, opacity: 0, duration: 0.6, ease: "power2.out"
  });

  // Section containers fade in
  gsap.utils.toArray("section").forEach(section => {
    gsap.from(section, {
      scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none none" },
      y: 15, opacity: 0, duration: 0.5, ease: "power2.out"
    });
  });

}
