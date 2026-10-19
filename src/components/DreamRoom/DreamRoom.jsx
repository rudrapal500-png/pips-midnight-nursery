import { useState } from 'react';
import DreamRoomCanvas3D from './DreamRoomCanvas3D';
import pipImg from '../../assets/pip-transparent.png';
import nightlightImg from '../../assets/projects/dream-nightlight.png';
import './DreamRoom.css';

const COLLECTIBLE_STARS = [
  { id: 1, top: '22%', left: '16%', size: 24, label: 'Star of Whispering Dreams' },
  { id: 2, top: '38%', left: '28%', size: 20, label: 'Star of Honeyed Lullabies' },
  { id: 3, top: '18%', right: '32%', size: 26, label: 'Star of Midnight Giggles' },
  { id: 4, top: '56%', left: '12%', size: 22, label: 'Star of Cloudberry Fluff' },
  { id: 5, top: '64%', right: '22%', size: 20, label: 'Star of Starlight Wishes' },
];

const STAR_CATCH_QUOTES = [
  "You caught a sleepy little star!",
  "Pip says this one tastes like moonlight. Probably.",
  "One tiny star, one very big dream.",
  "Careful! That star was about to sneeze.",
];

const MOODS = [
  {
    id: 'sleepy',
    label: 'Sleepy',
    icon: '💤',
    message: "Five more minutes... then I'll invent a dream.",
  },
  {
    id: 'curious',
    label: 'Curious',
    icon: '🔍',
    message: "Did that cloud just move? I need to investigate!",
  },
  {
    id: 'delighted',
    label: 'Delighted',
    icon: '✨',
    message: "A new star! A new dream! A NEW EVERYTHING!",
  },
];

/**
 * Gentle starlight chime synthesizer via Web Audio API.
 */
function playStarChime(freq = 880) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  } catch {
    // Non-fatal
  }
}

