import ProjectLullaby from './ProjectLullaby';
import ProjectNightlight from './ProjectNightlight';
import ProjectDelivery from './ProjectDelivery';
import './DreamLab.css';

/**
 * Section 3: Pip's Dream Lab — 3D Project Showcase
 * Showcases Pip's three canonical inventions in a magical workshop setting.
 */
export default function DreamLab() {
  return (
    <section id="dream-lab" className="dream-lab-showcase-section" aria-label="Pip's Dream Lab Project Showcase">
      {/* Dream Lab Atmospheric Ambient Background */}
      <div className="dream-lab-backdrop" aria-hidden="true">
        <div className="lab-orb orb-1" />
        <div className="lab-orb orb-2" />
        <div className="lab-orb orb-3" />
        <div className="lab-grid-lines" />
      </div>

      <div className="dream-lab-container">
        {/* Section Header */}
        <header className="dream-lab-header">
          {/* Eyebrow */}
          <div className="dream-lab-eyebrow">
            <span className="eyebrow-star">✦</span>
            <span>A LITTLE MAGIC, MADE BY PIP</span>
          </div>

          {/* Main Heading with Decorative Animated Star */}
          <h2 className="dream-lab-title">
            <span>Welcome to the Dream Lab.</span>
            <span className="animated-heading-star" aria-hidden="true" title="Dream Starlight">✦</span>
          </h2>

          {/* Subtitle */}
          <p className="dream-lab-subtitle">
            Three little inventions. A universe of dreams.
          </p>

          {/* Supporting Text */}
          <p className="dream-lab-supporting">
            From sleepy melodies to glowing nightlights and midnight deliveries, every creation begins with one tiny idea and a little stardust.
          </p>
        </header>

        {/* 3D Project Showcase Grid */}
        <div className="dream-lab-grid">
          {/* Project 1: The Lullaby Lab */}
          <ProjectLullaby />

          {/* Project 2: The Nightlight Collection */}
          <ProjectNightlight />

          {/* Project 3: Dream Delivery Routes */}
          <ProjectDelivery />
        </div>
      </div>
    </section>
  );
}
