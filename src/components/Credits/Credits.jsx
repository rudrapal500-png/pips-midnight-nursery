import { useState, useRef, useEffect } from 'react';
import pipHeroImg from '../../assets/pip/pip-hero.png';
import pipFallbackImg from '../../assets/pip-transparent.png';
import './Credits.css';

/**
 * Gentle celestial stardust sparkle sound using Web Audio API.
 */
function playStardustChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    // Ascending arpeggio of stardust: E5, G#5, B5, E6
    [659.25, 830.61, 987.77, 1318.51].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.07 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.7);
    });
  } catch {
    // Non-fatal
  }
}

export default function Credits() {
  const [imgSrc, setImgSrc] = useState(pipHeroImg);
  const [isStardustActive, setIsStardustActive] = useState(false);
  const [stardustMessage, setStardustMessage] = useState('');
  const timeoutRef = useRef(null);

  const handleLeaveStardust = () => {
    if (isStardustActive) return;

    playStardustChime();
    setIsStardustActive(true);
    setStardustMessage('A little stardust for your next big dream. ✦');

    // Reset after natural completion (3 seconds)
    timeoutRef.current = setTimeout(() => {
      setIsStardustActive(false);
    }, 3200);
  };

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
      elem.setAttribute('tabindex', '-1');
      elem.focus({ preventScroll: true });
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer id="credits" className="credits-section" aria-label="Behind the Dreams & Credits">
      {/* Dreamy Twilight Horizon Backdrop */}
      <div className="credits-backdrop" aria-hidden="true">
        <div className="closing-moon-orb" />
        <div className="closing-twilight-gradient" />
        <div className="closing-stardust-trail" />
      </div>

      <div className="credits-container">
        {/* Storybook Farewell Card */}
        <section className="closing-farewell-card" aria-label="A Note from the Midnight Nursery">
          <div className="credits-eyebrow">
            <span className="eyebrow-star">✦</span>
            <span>A NOTE FROM THE MIDNIGHT NURSERY</span>
          </div>

          <h2 className="closing-title">Every dream begins somewhere.</h2>

          <p className="closing-supporting">
            Behind every tiny invention is a little curiosity, a little imagination, and a sprinkle of stardust.
          </p>

          <div className="closing-storybook-content">
            {/* Pip's Character Artwork Endpiece */}
            <div className="pip-endpiece-wrapper">
              <div className="pip-endpiece-glow" />
              <img
                src={imgSrc}
                alt="Pip resting peacefully on a cloud with a bedtime lantern and music box"
                className="pip-endpiece-img"
                onError={() => setImgSrc(pipFallbackImg)}
                draggable="false"
              />
            </div>

            {/* Heartfelt Note & Signature */}
            <div className="closing-letter-body">
              <blockquote className="closing-quote-text">
                “Thank you for visiting Pip&apos;s little corner of the universe. May your nights be gentle, your dreams be curious, and your imagination never run out of stars.”
              </blockquote>

              <div className="closing-signature">
                <span className="signature-line">With sleepy eyes &amp; stardust,</span>
                <span className="signature-name">Pip ✦</span>
              </div>

              {/* Optional Visitor Interaction: Leave a Little Stardust */}
              <div className="stardust-interaction-block">
                <button
                  type="button"
                  className={`btn-leave-stardust ${isStardustActive ? 'bursting' : ''}`}
                  onClick={handleLeaveStardust}
                  disabled={isStardustActive}
                  aria-label="Leave a little stardust in Pip's nursery"
                >
                  <span className="stardust-btn-icon">✨</span>
                  <span>{isStardustActive ? 'Stardust Sprinkled...' : 'Leave a Little Stardust'}</span>
                </button>

                {/* Stardust Burst Particles */}
                {isStardustActive && (
                  <div className="stardust-particles-burst" aria-hidden="true">
                    <span className="spark-particle spark-1">✦</span>
                    <span className="spark-particle spark-2">★</span>
                    <span className="spark-particle spark-3">✨</span>
                    <span className="spark-particle spark-4">✦</span>
                    <span className="spark-particle spark-5">★</span>
                    <span className="spark-particle spark-6">✨</span>
                  </div>
                )}

                {/* Stardust Notification */}
                {stardustMessage && (
                  <div className="stardust-message-badge" role="status" aria-live="polite">
                    <span>{stardustMessage}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Behind the Dreams Section */}
        <section className="behind-the-dreams-panel" aria-label="Behind the Dreams Concept Breakdown">
          <div className="panel-header">
            <span className="panel-badge-icon">🌙</span>
            <h3 className="panel-title">Behind the Dreams</h3>
          </div>

          <div className="behind-grid">
            {/* Item 1: Character */}
            <div className="behind-item">
              <span className="behind-tag">CHARACTER</span>
              <p className="behind-text">
                Pip — Junior Dream Engineer at the Midnight Nursery.
              </p>
            </div>

            {/* Item 2: The Dream Lab */}
            <div className="behind-item">
              <span className="behind-tag">THE DREAM LAB</span>
              <p className="behind-text">
                A collection of playful concepts: lullabies, glowing nightlights, and magical dream deliveries.
              </p>
            </div>

            {/* Item 3: The Experience */}
            <div className="behind-item">
              <span className="behind-tag">THE EXPERIENCE</span>
              <p className="behind-text">
                An interactive portfolio built to bring a little imaginary universe to life.
              </p>
            </div>
          </div>
        </section>

        {/* Honest Credits Section: "The Little Details" */}
        <section className="honest-credits-panel" aria-label="Official Credits and Dependencies">
          <div className="panel-header">
            <span className="panel-badge-icon">✦</span>
            <h3 className="panel-title">The Little Details</h3>
          </div>

          <div className="credits-details-grid">
            <div className="credit-entry">
              <h4 className="credit-heading">Character &amp; World Lore</h4>
              <p className="credit-desc">
                Pip, Junior Dream Engineer at the Midnight Nursery. Official character identity, story rules, and artwork assets provided for the hackathon challenge.
              </p>
            </div>

            <div className="credit-entry">
              <h4 className="credit-heading">3D Graphics &amp; Canvas</h4>
              <p className="credit-desc">
                Three.js (<code>three</code>), React Three Fiber (<code>@react-three/fiber</code>), and <code>@react-three/drei</code>. Lightweight geometries with pure CSS fallbacks optimized for integrated graphics.
              </p>
            </div>

            <div className="credit-entry">
              <h4 className="credit-heading">Frontend Architecture</h4>
              <p className="credit-desc">
                React 19 (<code>react</code>, <code>react-dom</code>) and Vite 8 (<code>vite</code>). Modular functional components with CSS-scoped layouts.
              </p>
            </div>

            <div className="credit-entry">
              <h4 className="credit-heading">Audio Engineering</h4>
              <p className="credit-desc">
                Procedurally synthesized celesta chimes, lullaby arpeggios, and star chimes generated directly via the browser&apos;s native Web Audio API (zero audio files needed).
              </p>
            </div>

            <div className="credit-entry">
              <h4 className="credit-heading">Typography &amp; Fonts</h4>
              <p className="credit-desc">
                Google Fonts: <em>Fredoka</em> and <em>Quicksand</em> for storybook headings; <em>Plus Jakarta Sans</em> for accessible UI typography.
              </p>
            </div>

            <div className="credit-entry">
              <h4 className="credit-heading">AI Collaboration Note</h4>
              <p className="credit-desc">
                In compliance with hackathon rules, code implementation, 3D component orchestration, and image asset feathering were assisted by Google Gemini / Antigravity AI coding assistant.
              </p>
            </div>
          </div>
        </section>

        {/* Final Navigation Bar */}
        <nav className="final-navigation-bar" aria-label="Section Navigation">
          <a
            href="#dream-lab"
            className="btn-nav-link"
            onClick={(e) => handleScrollTo(e, 'dream-lab')}
          >
            <span>Back to the Dream Lab</span>
            <span className="nav-arrow" aria-hidden="true">→</span>
          </a>

          <a
            href="#dream-room"
            className="btn-nav-link"
            onClick={(e) => handleScrollTo(e, 'dream-room')}
          >
            <span>Visit the Dream Room</span>
            <span className="nav-arrow" aria-hidden="true">→</span>
          </a>

          <a
            href="#hero"
            className="btn-nav-link btn-back-top"
            onClick={(e) => handleScrollTo(e, 'hero')}
          >
            <span>Back to the Beginning</span>
            <span className="nav-arrow" aria-hidden="true">↑</span>
          </a>
        </nav>

        {/* Small Whimsical Footer */}
        <div className="nursery-colophon">
          <div className="colophon-badge">
            <span className="colophon-moon">🌙</span>
            <span className="colophon-star">✦</span>
          </div>
          <p className="colophon-brand">
            <strong>Pip · Junior Dream Engineer</strong>
          </p>
          <p className="colophon-tagline">
            Dreamed up at the Midnight Nursery. © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