export default function DreamRoom() {
  const [isDay, setIsDay] = useState(false);
  const [collectedStarIds, setCollectedStarIds] = useState([]);
  const [isSecretStarFound, setIsSecretStarFound] = useState(false);
  const [selectedMood, setSelectedMood] = useState(MOODS[1]); // Default to Curious
  const [pipSpeech, setPipSpeech] = useState(
    "Welcome to my Dream Room! Catch the floating stars or toggle day & night!"
  );
  const [speechAnimationKey, setSpeechAnimationKey] = useState(0);

  // Day/Night Toggle
  const handleToggleDayNight = () => {
    const nextDay = !isDay;
    setIsDay(nextDay);
    playStarChime(nextDay ? 987 : 659);
    setPipSpeech(
      nextDay
        ? "Morning light! Time to air out the cloud pillows and bottle dawn sparkles."
        : "Midnight is back! The nursery is cozy and the dream laboratory is humming."
    );
    setSpeechAnimationKey((k) => k + 1);
  };

  // Catch a Star Handler
  const handleCatchStar = (starId) => {
    if (collectedStarIds.includes(starId)) return;

    playStarChime(784 + (starId * 60));
    setCollectedStarIds((prev) => [...prev, starId]);

    const randomQuote =
      STAR_CATCH_QUOTES[(starId - 1) % STAR_CATCH_QUOTES.length];
    setPipSpeech(randomQuote);
    setSpeechAnimationKey((k) => k + 1);
  };

  // Secret Star Handler
  const handleFindSecretStar = () => {
    if (isSecretStarFound) return;

    playStarChime(1174.66); // D6 starlight chime
    setIsSecretStarFound(true);
    setPipSpeech("Psst... every great dream starts with a little imagination.");
    setSpeechAnimationKey((k) => k + 1);
  };

  // Mood Selector
  const handleSelectMood = (mood) => {
    setSelectedMood(mood);
    playStarChime(880);
    setPipSpeech(mood.message);
    setSpeechAnimationKey((k) => k + 1);
  };

  // Reset Collection
  const handleReset = () => {
    setCollectedStarIds([]);
    setIsSecretStarFound(false);
    playStarChime(587.33);
    setPipSpeech("The stars have returned to their cozy constellation places!");
    setSpeechAnimationKey((k) => k + 1);
  };

  const totalCollected = collectedStarIds.length + (isSecretStarFound ? 1 : 0);
  const maxStars = COLLECTIBLE_STARS.length + 1;

  return (
    <section
      id="dream-room"
      className={`dream-room-section ${isDay ? 'day-mode' : 'night-mode'} mood-${selectedMood.id}`}
      aria-label="The Dream Room interactive environment"
    >
      {/* 3D Background Nursery Environment */}
      <DreamRoomCanvas3D isDay={isDay} />

      {/* Atmospheric Vignette & Color Transitions */}
      <div className="dream-room-sky-backdrop" aria-hidden="true" />

      {/* Main Section Content & Controls */}
      <div className="dream-room-container">
        {/* Section Introduction Header */}
        <header className="dream-room-header">
          <div className="dream-room-eyebrow">
            <span className="eyebrow-star">✦</span>
            <span>A LITTLE MAGIC AFTER DARK</span>
          </div>

          <h2 className="dream-room-title">
            Step Inside the Dream Room.
          </h2>

          <p className="dream-room-supporting">
            Every star has a story. Every light holds a dream. What will you discover tonight?
          </p>

          <p className="dream-room-instruction">
            <span className="instruction-sparkle">✦</span>
            <span>Explore, click, and make a little magic.</span>
          </p>
        </header>

        {/* Minimal Glass HUD Controls Bar */}
        <div className="dream-room-hud" role="toolbar" aria-label="Dream Room Controls">
          {/* Day / Night Toggle */}
          <button
            type="button"
            className="hud-btn btn-day-night"
            onClick={handleToggleDayNight}
            aria-label={isDay ? 'Switch environment to Night' : 'Switch environment to Day'}
          >
            <span className="hud-icon">{isDay ? '🌙' : '☀️'}</span>
            <span>{isDay ? 'Switch to Night' : 'Switch to Day'}</span>
          </button>

          {/* Star Collection Counter */}
          <div className="star-counter-badge" aria-live="polite">
            <span className="counter-star-icon">⭐</span>
            <span className="counter-text">
              Stars collected: <strong>{totalCollected}</strong> / {maxStars}
            </span>
          </div>

          {/* Reset Control */}
          <button
            type="button"
            className="hud-btn btn-reset"
            onClick={handleReset}
            disabled={totalCollected === 0}
            aria-label="Reset star collection and secret star"
            title="Restore stars to the sky"
          >
            <span className="hud-icon">↺</span>
            <span>Reset Stars</span>
          </button>
        </div>

        {/* Secret Star Badge (revealed when Secret Star is found) */}
        {isSecretStarFound && (
          <div className="secret-star-banner" role="status" aria-live="polite">
            <span className="secret-badge-medal">🏆</span>
            <div className="secret-badge-content">
              <strong>✦ Secret Discovered: Starlight Dream Pioneer Badge!</strong>
              <span>“Psst... every great dream starts with a little imagination.”</span>
            </div>
          </div>
        )}

        {/* Interactive Magical Stage */}
        <div className="dream-room-stage" aria-label="Interactive Dream Room Stage">
          {/* Collectible Floating Glowing Stars */}
          {COLLECTIBLE_STARS.map((star) => {
            const isCollected = collectedStarIds.includes(star.id);
            return (
              <button
                key={star.id}
                type="button"
                className={`collectible-star star-${star.id} ${
                  isCollected ? 'collected' : ''
                }`}
                style={{
                  top: star.top,
                  left: star.left,
                  right: star.right,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                }}
                onClick={() => handleCatchStar(star.id)}
                disabled={isCollected}
                aria-label={
                  isCollected
                    ? `${star.label} already caught`
                    : `Click to catch ${star.label}`
                }
                title={isCollected ? 'Collected' : 'Catch this star!'}
              >
                <span className="star-glyph">✦</span>
                <span className="star-glow-ring" />
              </button>
            );
          })}

          {/* Hidden Secret Star (Tucked near the moon at top right) */}
          <button
            type="button"
            className={`secret-star ${isSecretStarFound ? 'secret-found' : ''}`}
            onClick={handleFindSecretStar}
            disabled={isSecretStarFound}
            aria-label={
              isSecretStarFound
                ? 'Secret star already discovered'
                : 'Secret star hidden near the moon'
            }
            title={isSecretStarFound ? 'Secret Found!' : 'A curious twinkling starlight...'}
          >
            <span className="secret-star-sparkle">★</span>
            <span className="secret-star-halo" />
          </button>

          {/* Central Platform with Pip & Cozy Nightlight */}
          <div className="pip-room-platform">
            {/* Pip Speech Bubble */}
            <div
              key={speechAnimationKey}
              className="room-speech-bubble"
              role="status"
              aria-live="polite"
            >
              <div className="room-bubble-header">
                <span className="bubble-pip-badge">✦ Pip whispers:</span>
                <span className="bubble-mood-indicator">
                  {selectedMood.icon} {selectedMood.label}
                </span>
              </div>
              <p className="room-bubble-text">“{pipSpeech}”</p>
              <div className="room-bubble-tail" />
            </div>

            {/* Character & Bedside Nightlight Container */}
            <div className="pip-platform-visuals">
              {/* Soft Ambient Platform Glow */}
              <div className="platform-glow" />

              {/* Pip Avatar with Mood Breathing Animation */}
              <div className={`pip-avatar-wrapper mood-anim-${selectedMood.id}`}>
                <img
                  src={pipImg}
                  alt="Pip sitting on a cloud platform inside the magical Dream Room"
                  className="pip-room-image"
                  draggable="false"
                />
              </div>

              {/* Cozy Bedside Nightlight on Platform */}
              <div className="platform-nightlight">
                <img
                  src={nightlightImg}
                  alt="Pip's crescent moon nightlight glowing on the cloud platform"
                  className="nightlight-room-image"
                  draggable="false"
                />
                <div className="nightlight-warm-glow" />
              </div>

              {/* Cloud Base Platform */}
              <div className="platform-cloud-bed" />
            </div>
          </div>
        </div>

        {/* Mood Selector Panel: "How is Pip feeling tonight?" */}
        <div className="pip-mood-selector-card" aria-label="Pip's Mood Selector">
          <h3 className="mood-card-title">How is Pip feeling tonight?</h3>
          <p className="mood-card-desc">
            Select a bedtime mood to see how Pip reacts in the Dream Room:
          </p>

          <div className="mood-buttons-grid" role="radiogroup" aria-label="Select Pip's mood">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`btn-mood-tab ${selectedMood.id === m.id ? 'active' : ''}`}
                onClick={() => handleSelectMood(m)}
                aria-checked={selectedMood.id === m.id}
                role="radio"
              >
                <span className="mood-tab-icon">{m.icon}</span>
                <span className="mood-tab-label">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
