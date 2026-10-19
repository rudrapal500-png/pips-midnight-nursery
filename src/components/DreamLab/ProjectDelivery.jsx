import { useState, useRef, useEffect } from 'react';
import pipWaveImg from '../../assets/pip-wave.png';
import './ProjectDelivery.css';

const ROUTES = [
  {
    id: 'starlight',
    name: 'Starlight Lane',
    recipient: 'Baby Ghost',
    dreamItem: 'Sweet Starberry Dreams',
    houseIndex: 0,
    flightDuration: 2.2,
  },
  {
    id: 'chimneys',
    name: 'Whispering Chimneys',
    recipient: 'Sleepy Little Owl',
    dreamItem: 'Cloud Fluff Lullaby',
    houseIndex: 1,
    flightDuration: 2.5,
  },
  {
    id: 'cradle',
    name: 'Cloudberry Cradle',
    recipient: 'Star Bunny',
    dreamItem: 'Moonbeam Blanket',
    houseIndex: 2,
    flightDuration: 2.8,
  },
];

export default function ProjectDelivery() {
  const [selectedRoute, setSelectedRoute] = useState(ROUTES[0]);
  const [isFlying, setIsFlying] = useState(false);
  const [deliveredHouses, setDeliveredHouses] = useState({ 0: false, 1: false, 2: false });
  const [activeMessage, setActiveMessage] = useState(
    'Ready for departure! Choose a route and launch Pip’s delivery flight.'
  );

  const timeoutRef = useRef(null);

  const handleLaunchFlight = () => {
    if (isFlying) return;
    setIsFlying(true);
    setActiveMessage(`✦ Pip is taking flight along ${selectedRoute.name}...`);

    timeoutRef.current = setTimeout(() => {
      setIsFlying(false);
      setDeliveredHouses((prev) => ({
        ...prev,
        [selectedRoute.houseIndex]: true,
      }));
      setActiveMessage(
        `✨ Dream parcel safely delivered to ${selectedRoute.recipient}! (${selectedRoute.dreamItem})`
      );
    }, selectedRoute.flightDuration * 1000);
  };

  const handleHouseClick = (index, houseName, recipient, dream) => {
    setActiveMessage(
      `🏠 ${houseName}: ${recipient} is fast asleep with ${dream}!`
    );
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={`project-card delivery-card ${isFlying ? 'is-in-flight' : ''}`}>
      {/* Category Pill */}
      <div className="project-category">
        <span className="category-star">✦</span>
        <span>FLIGHT &amp; EXPLORATION</span>
      </div>

      {/* Title & Description */}
      <h3 className="project-title">Dream Delivery Routes</h3>
      <p className="project-description">
        Every night, Pip takes the dream routes across the rooftops, delivering tiny dream parcels to sleepy neighbours before the first morning star fades.
      </p>

      {/* Miniature 3D Moonlit Neighbourhood Stage */}
      <div className="delivery-stage">
        {/* Moonlit Midnight Sky Backing */}
        <div className="neighbourhood-sky">
          <span className="sky-star star-1">✦</span>
          <span className="sky-star star-2">★</span>
          <span className="sky-star star-3">✦</span>
          <div className="mini-moon" />
        </div>

        {/* Flight Path SVG Starlight Trail */}
        <svg className="flight-path-svg" viewBox="0 0 400 160" aria-hidden="true">
          <path
            d="M 30,35 Q 120,15 200,45 T 370,55"
            fill="none"
            stroke="rgba(216, 180, 254, 0.45)"
            strokeWidth="2.5"
            strokeDasharray="6,6"
            className={`flight-trail-line ${isFlying ? 'active-trail' : ''}`}
          />
        </svg>

        {/* Flying Pip on Cloud */}
        <div
          className={`flying-pip-vessel route-target-${selectedRoute.id} ${
            isFlying ? 'animating-flight' : ''
          }`}
          style={{ animationDuration: `${selectedRoute.flightDuration}s` }}
        >
          <img
            src={pipWaveImg}
            alt="Pip waving from a flying dream delivery cloud"
            className="flying-pip-avatar"
            draggable="false"
          />
          {isFlying && (
            <div className="parcel-drop-animation">
              <span className="glowing-parcel">📦✨</span>
            </div>
          )}
        </div>

        {/* Miniature Rooftops & Houses */}
        <div className="rooftop-row">
          {/* House 1: Baby Ghost Attic */}
          <button
            type="button"
            className={`mini-house house-1 ${deliveredHouses[0] ? 'delivered' : ''}`}
            onClick={() =>
              handleHouseClick(
                0,
                'Starlight Lane #1',
                'Baby Ghost',
                'Sweet Starberry Dreams'
              )
            }
            title="Inspect Baby Ghost's rooftop"
            aria-label="Baby Ghost rooftop"
          >
            <div className="chimney">
              {deliveredHouses[0] && <span className="chimney-smoke">✨</span>}
            </div>
            <div className="roof-gable" />
            <div className="house-body">
              <div className="cozy-window window-lit" />
            </div>
            <span className="house-label">Baby Ghost</span>
          </button>

          {/* House 2: Sleepy Owl Clocktower */}
          <button
            type="button"
            className={`mini-house house-2 ${deliveredHouses[1] ? 'delivered' : ''}`}
            onClick={() =>
              handleHouseClick(
                1,
                'Whispering Chimneys #4',
                'Sleepy Owl',
                'Cloud Fluff Lullaby'
              )
            }
            title="Inspect Sleepy Owl's chimney"
            aria-label="Sleepy Owl chimney"
          >
            <div className="chimney">
              {deliveredHouses[1] && <span className="chimney-smoke">✨</span>}
            </div>
            <div className="roof-tower" />
            <div className="house-body">
              <div className="cozy-window window-lit" />
            </div>
            <span className="house-label">Sleepy Owl</span>
          </button>

          {/* House 3: Star Bunny Burrow */}
          <button
            type="button"
            className={`mini-house house-3 ${deliveredHouses[2] ? 'delivered' : ''}`}
            onClick={() =>
              handleHouseClick(
                2,
                'Cloudberry Cradle #7',
                'Star Bunny',
                'Moonbeam Blanket'
              )
            }
            title="Inspect Star Bunny's burrow roof"
            aria-label="Star Bunny burrow roof"
          >
            <div className="chimney">
              {deliveredHouses[2] && <span className="chimney-smoke">✨</span>}
            </div>
            <div className="roof-gable roof-gable-pink" />
            <div className="house-body">
              <div className="cozy-window window-lit" />
            </div>
            <span className="house-label">Star Bunny</span>
          </button>
        </div>

        {/* Foreground Fluffy Dream Clouds */}
        <div className="foreground-cloud-mist" />
      </div>

      {/* Route Selector & Flight Controls */}
      <div className="delivery-controls">
        <div className="route-pills" role="radiogroup" aria-label="Delivery flight route">
          {ROUTES.map((route) => (
            <button
              key={route.id}
              type="button"
              className={`btn-route-pill ${selectedRoute.id === route.id ? 'active' : ''}`}
              onClick={() => {
                if (!isFlying) setSelectedRoute(route);
              }}
              disabled={isFlying}
              aria-checked={selectedRoute.id === route.id}
              role="radio"
            >
              <span>{route.name}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn-launch-flight"
          onClick={handleLaunchFlight}
          disabled={isFlying}
          aria-label={`Launch delivery flight to ${selectedRoute.recipient}`}
        >
          <span className="flight-rocket-icon">🚀</span>
          <span>{isFlying ? 'Flying Across Rooftops...' : 'Launch Delivery Flight'}</span>
        </button>
      </div>

      {/* Live Mission Status */}
      <div className="delivery-status-banner" aria-live="polite">
        <span className="status-star">✦</span>
        <span className="status-text">{activeMessage}</span>
      </div>
    </div>
  );
}
