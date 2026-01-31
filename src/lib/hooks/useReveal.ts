"use client";

import { useEffect } from "react";

/**
 * Custom hook to enable reveal-on-scroll animations.
 * Finds all elements with the 'reveal' class and adds 'reveal-visible' when they enter the viewport.
 */
export function useReveal() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          // Once visible, we could stop observing, but keeping it simple for now
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.disconnect());
    };
  }, []);
}
