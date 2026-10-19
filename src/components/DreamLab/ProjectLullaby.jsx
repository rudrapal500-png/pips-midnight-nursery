import { useState, useRef, useEffect, useCallback } from 'react';
import lullabyBoxImg from '../../assets/projects/lullaby-box.png';
import './ProjectLullaby.css';

// Gentle music box melody notes (frequencies in Hz and durations in beats)
// Brahms' Lullaby / Starlight bedtime theme
const LULLABY_NOTES = [
  { freq: 392.00, dur: 1.0 }, // G4
  { freq: 392.00, dur: 1.0 }, // G4
  { freq: 440.00, dur: 2.0 }, // A4
  { freq: 392.00, dur: 2.0 }, // G4
  { freq: 523.25, dur: 2.0 }, // C5
  { freq: 493.88, dur: 4.0 }, // B4
  { freq: 392.00, dur: 1.0 }, // G4
  { freq: 392.00, dur: 1.0 }, // G4
  { freq: 440.00, dur: 2.0 }, // A4
  { freq: 392.00, dur: 2.0 }, // G4
  { freq: 587.33, dur: 2.0 }, // D5
  { freq: 523.25, dur: 4.0 }, // C5
  { freq: 523.25, dur: 1.0 }, // C5
  { freq: 659.25, dur: 2.0 }, // E5
  { freq: 587.33, dur: 2.0 }, // D5
  { freq: 523.25, dur: 2.0 }, // C5
  { freq: 440.00, dur: 2.0 }, // A4
  { freq: 392.00, dur: 4.0 }, // G4
];

export default function ProjectLullaby() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const noteIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  const isMutedRef = useRef(false);
  const scheduleNextNoteRef = useRef(null);

  // Sync state to refs in useEffect
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Synthesize a single authentic music-box chime note
  const playChimeNote = useCallback((freq, duration) => {
    if (!audioCtxRef.current || isMutedRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Secondary overtone for warm music-box shimmer
    const overtone = ctx.createOscillator();
    const overtoneGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2.01, now);

    // Exponential music-box decay
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.9);

    overtoneGain.gain.setValueAtTime(0, now);
    overtoneGain.gain.linearRampToValueAtTime(0.04, now + 0.004);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.45);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    gain.connect(ctx.destination);
    overtoneGain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration);
    overtone.stop(now + duration);
  }, []);

  // Update scheduleNextNoteRef
  useEffect(() => {
    scheduleNextNoteRef.current = () => {
      if (!isPlayingRef.current) return;

      const note = LULLABY_NOTES[noteIndexRef.current];
      const beatDuration = note.dur * 0.42;

      playChimeNote(note.freq, beatDuration);
      setCurrentNoteIndex(noteIndexRef.current);

      noteIndexRef.current = (noteIndexRef.current + 1) % LULLABY_NOTES.length;

      timerRef.current = setTimeout(() => {
        if (scheduleNextNoteRef.current) {
          scheduleNextNoteRef.current();
        }
      }, beatDuration * 1000);
    };
  }, [playChimeNote]);

  const handleTogglePlay = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }

    if (isPlaying) {
      // Pause
      clearTimeout(timerRef.current);
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      // Play
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setIsPlaying(true);
      isPlayingRef.current = true;
      if (scheduleNextNoteRef.current) {
        scheduleNextNoteRef.current();
      }
    }
  };

  const handleStop = () => {
    clearTimeout(timerRef.current);
    setIsPlaying(false);
    isPlayingRef.current = false;
    noteIndexRef.current = 0;
    setCurrentNoteIndex(0);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className={`project-card lullaby-card ${isPlaying ? 'is-playing' : ''}`}>
      {/* Category Pill */}
      <div className="project-category">
        <span className="category-star">✦</span>
        <span>SOUND &amp; SLEEP</span>
      </div>

      {/* Title & Description */}
      <h3 className="project-title">The Lullaby Lab</h3>
      <p className="project-description">
        Every dream deserves a soundtrack. Pip’s enchanted music box creates gentle lullabies for little ghosts and creatures who need a softer landing into sleep.
      </p>

      {/* Visual Stage */}
      <div className="lullaby-stage">
        {/* Animated Soundwave Rings (active when playing) */}
        {isPlaying && !isMuted && (
          <div className="soundwave-rings" aria-hidden="true">
            <span className="sound-ring ring-1" />
            <span className="sound-ring ring-2" />
            <span className="sound-ring ring-3" />
          </div>
        )}

        {/* Floating Musical Notes */}
        {isPlaying && !isMuted && (
          <div className="musical-notes-field" aria-hidden="true">
            <span className="floating-note note-1">♪</span>
            <span className="floating-note note-2">♫</span>
            <span className="floating-note note-3">♩</span>
            <span className="floating-note note-4">♬</span>
            <span className="floating-note note-5">✦</span>
          </div>
        )}

        {/* Ambient Dream Glow behind Music Box */}
        <div className="musicbox-glow-aura" />

        {/* Floating Music Box Container */}
        <div className="musicbox-float-wrapper">
          <img
            src={lullabyBoxImg}
            alt="Pip's enchanted lullaby music box with a miniature unicorn on top"
            className="musicbox-image"
            draggable="false"
          />

          {/* Golden Winding Key detail that rotates when playing */}
          <div className={`winding-key-sparkle ${isPlaying ? 'is-winding' : ''}`} title="Golden winding key">
            <span className="key-glow" />
          </div>
        </div>

        {/* Soft Bedtime Cloud Pillow */}
        <div className="lullaby-cloud-cushion" />
      </div>

      {/* Interactive Controls */}
      <div className="lullaby-controls">
        <button
          type="button"
          className={`btn-play-lullaby ${isPlaying ? 'playing' : ''}`}
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'Pause Lullaby melody' : 'Play gentle Lullaby melody'}
        >
          {isPlaying ? (
            <>
              <svg className="ctrl-icon" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="2" />
                <rect x="14" y="5" width="4" height="14" rx="2" />
              </svg>
              <span>Pause Lullaby</span>
            </>
          ) : (
            <>
              <svg className="ctrl-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.14V19.14C8 19.92 8.85 20.4 9.52 19.99L20.52 12.99C21.16 12.58 21.16 11.7 20.52 11.29L9.52 4.29C8.85 3.88 8 4.36 8 5.14Z" />
              </svg>
              <span>Play Lullaby</span>
            </>
          )}
        </button>

        <div className="secondary-audio-controls">
          <button
            type="button"
            className="btn-audio-ctrl"
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Unmute lullaby sound' : 'Mute lullaby sound'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg className="ctrl-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2V15H6L11 19V5Z" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" />
                <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" />
                <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="ctrl-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2V15H6L11 19V5Z" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" />
                <path d="M19.07 4.93C20.94 6.8 22 9.34 22 12C22 14.65 20.94 17.19 19.07 19.07M15.54 8.46C16.47 9.4 17 10.67 17 12C17 13.32 16.47 14.59 15.54 15.53" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {isPlaying && (
            <button
              type="button"
              className="btn-audio-ctrl"
              onClick={handleStop}
              aria-label="Stop and reset melody"
              title="Stop Lullaby"
            >
              <svg className="ctrl-icon-sm" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Melodic Starlight Progress Indicator */}
      {isPlaying && (
        <div className="melody-indicator" aria-live="polite">
          <span className="indicator-pulse" />
          <span className="indicator-text">
            Playing note {currentNoteIndex + 1} of {LULLABY_NOTES.length} · Starlight Chimes
          </span>
        </div>
      )}
    </div>
  );
}
