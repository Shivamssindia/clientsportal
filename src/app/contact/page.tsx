// app/contact/page.tsx

'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Ttb from '@/components/Ttb'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'

interface MailData {
  intrest: string
  msg: string
}

const ContactPage = () => {
  const [msgData, setMailData] = useState<MailData>({
    intrest: '',
    msg: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const {user} = useAuth()

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

  const handleInterestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    
    const sectorMap: { [key: string]: string } = {
      agriculture: 'Agriculture & Allied',
      education: 'Education',
      government: 'Government',
      healthcare: 'Healthcare',
      infrastructure: 'Infrastructure',
      msme: 'MSME & Startups',
      manufacturing: 'Manufacturing',
      retail: 'Retail & E-commerce',
      logistics: 'Logistics & Warehousing',
      csr: 'CSR',
      other: 'Other / General Query'
    }
    
    setMailData((prev) => ({ 
      ...prev, 
      intrest: sectorMap[value] || value 
    }))
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMailData((prev) => ({ ...prev, msg: e.target.value }))
  }

  const getSelectedInterest = () => {
    const sectors: { [key: string]: string } = {
      agriculture: 'Agriculture & Allied',
      education: 'Education',
      government: 'Government',
      healthcare: 'Healthcare',
      infrastructure: 'Infrastructure',
      msme: 'MSME & Startups',
      manufacturing: 'Manufacturing',
      retail: 'Retail & E-commerce',
      logistics: 'Logistics & Warehousing',
      csr: 'CSR',
      other: 'Other / General Query'
    }
    
    for (const [key, label] of Object.entries(sectors)) {
      if (msgData.intrest === label) {
        return key
      }
    }
    return ''
  }

  const HandleMail = async () => {
    console.log('Mail Data being sent:', msgData)

    if (!msgData.intrest) {
      alert('Please select an interest area.')
      return
    }
    if (!msgData.msg || msgData.msg.trim() === '') {
      alert('Please enter your message.')
      return
    }

    setIsLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

      const response = await axios.post(`${API_URL}/api/mail/send-inquiry`, msgData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.data.success === true) {
        alert(response.data.message || 'Message sent successfully! Our team will get back to you soon.')
        setMailData({ intrest: '', msg: '' })
      } else {
        alert(response.data.message || 'Failed to send message. Please try again later.')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || 'Failed to send message. Please try again later.'
        alert(errorMessage)
      } else {
        alert('Network error. Please check your connection and try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="hero" style={{ minHeight: '50vh' }}>
          <div className="hero-video-wrap">
            <video className="hero-video" autoPlay loop muted playsInline>
              <source src="video/video02.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-body" style={{ paddingTop: 'calc(var(--nav-h) + 4rem)', paddingBottom: '2rem' }}>
            <div className="hero-badge"><span className="bp"></span> Get In Touch</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
              <span className="g1">We're Here</span> to Help
            </h1>
            <p className="hero-desc">
              Have a business problem, need a technical solution, or just want to share feedback? Our team personally reads every message and responds with real answers, not automated replies.
            </p>
          </div>
        </section>

        <section className="about-sec">
          <div className="sec-inner">
            <div className="about-grid">
              <div className="about-text fu">
                <div className="sec-label"><i className="fas fa-envelope"></i> Send a Message</div>
                <h2 className="sec-title">Share Anything<br />With Us 💬</h2>
                
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)',
                  padding: '1.2rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  borderLeft: '4px solid #6366f1'
                }}>
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '0.5rem', fontWeight: '500' }}>
                    📢 Open Platform for Everyone
                  </p>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '0.25rem' }}>
                    Whether it's a <strong>business problem, technical issue, feature request, bug report, feedback,</strong> or just <strong>any thought</strong> you want to share — 
                    we're all ears.
                  </p>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.75rem', color: 'var(--text-light)' }}>
                    ⭐ Your message goes directly to our <strong>Core Team</strong> — expect a personal response, not an automated reply.
                  </p>
                </div>

                <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
                  👇 Select the relevant sector (or choose "Other") and write your message below:
                </p>

                <div className="m-form" style={{ marginTop: '0rem' }}>
                  <select
                    value={getSelectedInterest()}
                    onChange={handleInterestChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--input-bg)',
                      color: 'var(--text)',
                      marginBottom: '1rem',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="" disabled>Select Sector / Type of Query</option>
                    <option value="agriculture">Agriculture &amp; Allied</option>
                    <option value="education">Education</option>
                    <option value="government">Government</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="msme">MSME &amp; Startups</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail &amp; E-commerce</option>
                    <option value="logistics">Logistics &amp; Warehousing</option>
                    <option value="csr">CSR</option>
                    <option value="other">Other / General Query / Feedback</option>
                  </select>
                  
                  <textarea
                    placeholder="Example: I need a patient management system... | I want an online booking platform... | I need AI-based agriculture software... | I need a warehouse management system... | Here's my feedback..."
                    style={{
                      minHeight: '140px',
                      padding: '12px',
                      resize: 'vertical',
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--input-bg)',
                      color: 'var(--text)',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                      marginBottom: '1rem'
                    }}
                    value={msgData.msg}
                    onChange={handleMessageChange}
                    required
                  />
                  
                  {user ? <>
                  <button
                    className="btn-msub"
                    onClick={HandleMail}
                    disabled={isLoading}
                    style={{
                      opacity: isLoading ? 0.7 : 1,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      width: '100%'
                    }}
                  >
                    {isLoading ? 'Sending...' : 'Send Message to SoftMax →'}
                  </button>
                  </>:<>
                  <button
                    className="btn-msub"
                    onClick={() => window.triggerGoogleLogin?.()}
                    disabled={isLoading}
                    style={{
                      opacity: isLoading ? 0.7 : 1,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      width: '100%'
                    }}
                  >
                    Login to Send Message →
                  </button>
                  </>}
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  marginTop: '1.5rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--text-light)'
                }}>
                  <span>✅ Direct to Core Team</span>
                  <span>⚡ Response within 24h</span>
                  <span>🔒 Confidential</span>
                  <span>🎯 No Spam, Ever</span>
                </div>
              </div>

              <div className="about-visual fu d2">
                <div className="av-row">
                  <div className="av-card">
                    <div className="av-icon">🌐</div>
                    <h4>Client Portal</h4>
                    <p>clients.softmax.in</p>
                  </div>
                  <div className="av-card">
                    <div className="av-icon">📧</div>
                    <h4>Email Us</h4>
                    <p>support.softmax@gmail.com</p>
                  </div>
                </div>
                <div className="av-row">
                  <div className="av-card">
                    <div className="av-icon">📧</div>
                    <h4>Business Enquiries</h4>
                    <p>softmaxdigitals@gmail.com</p>
                  </div>
                  <div className="av-card">
                    <div className="av-icon">⏰</div>
                    <h4>Working Mode</h4>
                    <p>Remote First • Global Delivery</p>
                  </div>
                </div>
                <div className="av-hero">
                  <div className="av-hero-num">Direct Access</div>
                  <div className="av-hero-lbl">Your message reaches the SoftMax core team directly</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Ttb />
    </>
  )
}

export default ContactPage