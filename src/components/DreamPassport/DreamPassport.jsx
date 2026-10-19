import { useState, useEffect } from 'react';
import pipHeroImg from '../../assets/pip/pip-hero.png';
import pipFallbackImg from '../../assets/pip-transparent.png';
import './DreamPassport.css';

const DESTINATIONS = [
  {
    id: 'home',
    title: 'Home',
    subtitle: 'The Midnight Nursery',
    targetId: 'hero',
    x: 18,
    y: 28,
    pipMessage: "Let's start our adventure again!",
    icon: '✦',
    badge: '01',
  },
  {
    id: 'meet-pip',
    title: 'Meet Pip',
    subtitle: 'Character Story & Lore',
    targetId: 'meet-pip',
    x: 48,
    y: 18,
    pipMessage: "Oh! You're here to meet me!",
    icon: '🌙',
    badge: '02',
  },
  {
    id: 'dream-lab',
    title: 'Dream Lab',
    subtitle: 'Three Inventions Showcase',
    targetId: 'dream-lab',
    x: 80,
    y: 35,
    pipMessage: "Come see what I've been inventing!",
    icon: '✨',
    badge: '03',
  },
  {
    id: 'dream-room',
    title: 'Dream Room',
    subtitle: 'Interactive Magic & Stars',
    targetId: 'dream-room',
    x: 32,
    y: 72,
    pipMessage: "Careful, the stars are very ticklish.",
    icon: '⭐',
    badge: '04',
  },
  {
    id: 'credits',
    title: 'Credits',
    subtitle: 'Behind the Dreams & Note',
    targetId: 'credits',
    x: 72,
    y: 78,
    pipMessage: "Every dream has a little help behind it.",
    icon: '🦄',
    badge: '05',
  },
];

/**
 * Storage helpers for local session milestone persistence.
 */
const defaultMilestones = {
  firstHello: false,
  dreamExplorer: false,
  stardustKeeper: false,
};

function getVisitorId() {
  let id = localStorage.getItem('pip_visitor_id');

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('pip_visitor_id', id);
  }

  return id;
}

const visitorId = getVisitorId();
const milestonesUrl = `http://localhost:3001/api/milestones/${visitorId}`;

async function loadMilestones() {
  const response = await fetch(milestonesUrl);
  if (!response.ok) throw new Error('Could not load stamps.');
  return response.json();
}

async function saveMilestones(milestones) {
  const response = await fetch(milestonesUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(milestones),
  });

  if (!response.ok) throw new Error('Could not save stamps.');
}

