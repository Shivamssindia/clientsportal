// app/service/page.tsx
'use client'

import React, { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Ttb from '@/components/Ttb'
import Link from 'next/link'
import Services from '@/components/Services'

const ServicePage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis')
          }
        })
      },
      { threshold: 0.15 }
    )

    document.querySelectorAll('.fu').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <section className="hero" style={{ minHeight: '50vh' }}>
          <div className="hero-video-wrap">
            <video className="hero-video" autoPlay loop muted playsInline>
              <source src="video/video01.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-body" style={{ paddingTop: 'calc(var(--nav-h) + 4rem)', paddingBottom: '2rem' }}>
            <div className="hero-badge"><span className="bp"></span> What We Offer</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
              Our <span className="g1">Solutions</span>
            </h1>
            <p className="hero-desc">
              AI-powered, scalable digital systems for businesses across industries — from patient management and online booking to agriculture AI and warehouse systems, all engineered for measurable ROI.
            </p>
          </div>
        </section>

        <Services/>

        <section className="cta-sec">
          <div className="cta-box fu">
            <div className="cta-text">
              <div className="sec-label" style={{ marginBottom: '.7rem' }}>
                <i className="fas fa-bolt"></i> Get Started
              </div>
              <h2>Ready to Solve Your Business Problem?</h2>
              <p>Tell us the challenge. We'll analyse it and propose the right technical solution — with transparent tracking through our client portal.</p>
            </div>
            <div className="cta-actions">
              <Link href="/#how" className="btn-prim">
                <i className="fas fa-paper-plane"></i> Start Your Project
              </Link>
              <a href="/contact" className="btn-ghost">
                <i className="fas fa-phone-alt"></i> Talk to Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Ttb />
    </>
  )
}

export default ServicePage