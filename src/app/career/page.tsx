// app/careers/page.tsx
'use client'

import React, { useEffect, useState, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Ttb from '@/components/Ttb'
import { Role, useAuth } from '@/contexts/AuthContext'
import { openModalClient, openModalConsult, switchToSignIn, switchToSignUp } from '@/Script'
import axios from 'axios'
import HowItWorks from '@/components/HowItWorks'
import ModalClient from '@/components/ModalClient'
import ModalConsult from '@/components/ModelConsult'

const CareersPage = () => {
  const { user } = useAuth()
  const [loadingClient, setLoadingClient] = useState(false)
  const [loadingConsultant, setLoadingConsultant] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupType, setPopupType] = useState<'error' | 'info' | 'warning' | 'success'>('warning')
  const timeoutRef = useRef<NodeJS.Timeout>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

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

  const getUserRoles = async () => {
    if (!user) return []
    try {
      const response = await axios.get(`${API_BASE}/api/auth/me`, { withCredentials: true })
      return response.data?.roles || []
    } catch { return [] }
  }

  const showNotification = (message: string, type: 'error' | 'info' | 'warning' | 'success' = 'warning') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setPopupMessage(message)
    setPopupType(type)
    setShowPopup(true)
    timeoutRef.current = setTimeout(() => setShowPopup(false), 4000)
  }

  const handleBecomeClient = async () => {
    if (!user) { window.triggerGoogleLogin?.(); return }
    setLoadingClient(true)
    try {
      const roles = await getUserRoles()
      if (!roles || roles.length === 0) { openModalClient(); switchToSignIn(); return }
      const hasClientRole = roles.some((r: Role) => r.ptype === 'CLIENT')
      if (hasClientRole) {
        const cr = roles.find((r: Role) => r.ptype === 'CLIENT')
        if (cr?.isApproved === 'APPROVED') showNotification("✅ You are already an approved client!", 'success')
        else if (cr?.isApproved === 'PENDING') showNotification("⏳ Your client application is pending approval!", 'info')
        else showNotification("❌ Your client application was rejected!", 'error')
        return
      }
      openModalClient(); switchToSignIn()
    } catch { showNotification("Something went wrong.", 'error') }
    finally { setLoadingClient(false) }
  }

  const handleJoinConsultant = async () => {
    if (!user) { window.triggerGoogleLogin?.(); return }
    setLoadingConsultant(true)
    try {
      const roles = await getUserRoles()
      console.log(roles)
      if (!roles || roles.length === 0) { openModalConsult(); switchToSignUp(); return }
      const hasConsultantRole = roles.some((r: Role) => r.ptype === 'CONSULTANT')
      if (hasConsultantRole) {
        const cr = roles.find((r: Role) => r.ptype === 'CONSULTANT')
        if (cr?.isApproved === 'APPROVED') showNotification("✅ You are already an approved consultant!", 'success')
        else if (cr?.isApproved === 'PENDING') showNotification("⏳ Your consultant application is pending approval!", 'info')
        else showNotification("❌ Your consultant application was rejected!", 'error')
        return
      }
      openModalConsult(); switchToSignUp()
    } catch { showNotification("Something went wrong.", 'error') }
    finally { setLoadingConsultant(false) }
  }

  const getBorderColor = () => {
    if (popupType === 'error') return '#ef4444'
    if (popupType === 'success') return '#10b981'
    if (popupType === 'info') return '#3b82f6'
    return '#f59e0b'
  }

  const getIcon = () => {
    if (popupType === 'error') return '❌'
    if (popupType === 'success') return '✅'
    if (popupType === 'info') return 'ℹ️'
    return '⚠️'
  }

  return (
    <>
      {showPopup && (
        <div className={`role-check-popup ${popupType}`}>
          <div className="popup-content" style={{ borderLeftColor: getBorderColor() }}>
            <span className="popup-icon">{getIcon()}</span>
            <p>{popupMessage}</p>
            <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
          </div>
        </div>
      )}

      <Navbar />
      <main>
        {/* =================== HERO =================== */}
        <section className="hero" style={{ minHeight: '50vh' }}>
          <div className="hero-video-wrap">
            <video className="hero-video" autoPlay loop muted playsInline>
              <source src="video/video02.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-body" style={{ paddingTop: 'calc(var(--nav-h) + 4rem)', paddingBottom: '2rem' }}>
            <div className="hero-badge"><span className="bp"></span> Join Our Network</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
              <span className="g1">Careers</span> at Gaurion
            </h1>
            <p className="hero-desc">
              Be part of India&apos;s most intelligent consulting platform — as a client or consultant.
            </p>
          </div>
        </section>

        {/* =================== TWO PATHWAYS =================== */}
        {/* <section className="how-sec">
          <div className="sec-inner sec-c">
            <div className="sec-label fu"><i className="fas fa-user-plus"></i> Work With Us</div>
            <h2 className="sec-title fu d1">Two Ways to Join</h2>
            <p className="sec-sub fu d2">Choose your path and become part of the Gaurion Bharat ecosystem.</p>
          </div>
          <div className="sec-inner dual-grid">
            <div className="dual-card fu d1">
              <div className="dual-icon di-b"><i className="fas fa-building"></i></div>
              <h3>Become a Client</h3>
              <p>Post requirements, get AI-matched with top consultants, and track every deliverable through live KPI dashboards.</p>
              <ul className="step-list">
                <li><span className="sn sn-b">1</span>Create your company profile</li>
                <li><span className="sn sn-b">2</span>Post project requirements</li>
                <li><span className="sn sn-b">3</span>Get matched with top consultants</li>
                <li><span className="sn sn-b">4</span>Track progress in real-time</li>
              </ul>
              <button className="btn-cn" onClick={handleBecomeClient} disabled={loadingClient}>
                {loadingClient ? <span className="loading-spinner"></span> : <i className="fas fa-rocket"></i>}
                Become a Client
              </button>
            </div>
            <div className="dual-card fu d2">
              <div className="dual-icon di-g"><i className="fas fa-user-tie"></i></div>
              <h3>Join as Consultant</h3>
              <p>Build your verified profile, complete assessments, and get AI-matched with projects that fit your expertise.</p>
              <ul className="step-list">
                <li><span className="sn sn-g">1</span>Create your consultant profile</li>
                <li><span className="sn sn-g">2</span>Complete skill assessments</li>
                <li><span className="sn sn-g">3</span>Get verified by our team</li>
                <li><span className="sn sn-g">4</span>Start receiving project matches</li>
              </ul>
              <button className="btn-cn" onClick={handleJoinConsultant} disabled={loadingConsultant}>
                {loadingConsultant ? <span className="loading-spinner"></span> : <i className="fas fa-user-plus"></i>}
                Join as Consultant
              </button>
            </div>
          </div>
        </section> */}
        <HowItWorks/>
        <ModalClient />
        <ModalConsult />

        {/* =================== CONSULTANT BENEFITS =================== */}
        <section className="about-sec">
          <div className="sec-inner sec-c">
            <div className="sec-label fu"><i className="fas fa-gift"></i> Consultant Benefits</div>
            <h2 className="sec-title fu d1">Why Consult With Gaurion?</h2>
            <p className="sec-sub fu d2">We invest in your success with tools, support, and opportunities designed for independent consultants.</p>
          </div>
          <div className="sec-inner">
            <div className="av-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '.9rem' }}>
              <div className="av-card fu">
                <div className="av-icon">💰</div>
                <h4>Competitive Payouts</h4>
                <p>Earn industry-leading rates with milestone-based payments secured by escrow protection.</p>
              </div>
              <div className="av-card fu d1">
                <div className="av-icon">🎯</div>
                <h4>Smart Project Matching</h4>
                <p>AI engine matches you with projects aligned to your skills, experience, and preferences.</p>
              </div>
              <div className="av-card fu d2">
                <div className="av-icon">🌐</div>
                <h4>Pan-India Opportunities</h4>
                <p>Work with enterprises across 15+ states — MSMEs, corporates, and government bodies.</p>
              </div>
            </div>
            <div className="av-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '.9rem' }}>
              <div className="av-card fu d1">
                <div className="av-icon">📈</div>
                <h4>Reputation Scoring</h4>
                <p>Build a verified profile with client ratings that unlock premium project opportunities.</p>
              </div>
              <div className="av-card fu d2">
                <div className="av-icon">🛡️</div>
                <h4>Payment Protection</h4>
                <p>100% escrow-backed payments — focus on delivery, we handle the collections.</p>
              </div>
              <div className="av-card fu d3">
                <div className="av-icon">🎓</div>
                <h4>Upskilling Support</h4>
                <p>Access exclusive workshops, certifications, and domain training programs.</p>
              </div>
            </div>
            <div className="av-row" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              <div className="av-card fu d2">
                <div className="av-icon">⚡</div>
                <h4>Fast Onboarding</h4>
                <p>Get verified and start receiving matches within 48 hours of profile completion.</p>
              </div>
              <div className="av-card fu d3">
                <div className="av-icon">🤝</div>
                <h4>Dedicated Support</h4>
                <p>Personal account manager for top-rated consultants to help grow your practice.</p>
              </div>
              <div className="av-card fu d4">
                <div className="av-icon">🏆</div>
                <h4>Flexible Engagements</h4>
                <p>Choose project-based, retainer, or managed engagements that fit your schedule.</p>
              </div>
            </div>
          </div>
        </section>
        

        {/* =================== FAQ =================== */}
        <section className="how-sec">
          <div className="sec-inner sec-c">
            <div className="sec-label fu"><i className="fas fa-question-circle"></i> FAQ</div>
            <h2 className="sec-title fu d1">Frequently Asked Questions</h2>
            <p className="sec-sub fu d2">Everything you need to know about joining Gaurion Bharat.</p>
          </div>
          <div className="sec-inner dual-grid">
            <div className="dual-card fu d1">
              <div className="dual-icon di-b"><i className="fas fa-clock"></i></div>
              <h3>How long does verification take?</h3>
              <p>Consultant profiles are typically verified within 24-48 hours. Client company verification takes 1-3 business days depending on documentation completeness.</p>
            </div>
            <div className="dual-card fu d2">
              <div className="dual-icon di-g"><i className="fas fa-file-contract"></i></div>
              <h3>Is there any joining fee?</h3>
              <p>No. Creating a profile is completely free for both clients and consultants. We only charge a platform fee on successfully completed projects with delivered milestones.</p>
            </div>
            <div className="dual-card fu d1">
              <div className="dual-icon di-b"><i className="fas fa-hand-holding-usd"></i></div>
              <h3>How does payment work?</h3>
              <p>All payments are milestone-based and held in escrow. Consultants submit deliverables → client approves → funds released. No chasing invoices.</p>
            </div>
            <div className="dual-card fu d2">
              <div className="dual-icon di-g"><i className="fas fa-map-marker-alt"></i></div>
              <h3>Can I work remotely?</h3>
              <p>Absolutely. Most engagements are remote-first. On-site requirements are clearly mentioned in project briefs so you can choose accordingly.</p>
            </div>
            <div className="dual-card fu d1">
              <div className="dual-icon di-b"><i className="fas fa-star"></i></div>
              <h3>How are consultants rated?</h3>
              <p>Clients rate consultants on delivery quality, timeliness, and communication after each milestone. These ratings build your reputation score and unlock premium projects.</p>
            </div>
            <div className="dual-card fu d2">
              <div className="dual-icon di-g"><i className="fas fa-users"></i></div>
              <h3>Can I work on multiple projects?</h3>
              <p>Yes! You can take on multiple simultaneous projects as long as you meet all delivery commitments. Your dashboard helps manage all active engagements.</p>
            </div>
          </div>
        </section>

        {/* =================== CTA =================== */}
        <section className="cta-sec">
          <div className="cta-box fu">
            <div className="cta-text">
              <div className="sec-label" style={{ marginBottom: '.7rem' }}>
                <i className="fas fa-bolt"></i> Join Our Mission
              </div>
              <h2>Ready to Be Part of<br />India&apos;s Growth Story?</h2>
              <p>Whether you&apos;re an enterprise seeking strategic expertise or a consultant ready to make an impact — Gaurion Bharat is your platform.</p>
            </div>
            <div className="cta-actions">
              <button className="btn-prim" onClick={handleBecomeClient} disabled={loadingClient}>
                {loadingClient ? <span className="loading-spinner"></span> : <i className="fas fa-rocket"></i>}
                Become a Client
              </button>
              <button className="btn-ghost" onClick={handleJoinConsultant} disabled={loadingConsultant}>
                {loadingConsultant ? <span className="loading-spinner"></span> : <i className="fas fa-user-tie"></i>}
                Join as Consultant
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Ttb />

      <style jsx>{`
        .role-check-popup { position: fixed; top: 20px; right: 20px; z-index: 10000; animation: slideInRight 0.3s ease-out; }
        .popup-content { display: flex; align-items: center; gap: 12px; background: var(--card-bg, #ffffff); border-left: 4px solid #f59e0b; border-radius: 12px; padding: 14px 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); min-width: 320px; max-width: 420px; }
        .role-check-popup.error .popup-content { background: linear-gradient(135deg, #fff5f5, #ffffff); }
        .role-check-popup.warning .popup-content { background: linear-gradient(135deg, #fffbeb, #ffffff); }
        .role-check-popup.info .popup-content { background: linear-gradient(135deg, #eff6ff, #ffffff); }
        .role-check-popup.success .popup-content { background: linear-gradient(135deg, #ecfdf5, #ffffff); }
        .popup-icon { font-size: 24px; }
        .popup-content p { flex: 1; margin: 0; font-size: 13px; color: #1f2937; }
        .popup-close { background: transparent; border: none; font-size: 20px; cursor: pointer; color: #6b7280; width: 24px; height: 24px; border-radius: 50%; transition: all 0.2s; }
        .popup-close:hover { background: rgba(0,0,0,0.05); color: #ef4444; }
        .loading-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.6s linear infinite; margin-right: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        button:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 640px) {
          .role-check-popup { top: 10px; right: 10px; left: 10px; }
          .popup-content { min-width: auto; width: calc(100% - 20px); }
        }
        @media (max-width: 768px) {
          .av-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

export default CareersPage