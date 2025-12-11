
// Vanilla JS adaptation of React Bits BubbleMenu for Inspiration Beauty & Spa
// Uses the existing .menu-toggle button to open a full-screen pill menu.

function initBubbleMenu() {
  const overlay = document.getElementById('bubbleMenuOverlay');
  const menuButton = document.querySelector('.menu-toggle');
  if (!overlay || !menuButton || typeof gsap === 'undefined') return;

  const bubbles = Array.from(overlay.querySelectorAll('.pill-link'));
  const labels = Array.from(overlay.querySelectorAll('.pill-label'));

  let isMenuOpen = false;
  let showOverlay = false;

  function openMenu() {
    if (isMenuOpen) return;
    isMenuOpen = true;
    showOverlay = true;

    overlay.setAttribute('aria-hidden', 'false');
    gsap.set(overlay, { display: 'flex' });

    gsap.killTweensOf([...bubbles, ...labels]);
    gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
    gsap.set(labels, { y: 24, autoAlpha: 0 });

    bubbles.forEach((bubble, i) => {
      const delay = i * 0.12 + gsap.utils.random(-0.05, 0.05);
      const tl = gsap.timeline({ delay });
      tl.to(bubble, {
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.5)'
      });
      if (labels[i]) {
        tl.to(
          labels[i],
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            ease: 'power3.out'
          },
          '-=0.45'
        );
      }
    });

    document.documentElement.classList.add('bubble-menu-open');
  }

  function closeMenu() {
    if (!isMenuOpen) return;
    isMenuOpen = false;
    overlay.setAttribute('aria-hidden', 'true');

    if (!showOverlay) return;

    gsap.killTweensOf([...bubbles, ...labels]);
    gsap.to(labels, {
      y: 24,
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power3.in'
    });
    gsap.to(bubbles, {
      scale: 0,
      duration: 0.2,
      ease: 'power3.in',
      onComplete: () => {
        gsap.set(overlay, { display: 'none' });
        showOverlay = false;
        document.documentElement.classList.remove('bubble-menu-open');
      }
    });
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Hook onto existing menu button
  menuButton.addEventListener('click', (e) => {
    // Let existing topbar JS run (for class .is-open), but also control bubble overlay
    toggleMenu();
  });

  // Close menu when clicking a pill
  bubbles.forEach((bubble) => {
    bubble.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Optional: close with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initBubbleMenu();
} else {
  document.addEventListener('DOMContentLoaded', initBubbleMenu);
}
