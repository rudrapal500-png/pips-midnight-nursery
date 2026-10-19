import Hero from './components/Hero/Hero'
import DreamLab from './components/DreamLab/DreamLab'
import DreamRoom from './components/DreamRoom/DreamRoom'
import DreamPassport from './components/DreamPassport/DreamPassport'
import Credits from './components/Credits/Credits'
import './App.css'

function App() {
  return (
    <>
      {/* SECTION 1: Pip · Junior Dream Engineer Hero Section */}
      <Hero />

      {/* SECTION 2: Meet Pip (Character Introduction & Story Anchor) */}
      <section id="meet-pip" className="midnight-section">
        <div className="section-container">
          <div className="section-eyebrow">✦ ABOUT PIP</div>
          <h2 className="section-title">The Story of Pip</h2>
          <p className="section-subtitle">
            Pip is a curious, sleepy, and easily delighted baby dream engineer at the Midnight Nursery.
          </p>

          <div className="story-cards-grid">
            <div className="story-card">
              <div className="story-card-icon">🌙</div>
              <h3 className="story-card-title">Midnight Nursery</h3>
              <p className="story-card-desc">
                When the clock strikes bedtime, Pip climbs into a fluffy cloud workshop to invent comforting lullabies, starlight nightlights, and soothing dreams for the neighbourhood’s little ghosts and sleepy creatures.
              </p>
            </div>

            <div className="story-card">
              <div className="story-card-icon">✨</div>
              <h3 className="story-card-title">Cozy Pinpricks of Light</h3>
              <p className="story-card-desc">
                With a smooth round skull face, a tiny crooked smile, and cozy glowing pinpricks of light in soft eye sockets, Pip always brings warmth and friendliness to bedtime.
              </p>
            </div>

            <div className="story-card">
              <div className="story-card-icon">🦄</div>
              <h3 className="story-card-title">Canonical Keepsakes</h3>
              <p className="story-card-desc">
                Never without a signature starry nightcap tied with a little pink bow, a warm lantern that keeps away the dark, and a magical unicorn music box that plays lullabies on repeat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Pip's Dream Lab — 3D Project Showcase */}
      <DreamLab />

      {/* SECTION 4: The Dream Room — Interactive Magic Environment */}
      <DreamRoom />

      {/* SECTION 6: The Dream Passport — Interactive Portfolio Navigation */}
      <DreamPassport />

      {/* SECTION 5: Behind the Dreams & Credits */}
      <Credits />
    </>
  )
}

export default App
