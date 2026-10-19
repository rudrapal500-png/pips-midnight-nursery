import { useState, useRef, useCallback } from 'react';
import pipImgTransparent from '../../assets/pip-transparent.png';
import pipImgOriginal from '../../assets/pip.jpg';
import './PipCharacter.css';

const PIP_QUOTES = [
  "Did you hear that? I think a dream just giggled!",
  "Shh... the star bunnies are almost asleep in the cloud drawer!",
  "I'm mixing lavender honey and warm moonlight for tonight's lullaby!",
  "Careful, don't drop the nightlight sparkles! They tickle.",
  "I build the dreams you fall asleep inside. What dream should we make tonight?"
];

/**
 * Play a gentle, soothing bedtime chime using the browser's native Web Audio API.
 * Soft sine wave harmony, completely self-contained with no external dependencies.
 */
function playBedtimeChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    // Two gentle chime notes: E5 (659.25Hz) and B5 (987.77Hz)
    [659.25, 987.77].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.85);
    });
  } catch {
    // Non-fatal if audio context is blocked
  }
}

export default function PipCharacter() {
  const [imgSrc, setImgSrc] = useState(pipImgTransparent);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isBubbleOpen, setIsBubbleOpen] = useState(false);
  const [isGiggling, setIsGiggling] = useState(false);
  
  // Parallax tilt angles
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const containerRef = useRef(null);

  // Mouse move handler for subtle parallax reaction
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle tilt: max ~7 degrees
    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = -((y - centerY) / centerY) * 7;

    setTilt({
      rotateX: Math.round(rotateX * 10) / 10,
      rotateY: Math.round(rotateY * 10) / 10,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  // Character click handler
  const handlePipClick = () => {
    playBedtimeChime();
    setIsGiggling(true);
    setTimeout(() => setIsGiggling(false), 700);

    if (isBubbleOpen) {
      // Cycle to the next quote
      setQuoteIndex((prev) => (prev + 1) % PIP_QUOTES.length);
    } else {
      setIsBubbleOpen(true);
    }
  };

  const handleDismissBubble = (e) => {
    e.stopPropagation();
    setIsBubbleOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePipClick();
    } else if (e.key === 'Escape' && isBubbleOpen) {
      setIsBubbleOpen(false);
    }
  };

  // Graceful fallback if transparent png fails to load
  const handleImgError = () => {
    if (imgSrc !== pipImgOriginal) {
      setImgSrc(pipImgOriginal);
    }
  };

  return (
    <div
      ref={containerRef}
      className="pip-visual-stage"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Soft lavender-pink ambient glow behind Pip */}
      <div className="pip-glow-pulse pip-glow-outer" />
      <div className="pip-glow-pulse pip-glow-inner" />

      {/* Floating Sparkles & Dream Stars around Pip */}
      <div className="pip-orbiting-star star-pos-1">✦</div>
      <div className="pip-orbiting-star star-pos-2">★</div>
      <div className="pip-orbiting-star star-pos-3">✦</div>
      <div className="pip-orbiting-star star-pos-4">★</div>
      <div className="pip-orbiting-star star-pos-5">✦</div>

      {/* Interactive Speech Bubble */}
      {isBubbleOpen && (
        <div
          className="pip-speech-bubble"
          role="status"
          aria-live="polite"
        >
          <div className="bubble-header">
            <span className="bubble-pip-badge">✦ Pip whispers:</span>
            <button
              type="button"
              className="bubble-close-btn"
              onClick={handleDismissBubble}
              aria-label="Dismiss dream whisper"
              title="Close whisper"
            >
              ✕
            </button>
          </div>
          <p className="bubble-text">“{PIP_QUOTES[quoteIndex]}”</p>
          <span className="bubble-hint">Click Pip again for another dream whisper! ✦</span>
          <div className="bubble-tail" />
        </div>
      )}

      {/* Interactive Pip Character Button & Image */}
      <div
        className={`pip-character-container ${isGiggling ? 'pip-giggling' : ''}`}
        style={{
          transform: `perspective(900px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        }}
      >
        <button
          type="button"
          className="pip-interactive-button"
          onClick={handlePipClick}
          onKeyDown={handleKeyDown}
          aria-label="Pip, Junior Dream Engineer. Click to hear a dream whisper!"
          title="Click to talk with Pip!"
        >
          {/* Main Canonical Artwork */}
          <img
            src={imgSrc}
            alt="Pip, Junior Dream Engineer sitting on a cloud with a glowing lantern and unicorn music box"
            className="pip-character-image"
            onError={handleImgError}
            draggable="false"
          />

          {/* Adorable glowing eyes highlight overlay */}
          <div className="pip-eye-glow eye-left" />
          <div className="pip-eye-glow eye-right" />

          {/* Cozy lantern warm pulse */}
          <div className="pip-lantern-glow" />

          {/* Interactive Tap Hint Pill */}
          <div className="pip-interactive-hint">
            <span className="hint-star">✦</span>
            <span>Tap Pip to say hi!</span>
          </div>
        </button>
      </div>

      {/* Soft Cloud Base Shadow / Floating Cushion */}
      <div className="pip-cloud-shadow" />
    </div>
  );
}
