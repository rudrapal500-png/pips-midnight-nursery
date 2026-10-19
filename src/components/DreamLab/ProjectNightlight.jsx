import { useState } from 'react';
import dreamNightlightImg from '../../assets/projects/dream-nightlight.png';
import './ProjectNightlight.css';

export default function ProjectNightlight() {
  const [isOn, setIsOn] = useState(true);
  const [lightMode, setLightMode] = useState('warm'); // 'warm' | 'cool'
  const [isPulsing, setIsPulsing] = useState(false);

  const handleTogglePower = () => {
    const nextState = !isOn;
    setIsOn(nextState);
    if (nextState) {
      // Trigger a soft turn-on pulse
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 900);
    }
  };

  const handleSetMode = (mode) => {
    setLightMode(mode);
    if (isOn) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 600);
    }
  };

  return (
    <div
      className={`project-card nightlight-card ${isOn ? 'lamp-on' : 'lamp-off'} mode-${lightMode} ${isPulsing ? 'lamp-pulse' : ''}`}
    >
      {/* Category Pill */}
      <div className="project-category">
        <span className="category-star">✦</span>
        <span>LIGHT &amp; COMFORT</span>
      </div>

      {/* Title & Description */}
      <h3 className="project-title">The Nightlight Collection</h3>
      <p className="project-description">
        Little lights for little worries. Pip designs moon-shaped lanterns and dreamy bedside lamps that turn the darkest corners into cozy places to rest.
      </p>

      {/* Visual Stage */}
      <div className="nightlight-stage">
        {/* Floating Background Bedside Lanterns */}
        <div className="background-lanterns" aria-hidden="true">
          <div className="bedside-lantern lantern-left">
            <span className="lantern-hanger" />
            <div className="lantern-glass">
              <span className="lantern-spark" />
            </div>
          </div>
          <div className="bedside-lantern lantern-right">
            <span className="lantern-hanger" />
            <div className="lantern-glass">
              <span className="lantern-spark" />
            </div>
          </div>
        </div>

        {/* Orbiting Dream Stars */}
        <div className="orbiting-stars-system" aria-hidden="true">
          <span className="orbit-star star-orbit-1">✦</span>
          <span className="orbit-star star-orbit-2">★</span>
          <span className="orbit-star star-orbit-3">✦</span>
        </div>

        {/* Ambient Bloom Glow Aura (Controlled by On/Off state & Warm/Cool mode) */}
        <div className="nightlight-bloom-aura" />
        <div className="nightlight-soft-wash" />

        {/* Crescent Moon Lamp Visual */}
        <div className="nightlight-lamp-wrapper">
          <img
            src={dreamNightlightImg}
            alt="Pip's glowing crescent-moon bedside nightlight on a cloud pedestal"
            className="nightlight-image"
            draggable="false"
          />

          {/* Starlight Cheek Beam when On */}
          {isOn && <div className="lamp-cheek-glow" />}
        </div>

        {/* Soft Bedside Cloud Halo */}
        <div className="nightlight-cushion" />
      </div>

      {/* Interactive Controls & Mode Switcher */}
      <div className="nightlight-controls">
        <button
          type="button"
          className={`btn-power-toggle ${isOn ? 'on' : 'off'}`}
          onClick={handleTogglePower}
          aria-label={isOn ? 'Turn nightlight off' : 'Turn nightlight on'}
        >
          <span className="power-indicator-dot" />
          <span>{isOn ? 'Turn Off' : 'Turn On'}</span>
        </button>

        {/* Color Palette Mode Switcher */}
        <div className="light-mode-selector" role="group" aria-label="Nightlight glow mode">
          <button
            type="button"
            className={`btn-mode-tab ${lightMode === 'warm' ? 'active' : ''}`}
            onClick={() => handleSetMode('warm')}
            aria-pressed={lightMode === 'warm'}
            title="Warm Golden Honey Glow"
          >
            <span className="mode-swatch warm-swatch" />
            <span>Warm Gold</span>
          </button>

          <button
            type="button"
            className={`btn-mode-tab ${lightMode === 'cool' ? 'active' : ''}`}
            onClick={() => handleSetMode('cool')}
            aria-pressed={lightMode === 'cool'}
            title="Cool Moonlight Silver Glow"
          >
            <span className="mode-swatch cool-swatch" />
            <span>Cool Moon</span>
          </button>
        </div>
      </div>

      {/* Real-time Status Badge */}
      <div className="nightlight-status-bar">
        <span className="status-label">
          {isOn ? (
            lightMode === 'warm'
              ? '✦ Radiant Warm Moonlight · 100% Cozy'
              : '✦ Soothing Lavender Moonlight · Dream Mode'
          ) : (
            '☾ Lamp asleep in moonlight saver mode'
          )}
        </span>
      </div>
    </div>
  );
}