export default function DreamPassport() {
  const [activeDestination, setActiveDestination] = useState(DESTINATIONS[0]);
  const [imgSrc, setImgSrc] = useState(pipHeroImg);
  const [pipSpeech, setPipSpeech] = useState(DESTINATIONS[0].pipMessage);
  const [speechKey, setSpeechKey] = useState(0);

  // Passport Milestones (initialized from sessionStorage)
  const [milestones, setMilestones] = useState(defaultMilestones);
  useEffect(() => {
  loadMilestones()
    .then(setMilestones)
    .catch((error) => console.error(error));
  }, []);
  const [justUnlocked, setJustUnlocked] = useState(null);

  // Observer to automatically unlock passport stamps as user scrolls into sections
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        let changedKey = null;

        if (id === 'meet-pip') changedKey = 'firstHello';
        else if (id === 'dream-lab') changedKey = 'dreamExplorer';
        else if (id === 'dream-room') changedKey = 'stardustKeeper';

        if (changedKey) {
          setMilestones((prev) => {
            if (prev[changedKey]) return prev;
            const updated = { ...prev, [changedKey]: true };
            saveMilestones(updated);
            setJustUnlocked(changedKey);
            setTimeout(() => setJustUnlocked(null), 2500);
            return updated;
          });
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.25 });
    ['meet-pip', 'dream-lab', 'dream-room'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSelectDestination = (dest) => {
    setActiveDestination(dest);
    setPipSpeech(dest.pipMessage);
    setSpeechKey((k) => k + 1);

    // Smooth scroll to the selected section
    const elem = document.getElementById(dest.targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
      elem.setAttribute('tabindex', '-1');
      elem.focus({ preventScroll: true });
    }

    // Mark milestone if corresponding section is clicked
    if (dest.targetId === 'meet-pip' && !milestones.firstHello) {
      unlockMilestone('firstHello');
    } else if (dest.targetId === 'dream-lab' && !milestones.dreamExplorer) {
      unlockMilestone('dreamExplorer');
    } else if (dest.targetId === 'dream-room' && !milestones.stardustKeeper) {
      unlockMilestone('stardustKeeper');
    }
  };

  const unlockMilestone = (key) => {
    setMilestones((prev) => {
      if (prev[key]) return prev;
      const updated = { ...prev, [key]: true };
      saveMilestones(updated);
      setJustUnlocked(key);
      setTimeout(() => setJustUnlocked(null), 2500);
      return updated;
    });
  };

  const completedCount = Object.values(milestones).filter(Boolean).length;

  return (
    <section id="dream-passport" className="dream-passport-section" aria-label="The Dream Passport & Navigation">
      {/* Background Starlight Ambience */}
      <div className="passport-backdrop" aria-hidden="true">
        <div className="passport-celestial-portal" />
        <div className="passport-mist" />
      </div>

      <div className="passport-container">
        {/* Section Header */}
        <header className="passport-header">
          <div className="passport-eyebrow">
            <span className="eyebrow-star">✦</span>
            <span>YOUR LITTLE GUIDE TO DREAMLAND</span>
          </div>

          <h2 className="passport-title">Where shall we dream next?</h2>

          <p className="passport-supporting">
            Every little corner of the Midnight Nursery holds a different kind of magic. Choose your next adventure.
          </p>
        </header>

        {/* Side-by-Side Experience: Dream Map & Dream Passport */}
        <div className="passport-interactive-row">
          {/* Left Column: Constellation Dream Map */}
          <div className="dream-map-panel" aria-label="Constellation Dream Map">
            <div className="map-panel-header">
              <span className="map-header-icon">🗺️</span>
              <div>
                <h3 className="map-title">Constellation Navigation Map</h3>
                <p className="map-subtitle">Click any glowing stellar node to journey there</p>
              </div>
            </div>

            {/* Constellation Canvas Viewport */}
            <div className="constellation-viewport">
              {/* Background Dream Portal */}
              <div className="portal-ring ring-outer" aria-hidden="true" />
              <div className="portal-ring ring-inner" aria-hidden="true" />

              {/* Constellation SVG Connecting Lines */}
              <svg className="constellation-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="starlightPath" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#fde047" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                {/* Lines connecting the 5 destinations in a dreamy stellar pentagram */}
                <line x1="18" y1="28" x2="48" y2="18" stroke="url(#starlightPath)" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="48" y1="18" x2="80" y2="35" stroke="url(#starlightPath)" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="80" y1="35" x2="72" y2="78" stroke="url(#starlightPath)" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="72" y1="78" x2="32" y2="72" stroke="url(#starlightPath)" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="32" y1="72" x2="18" y2="28" stroke="url(#starlightPath)" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="18" y1="28" x2="80" y2="35" stroke="rgba(216, 180, 254, 0.25)" strokeWidth="0.5" strokeDasharray="1.5,1.5" />
                <line x1="48" y1="18" x2="72" y2="78" stroke="rgba(216, 180, 254, 0.25)" strokeWidth="0.5" strokeDasharray="1.5,1.5" />
              </svg>

              {/* Destination Stellar Nodes */}
              {DESTINATIONS.map((dest) => {
                const isActive = activeDestination.id === dest.id;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    className={`constellation-node ${isActive ? 'active-node' : ''}`}
                    style={{ left: `${dest.x}%`, top: `${dest.y}%` }}
                    onClick={() => handleSelectDestination(dest)}
                    aria-label={`Navigate to ${dest.title} (${dest.subtitle})`}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    <span className="node-glow-halo" aria-hidden="true" />
                    <span className="node-core">
                      <span className="node-glyph">{dest.icon}</span>
                    </span>
                    <span className="node-label">
                      <span className="node-num">{dest.badge}</span>
                      <span className="node-name">{dest.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Destination Card Footer */}
            <div className="active-destination-info">
              <div className="dest-badge-col">
                <span className="dest-active-tag">DESTINATION READY</span>
                <span className="dest-name">{activeDestination.title}</span>
                <span className="dest-sub">{activeDestination.subtitle}</span>
              </div>
              <button
                type="button"
                className="btn-warp"
                onClick={() => handleSelectDestination(activeDestination)}
              >
                <span>Travel to {activeDestination.title}</span>
                <span className="warp-arrow">➔</span>
              </button>
            </div>
          </div>

          {/* Right Column: Your Dream Passport & Pip Guidance */}
          <div className="dream-passport-panel" aria-label="Dream Passport Stamps">
            {/* Pip's Guidance Speech Header */}
            <div className="pip-guide-box">
              <div className="guide-avatar-wrap">
                <img
                  src={imgSrc}
                  alt="Pip guiding visitors through the Dream Passport"
                  className="guide-pip-img"
                  onError={() => setImgSrc(pipFallbackImg)}
                  draggable="false"
                />
              </div>
              <div key={speechKey} className="guide-speech-bubble" role="status" aria-live="polite">
                <span className="speech-speaker">✦ Pip the Navigator says:</span>
                <p className="speech-text">“{pipSpeech}”</p>
                <div className="speech-tail" />
              </div>
            </div>

            {/* Passport Booklet Card */}
            <div className="passport-booklet">
              <div className="booklet-header">
                <span className="passport-crest">🌙✦</span>
                <div className="booklet-title-wrap">
                  <h3 className="booklet-title">Your Dream Passport</h3>
                  <span className="booklet-serial">NO. MN-2026-PIP · OFFICIAL ENTRY</span>
                </div>
                <div className="stamps-count-pill">
                  <span>{completedCount} / 3 Stamps</span>
                </div>
              </div>

              {/* Milestones List */}
              <div className="milestones-list" role="list">
                {/* Milestone 1: First Hello */}
                <div
                  className={`milestone-item ${milestones.firstHello ? 'stamped' : 'pending'} ${
                    justUnlocked === 'firstHello' ? 'just-unlocked' : ''
                  }`}
                  role="listitem"
                >
                  <div className="stamp-seal">
                    <span className="seal-icon">{milestones.firstHello ? '⭐' : '○'}</span>
                  </div>
                  <div className="milestone-details">
                    <div className="milestone-top">
                      <h4 className="milestone-name">First Hello</h4>
                      <span className="milestone-status">
                        {milestones.firstHello ? 'STAMPED · DISCOVERED' : 'Awaiting Visit'}
                      </span>
                    </div>
                    <p className="milestone-desc">
                      Met Pip and explored the Midnight Nursery lore in Section 2.
                    </p>
                  </div>
                </div>

                {/* Milestone 2: Dream Explorer */}
                <div
                  className={`milestone-item ${milestones.dreamExplorer ? 'stamped' : 'pending'} ${
                    justUnlocked === 'dreamExplorer' ? 'just-unlocked' : ''
                  }`}
                  role="listitem"
                >
                  <div className="stamp-seal">
                    <span className="seal-icon">{milestones.dreamExplorer ? '🦄' : '○'}</span>
                  </div>
                  <div className="milestone-details">
                    <div className="milestone-top">
                      <h4 className="milestone-name">Dream Explorer</h4>
                      <span className="milestone-status">
                        {milestones.dreamExplorer ? 'STAMPED · DISCOVERED' : 'Awaiting Visit'}
                      </span>
                    </div>
                    <p className="milestone-desc">
                      Explored Pip’s 3 inventions: Lullaby Box, Nightlight &amp; Delivery.
                    </p>
                  </div>
                </div>

                {/* Milestone 3: Stardust Keeper */}
                <div
                  className={`milestone-item ${milestones.stardustKeeper ? 'stamped' : 'pending'} ${
                    justUnlocked === 'stardustKeeper' ? 'just-unlocked' : ''
                  }`}
                  role="listitem"
                >
                  <div className="stamp-seal">
                    <span className="seal-icon">{milestones.stardustKeeper ? '✨' : '○'}</span>
                  </div>
                  <div className="milestone-details">
                    <div className="milestone-top">
                      <h4 className="milestone-name">Stardust Keeper</h4>
                      <span className="milestone-status">
                        {milestones.stardustKeeper ? 'STAMPED · DISCOVERED' : 'Awaiting Visit'}
                      </span>
                    </div>
                    <p className="milestone-desc">
                      Visited the interactive Dream Room and caught bedtime starlight.
                    </p>
                  </div>
                </div>
              </div>

              {/* Passport Persistence Footnote */}
              <div className="passport-footnote">
                <span className="footnote-star">✦</span>
                <span>
                  Milestones are automatically stamped as you explore and saved to your browser session.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
