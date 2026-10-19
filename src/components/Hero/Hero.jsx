import DreamCanvas3D from './DreamCanvas3D';
import PipCharacter from './PipCharacter';
import './Hero.css';

/**
 * Section 1: Hero — Pip · Junior Dream Engineer
 * Opening cinematic hero section for Midnight Nursery.
 */
export default function Hero() {
  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
      // Set focus to the section for keyboard accessibility
      elem.setAttribute('tabindex', '-1');
      elem.focus({ preventScroll: true });
    }
  };

  return (
    <header id="hero" className="hero-section" role="banner">
      {/* 3D Celestial Dream Canvas / CSS Fallback */}
      <DreamCanvas3D />

      {/* Hero Content Container */}
      <div className="hero-container">
        {/* Left Column: Editorial Typography & Call to Actions */}
        <div className="hero-text-content">
          {/* Eyebrow Label */}
          <div className="hero-eyebrow" aria-label="Welcome banner">
            <span className="eyebrow-sparkle" aria-hidden="true">✦</span>
            <span className="eyebrow-text">WELCOME TO THE MIDNIGHT NURSERY</span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-title">
            Pip
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Junior Dream Engineer
          </p>

          {/* Supporting Line */}
          <p className="hero-supporting">
            Designing dreams, lullabies, nightlights, and bedtime stories for the neighbourhood’s little ghosts and creatures.
          </p>

          {/* Exact Tagline Callout */}
          <blockquote className="hero-tagline">
            <span className="tagline-star" aria-hidden="true">✦</span>
            <span className="tagline-quote">“I build the dreams you fall asleep inside.”</span>
            <span className="tagline-star" aria-hidden="true">✦</span>
          </blockquote>

          {/* Action Buttons */}
          <div className="hero-actions">
            <a
              href="#dream-lab"
              className="btn btn-primary"
              onClick={(e) => handleScrollTo(e, 'dream-lab')}
              aria-label="Explore the Dream Lab projects"
            >
              <span>Explore the Dream Lab</span>
              <svg
                className="btn-icon"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4.16669 10H15.8334M15.8334 10L10.8334 5M15.8334 10L10.8334 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a
              href="#meet-pip"
              className="btn btn-secondary"
              onClick={(e) => handleScrollTo(e, 'meet-pip')}
              aria-label="Meet Pip and learn Pip's story"
            >
              <svg
                className="btn-icon-sparkle"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M10 2L11.8 7.2L17 9L11.8 10.8L10 16L8.2 10.8L3 9L8.2 7.2L10 2Z"
                  fill="currentColor"
                />
              </svg>
              <span>Meet Pip</span>
            </a>
          </div>
        </div>

        {/* Right Column: Pip Character Visual & 3D Interactive Aura */}
        <div className="hero-character-col" aria-label="Interactive character display">
          <PipCharacter />
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <a
        href="#meet-pip"
        className="scroll-indicator"
        onClick={(e) => handleScrollTo(e, 'meet-pip')}
        aria-label="Scroll down to explore Pip's nursery"
      >
        <span className="scroll-label">SCROLL TO EXPLORE</span>
        <div className="scroll-beacon" aria-hidden="true">
          <span className="beacon-dot" />
          <svg
            className="scroll-arrow"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 10L12 15L17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </a>
    </header>
  );
}
