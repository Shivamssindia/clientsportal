"use client";

import React, { useEffect, useRef, useState } from 'react';

/* ============================================================
   TECH DATA
   ============================================================ */

interface Tech {
  name: string;
  short: string;
  color: string;
  description: string;
}

const technologies: Tech[] = [
  { name: 'Flutter', short: 'Fl', color: '#02569B', description: 'Cross-platform mobile apps with native performance' },
  { name: 'Kotlin', short: 'Kt', color: '#7F52FF', description: 'Modern Android development, type-safe and fast' },
  { name: 'Next.js', short: 'Nx', color: '#000000', description: 'Server-rendered React apps with sub-second loads' },
  { name: 'WebRTC', short: 'WR', color: '#333333', description: 'Real-time peer-to-peer video and data channels' },
  { name: 'WebSocket', short: 'WS', color: '#00B4D8', description: 'Bi-directional streaming for live dashboards' },
  { name: 'Spring Boot', short: 'Sp', color: '#6DB33F', description: 'Scalable, production-grade backend services' },
  { name: 'Spring AI', short: 'SA', color: '#5C8A47', description: 'LLM orchestration and AI workflows in Java' },
  { name: 'Machine Learning', short: 'ML', color: '#E11D3D', description: 'Custom models for prediction and automation' },
  { name: 'Cloud DevOps', short: 'CD', color: '#FF9900', description: 'CI/CD pipelines, Kubernetes and infrastructure' },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

const OurTechnologies: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  /* Rotate cube slowly */
  useEffect(() => {
    if (isPaused || !visible) return;
    const interval = setInterval(() => {
      setRotation((prev) => prev + 45);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused, visible]);

  /* Track active index from rotation */
  useEffect(() => {
    const idx = Math.floor((rotation / 45) % technologies.length);
    setActiveIndex(idx < 0 ? idx + technologies.length : idx);
  }, [rotation]);

  /* Observe visibility for animation trigger */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleNext = () => {
    setIsPaused(true);
    setRotation((prev) => prev + 45);
    setTimeout(() => setIsPaused(false), 1500);
  };

  const handlePrev = () => {
    setIsPaused(true);
    setRotation((prev) => prev - 45);
    setTimeout(() => setIsPaused(false), 1500);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className={`tech-sec ${visible ? 'is-visible' : ''}`}
        id="technologies"
      >
        <div className="tech-inner">
          {/* Header */}
          <div className="tech-header">
            <div className="tech-label">OUR TECHNOLOGY STACK</div>
            <h2 className="tech-title">
              Engineered for <span className="tech-accent">high velocity</span>
            </h2>
            <p className="tech-subtitle">
              SoftMax Technologies builds scalable, AI-driven digital systems
              with a modern stack — engineered to perform under pressure with
              sub-second response times and measurable business ROI.
            </p>
          </div>

          {/* Cube + Description */}
          <div className="tech-showcase">
            {/* 3D CUBE */}
            <div
              className="cube-stage"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="cube-glow" />

              <div
                className="cube-rotator"
                style={{ transform: `rotateX(-8deg) rotateY(${-rotation}deg)` }}
              >
                {technologies.map((tech, i) => {
                  const angle = (360 / technologies.length) * i;
                  return (
                    <div
                      key={tech.name}
                      className={`cube-face ${activeIndex === i ? 'cube-face-active' : ''}`}
                      style={{
                        transform: `rotateY(${angle}deg) translateZ(170px)`,
                        ['--tech-color' as any]: tech.color,
                      }}
                    >
                      <div className="cube-face-inner">
                        <div className="cube-short">{tech.short}</div>
                        <div className="cube-name">{tech.name}</div>
                      </div>
                      <div className="cube-face-glow" />
                    </div>
                  );
                })}
              </div>

              {/* Navigation dots */}
              <div className="cube-nav">
                <button
                  className="cube-btn"
                  onClick={handlePrev}
                  aria-label="Previous technology"
                >
                  ←
                </button>
                <span className="cube-counter">
                  {String(activeIndex + 1).padStart(2, '0')}{' '}
                  <span className="cube-counter-sep">/</span>{' '}
                  {String(technologies.length).padStart(2, '0')}
                </span>
                <button
                  className="cube-btn"
                  onClick={handleNext}
                  aria-label="Next technology"
                >
                  →
                </button>
              </div>
            </div>

            {/* Active tech details */}
            <div className="tech-detail">
              <div
                className="detail-accent"
                style={{ background: technologies[activeIndex].color }}
              />
              <div className="detail-short">
                {technologies[activeIndex].short}
              </div>
              <h3 className="detail-name">{technologies[activeIndex].name}</h3>
              <p className="detail-desc">
                {technologies[activeIndex].description}
              </p>

              <div className="detail-stats">
                <div className="detail-stat">
                  <span className="detail-stat-value">Sub-second</span>
                  <span className="detail-stat-label">Response times</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-stat-value">ROI</span>
                  <span className="detail-stat-label">Measurable outcomes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Marquee ticker */}
          <div className="tech-ticker">
            <div className="tech-ticker-track">
              {[...technologies, ...technologies].map((tech, i) => (
                <div key={i} className="tech-ticker-item">
                  <span
                    className="ticker-dot"
                    style={{ background: tech.color }}
                  />
                  <span className="ticker-name">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* =============== SECTION =============== */
        .tech-sec {
          position: relative;
          padding: 6rem clamp(0.9rem, 3.5vw, 2rem) 5rem;
          background: linear-gradient(180deg, var(--bg, #faf8ff) 0%, var(--bg2, #ffffff) 100%);
          overflow: hidden;
        }

        [data-theme='dark'] .tech-sec {
          background: linear-gradient(180deg, #0a0718 0%, #130a26 100%);
        }

        .tech-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* Ambient radial blobs */
        .tech-sec::before,
        .tech-sec::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0;
          transition: opacity 1.2s ease;
          pointer-events: none;
          z-index: 1;
        }
        .tech-sec.is-visible::before {
          opacity: 0.35;
        }
        .tech-sec.is-visible::after {
          opacity: 0.28;
        }
        .tech-sec::before {
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, #1bcbf4, transparent 70%);
          top: 15%;
          left: -150px;
        }
        .tech-sec::after {
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, #a05aff, transparent 70%);
          bottom: 10%;
          right: -120px;
        }

        /* =============== HEADER =============== */
        .tech-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3.5rem;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .tech-sec.is-visible .tech-header {
          opacity: 1;
          transform: none;
        }

        .tech-label {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: var(--purple, #a05aff);
          padding: 0.35rem 0.9rem;
          border-radius: 40px;
          border: 1px solid rgba(160, 90, 255, 0.3);
          background: rgba(160, 90, 255, 0.08);
          margin-bottom: 1.1rem;
        }

        .tech-title {
          font-family: var(--font-h, Georgia, serif);
          font-size: clamp(1.9rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.8px;
          color: var(--text, #0c1018);
          margin: 0 0 1rem;
        }

        [data-theme='dark'] .tech-title {
          color: #f0edff;
        }

        .tech-accent {
          background: linear-gradient(135deg, #1bcbf4, #a05aff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tech-subtitle {
          font-size: clamp(0.92rem, 1.2vw, 1rem);
          color: var(--muted, #6b6a8a);
          line-height: 1.75;
          margin: 0;
        }

        /* =============== SHOWCASE LAYOUT =============== */
        .tech-showcase {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 4rem;
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s;
        }
        .tech-sec.is-visible .tech-showcase {
          opacity: 1;
          transform: none;
        }

        /* =============== 3D CUBE =============== */
        .cube-stage {
          position: relative;
          height: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          perspective: 1400px;
          user-select: none;
        }

        .cube-glow {
          position: absolute;
          inset: 10% 15%;
          background: radial-gradient(
            circle at center,
            rgba(27, 203, 244, 0.15),
            transparent 65%
          );
          filter: blur(50px);
          animation: pulseGlow 4s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .cube-rotator {
          position: relative;
          width: 220px;
          height: 220px;
          transform-style: preserve-3d;
          transition: transform 1.1s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .cube-face {
          position: absolute;
          inset: 0;
          width: 220px;
          height: 220px;
          border-radius: 20px;
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--border, #e9e2f8);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          backface-visibility: hidden;
          transition: box-shadow 0.4s ease;
        }

        [data-theme='dark'] .cube-face {
          background: #130a26;
          border-color: rgba(255, 255, 255, 0.08);
        }

        .cube-face-active {
          box-shadow: 0 30px 80px rgba(27, 203, 244, 0.25),
            0 0 0 1px var(--tech-color);
        }

        .cube-face-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          z-index: 2;
        }

        .cube-short {
          font-family: var(--font-h, Georgia, serif);
          font-size: 3rem;
          font-weight: 900;
          line-height: 1;
          color: var(--tech-color);
          letter-spacing: -2px;
        }

        .cube-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text, #0c1018);
          text-align: center;
          padding: 0 1rem;
          letter-spacing: 0.02em;
        }

        [data-theme='dark'] .cube-name {
          color: #f0edff;
        }

        .cube-face-glow {
          position: absolute;
          inset: -1px;
          border-radius: 20px;
          background: radial-gradient(
            circle at 30% 20%,
            var(--tech-color),
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .cube-face-active .cube-face-glow {
          opacity: 0.12;
        }

        /* Cube nav */
        .cube-nav {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-top: 2.5rem;
          z-index: 2;
        }

        .cube-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid var(--border, #e9e2f8);
          background: var(--card-bg, #ffffff);
          color: var(--text, #0c1018);
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cube-btn:hover {
          background: linear-gradient(135deg, #1bcbf4, #a05aff);
          color: #ffffff;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(27, 203, 244, 0.35);
        }

        .cube-counter {
          font-family: var(--font-h, Georgia, serif);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--muted, #6b6a8a);
          letter-spacing: 0.06em;
          min-width: 70px;
          text-align: center;
        }

        .cube-counter-sep {
          opacity: 0.4;
          margin: 0 0.2rem;
        }

        /* =============== DETAIL PANEL =============== */
        .tech-detail {
          position: relative;
          padding: 2.2rem 0 0 2.2rem;
        }

        .detail-accent {
          position: absolute;
          left: 0;
          top: 2.2rem;
          width: 3px;
          height: 60px;
          border-radius: 3px;
          transition: background 0.5s ease;
        }

        .detail-short {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          color: var(--muted, #6b6a8a);
          margin-bottom: 0.8rem;
          text-transform: uppercase;
        }

        .detail-name {
          font-family: var(--font-h, Georgia, serif);
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.5px;
          color: var(--text, #0c1018);
          margin: 0 0 1rem;
        }

        [data-theme='dark'] .detail-name {
          color: #f0edff;
        }

        .detail-desc {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--muted, #6b6a8a);
          margin: 0 0 2rem;
          max-width: 380px;
        }

        .detail-stats {
          display: flex;
          gap: 2rem;
          padding-top: 1.8rem;
          border-top: 1px solid var(--border, #e9e2f8);
        }

        .detail-stat {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .detail-stat-value {
          font-family: var(--font-h, Georgia, serif);
          font-size: 1.2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #1bcbf4, #a05aff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.3px;
        }

        .detail-stat-label {
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--muted, #6b6a8a);
          letter-spacing: 0.02em;
        }

        /* =============== TICKER =============== */
        .tech-ticker {
          position: relative;
          overflow: hidden;
          padding: 1.6rem 0;
          border-top: 1px solid var(--border, #e9e2f8);
          border-bottom: 1px solid var(--border, #e9e2f8);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }

        .tech-ticker-track {
          display: flex;
          gap: 3rem;
          animation: techScroll 45s linear infinite;
          white-space: nowrap;
        }

        .tech-ticker:hover .tech-ticker-track {
          animation-play-state: paused;
        }

        .tech-ticker-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }

        .ticker-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .ticker-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--muted, #6b6a8a);
          letter-spacing: 0.04em;
          transition: color 0.2s ease;
        }

        .tech-ticker-item:hover .ticker-name {
          color: var(--text, #0c1018);
        }

        @keyframes techScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* =============== RESPONSIVE =============== */
        @media (max-width: 900px) {
          .tech-showcase {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .cube-stage {
            height: 380px;
          }

          .cube-rotator,
          .cube-face {
            width: 190px;
            height: 190px;
          }

          .tech-detail {
            padding-left: 1.4rem;
            text-align: center;
          }

          .detail-accent {
            display: none;
          }

          .detail-desc {
            margin-left: auto;
            margin-right: auto;
          }

          .detail-stats {
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .tech-sec {
            padding: 4rem clamp(0.9rem, 3.5vw, 1.4rem) 3.5rem;
          }

          .cube-stage {
            height: 340px;
          }

          .cube-rotator,
          .cube-face {
            width: 160px;
            height: 160px;
          }

          .cube-short {
            font-size: 2.2rem;
          }

          .cube-name {
            font-size: 0.72rem;
          }

          .cube-nav {
            margin-top: 1.8rem;
            gap: 0.8rem;
          }

          .cube-btn {
            width: 38px;
            height: 38px;
            font-size: 1rem;
          }

          .detail-stats {
            flex-direction: column;
            gap: 1rem;
            padding-top: 1.2rem;
          }

          .tech-ticker-track {
            gap: 2rem;
            animation-duration: 35s;
          }

          .ticker-name {
            font-size: 0.75rem;
          }
        }

        /* =============== REDUCED MOTION =============== */
        @media (prefers-reduced-motion: reduce) {
          .cube-rotator,
          .tech-ticker-track,
          .cube-glow {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default OurTechnologies;