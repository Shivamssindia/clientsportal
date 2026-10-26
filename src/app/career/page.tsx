// app/careers/page.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Ttb from '@/components/Ttb'
import HowItWorks from '@/components/HowItWorks'

const CareersPage = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('vis')
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('.fu').forEach((el) => observer.observe(el))
    return () => {
      observer.disconnect()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        {/* =================== HERO =================== */}
        <section className="hero" style={{ minHeight: '50vh' }}>
          <div className="hero-video-wrap">
            <video className="hero-video" autoPlay loop muted playsInline>
              <source src="/video/video02.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-overlay"></div>
          <div
            className="hero-body"
            style={{ paddingTop: 'calc(var(--nav-h) + 4rem)', paddingBottom: '2rem' }}
          >
            <div className="hero-badge">
              <span className="bp"></span> Careers at SoftMax
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
              <span className="g1">Work With Us</span>
            </h1>
            <p className="hero-desc">
              Be part of India's next generation of AI-powered digital engineering —
              build meaningful software, solve real business problems, deliver
              measurable ROI.
            </p>
            <div className="hero-btns" style={{ marginTop: '1.5rem' }}>
              <a
                className="btn-prim"
                href="https://careers.softmax.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-briefcase"></i> Apply Now
              </a>
            </div>
          </div>
        </section>

        {/* =================== HOW IT WORKS / PARTNERSHIP =================== */}
        <HowItWorks />

        {/* =================== WHY SOFTMAX =================== */}
        <section className="about-sec">
          <div className="sec-inner sec-c">
            <div className="sec-label fu">
              <i className="fas fa-gift"></i> Why SoftMax
            </div>
            <h2 className="sec-title fu d1">Culture &amp; Benefits</h2>
            <p className="sec-sub fu d2">
              We build high-velocity systems for our clients — and a high-velocity
              culture for our people. Every engineer, designer, and strategist is a
              partner in the outcome.
            </p>
          </div>
          <div className="sec-inner">
            <div
              className="av-row"
              style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '.9rem' }}
            >
              <div className="av-card fu">
                <div className="av-icon">🎯</div>
                <h4>ROI-First Mindset</h4>
                <p>
                  Every line of code, every design decision is measured against real
                  business impact — not vanity metrics.
                </p>
              </div>
              <div className="av-card fu d1">
                <div className="av-icon">🧠</div>
                <h4>AI-First Engineering</h4>
                <p>
                  Ship AI-powered features from day one. Work with Spring AI, LLMs,
                  RAG, and modern ML pipelines.
                </p>
              </div>
              <div className="av-card fu d2">
                <div className="av-icon">🌐</div>
                <h4>Modern Tech Stack</h4>
                <p>
                  Flutter, Next.js, Spring Boot, Spring AI, WebRTC, WebSocket,
                  Kubernetes and Cloud DevOps.
                </p>
              </div>
            </div>
            <div
              className="av-row"
              style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '.9rem' }}
            >
              <div className="av-card fu d1">
                <div className="av-icon">📈</div>
                <h4>Real Ownership</h4>
                <p>
                  Flat hierarchy, direct client visibility, and clear career paths
                  backed by measurable delivery.
                </p>
              </div>
              <div className="av-card fu d2">
                <div className="av-icon">🛡️</div>
                <h4>Transparent Culture</h4>
                <p>
                  Live dashboards, honest deadlines, and zero-blame postmortems. No
                  political noise.
                </p>
              </div>
              <div className="av-card fu d3">
                <div className="av-icon">🎓</div>
                <h4>Continuous Learning</h4>
                <p>
                  Access to AI courses, cloud certifications, and hands-on R&amp;D
                  projects.
                </p>
              </div>
            </div>
            <div className="av-row" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              <div className="av-card fu d2">
                <div className="av-icon">⚡</div>
                <h4>Sub-Second Standards</h4>
                <p>
                  We ship products engineered for sub-second response — that
                  discipline flows into how we work.
                </p>
              </div>
              <div className="av-card fu d3">
                <div className="av-icon">🤝</div>
                <h4>Remote-Friendly</h4>
                <p>
                  Flexible hours, distributed teams, and outcome-driven expectations
                  — not clock-in watching.
                </p>
              </div>
              <div className="av-card fu d4">
                <div className="av-icon">🏆</div>
                <h4>Impact You Can See</h4>
                <p>
                  Direct visibility into the ROI your work generates — the same live
                  dashboards clients see.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================== FAQ =================== */}
        <section className="how-sec">
          <div className="sec-inner sec-c">
            <div className="sec-label fu">
              <i className="fas fa-question-circle"></i> FAQ
            </div>
            <h2 className="sec-title fu d1">Frequently Asked Questions</h2>
            <p className="sec-sub fu d2">
              Everything you need to know about working with SoftMax.
            </p>
          </div>
          <div className="sec-inner dual-grid">
            <div className="dual-card fu d1">
              <div className="dual-icon di-b">
                <i className="fas fa-clock"></i>
              </div>
              <h3>How do I get started?</h3>
              <p>
                Sign in with Google, complete your profile, and our team will review
                your details. Once approved, you get full access to the SoftMax
                Client Portal.
              </p>
            </div>
            <div className="dual-card fu d2">
              <div className="dual-icon di-g">
                <i className="fas fa-file-contract"></i>
              </div>
              <h3>How long does verification take?</h3>
              <p>
                Applications are typically reviewed within 24–48 hours. You'll get
                an email as soon as your profile is approved.
              </p>
            </div>
            <div className="dual-card fu d1">
              <div className="dual-icon di-b">
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <h3>How does payment work?</h3>
              <p>
                All client payments are milestone-based, escrow-protected, and
                reviewed by our finance team before approval — full transparency at
                every step.
              </p>
            </div>
            <div className="dual-card fu d2">
              <div className="dual-icon di-g">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Can I work remotely?</h3>
              <p>
                Yes — SoftMax is remote-first. On-site requirements are clearly
                specified in each project brief so you know upfront.
              </p>
            </div>
            <div className="dual-card fu d1">
              <div className="dual-icon di-b">
                <i className="fas fa-star"></i>
              </div>
              <h3>What tech stack will I work with?</h3>
              <p>
                Flutter, Kotlin, Next.js, Spring Boot, Spring AI, WebRTC, WebSocket,
                Machine Learning, and Cloud DevOps — chosen per project for
                performance.
              </p>
            </div>
            <div className="dual-card fu d2">
              <div className="dual-icon di-g">
                <i className="fas fa-users"></i>
              </div>
              <h3>How is the team structured?</h3>
              <p>
                Small cross-functional teams — engineering, design, AI, QA — each
                paired with a Project Manager and tracked through our live client
                portal.
              </p>
            </div>
          </div>
        </section>

        {/* =================== CTA =================== */}
        <section className="cta-sec">
          <div className="cta-box fu">
            <div className="cta-text">
              <div className="sec-label" style={{ marginBottom: '.7rem' }}>
                <i className="fas fa-bolt"></i> Join SoftMax
              </div>
              <h2>
                Ready to Build Something<br />
                That Actually Matters?
              </h2>
              <p>
                Whether you're a growing business with a real problem to solve or a
                partner ready to deliver AI-powered systems — SoftMax is your
                platform.
              </p>
            </div>
            <div className="cta-actions">
              <a
                className="btn-prim"
                href="https://careers.softmax.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-briefcase"></i> Apply Now
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Ttb />

      <style>{`
        @media (max-width: 768px) {
          .av-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

export default CareersPage