"use client";

import React, { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const HowItWorks = () => {
    const router = useRouter();
    const { user } = useAuth();

    const handleStartPartnership = () => {
        if (!user) {
            // Login nahi hai → Google login popup
            window.triggerGoogleLogin?.();
            return;
        }
        // Login hai → dashboard
        router.push('/dashboard');
    };

    return (
        <section id="how" className="how-sec">
            <div className="sec-inner sec-c">
                <div className="sec-label"><i className="fas fa-handshake"></i> Partnership Program</div>
                <h2 className="sec-title fu d1">Let's Build <span className="highlight">Something Together</span></h2>
                <p className="sec-sub fu d2">
                    A transparent partnership where your business problem becomes our engineering mission —
                    with measurable outcomes at every step.
                </p>
            </div>

            <div className="sec-inner">
                <div className="partner-card fu d1">
                    {/* Left: Content */}
                    <div className="partner-left">
                        <div className="partner-badge">
                            <span className="partner-badge-dot"></span>
                            For Growing Businesses
                        </div>

                        <h3 className="partner-title">
                            Turn your business problem into a <span className="highlight">measurable result</span>
                        </h3>

                        <p className="partner-desc">
                            Tell us the challenge. We analyse it, design the technical solution,
                            build it with AI and modern engineering — and give you a live client
                            portal to track every milestone, metric, and rupee of ROI.
                        </p>

                        <ul className="partner-steps">
                            <li>
                                <span className="step-num">1</span>
                                <div className="step-content">
                                    <strong>Share the problem</strong>
                                    <span>Your business goals, constraints, and what success looks like.</span>
                                </div>
                            </li>
                            <li>
                                <span className="step-num">2</span>
                                <div className="step-content">
                                    <strong>We analyse & propose</strong>
                                    <span>The right solution, tech stack, timeline, and expected ROI.</span>
                                </div>
                            </li>
                            <li>
                                <span className="step-num">3</span>
                                <div className="step-content">
                                    <strong>Design & build</strong>
                                    <span>AI-powered, scalable systems engineered to perform.</span>
                                </div>
                            </li>
                            <li>
                                <span className="step-num">4</span>
                                <div className="step-content">
                                    <strong>Track live</strong>
                                    <span>Milestones, progress, and ROI — visible in your client portal.</span>
                                </div>
                            </li>
                        </ul>

                        <button
                            className="partner-cta"
                            onClick={handleStartPartnership}
                        >
                            <i className="fas fa-paper-plane"></i>
                            Start Your Partnership
                            <span className="cta-arrow">→</span>
                        </button>
                    </div>

                    {/* Right: Trust panel */}
                    <div className="partner-right">
                        <div className="trust-card">
                            <div className="trust-icon">🎯</div>
                            <div className="trust-value">ROI-First</div>
                            <div className="trust-label">Every solution measured by business impact</div>
                        </div>

                        <div className="trust-card">
                            <div className="trust-icon">⏱️</div>
                            <div className="trust-value">Sub-Second</div>
                            <div className="trust-label">Response times — engineered under pressure</div>
                        </div>

                        <div className="trust-card">
                            <div className="trust-icon">🔍</div>
                            <div className="trust-value">100% Transparent</div>
                            <div className="trust-label">Live client portal with full project visibility</div>
                        </div>

                        <div className="trust-card highlight-card">
                            <div className="trust-icon">🚀</div>
                            <div className="trust-value">Built to Scale</div>
                            <div className="trust-label">
                                Modern stack: Flutter · Next.js · Spring Boot · Spring AI · Cloud DevOps
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .highlight {
                    background: linear-gradient(135deg, #2ca6a4, #34a853);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .partner-card {
                    display: grid;
                    grid-template-columns: 1.4fr 1fr;
                    gap: 32px;
                    background: var(--card-bg, #ffffff);
                    border: 1px solid var(--border, #e0e6f0);
                    border-radius: 28px;
                    padding: 44px 40px;
                    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.06);
                    position: relative;
                    overflow: hidden;
                }

                .partner-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 320px;
                    height: 320px;
                    background: radial-gradient(circle, rgba(44, 166, 164, 0.08), transparent 70%);
                    pointer-events: none;
                }

                .partner-left {
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    z-index: 1;
                }

                .partner-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border-radius: 40px;
                    background: rgba(44, 166, 164, 0.1);
                    border: 1px solid rgba(44, 166, 164, 0.25);
                    color: var(--teal, #2ca6a4);
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    width: fit-content;
                    margin-bottom: 18px;
                }

                .partner-badge-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--teal, #2ca6a4);
                    animation: pulse-dot 1.6s ease-in-out infinite;
                }

                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.7); }
                }

                .partner-title {
                    font-family: var(--font-h, 'Fraunces', Georgia, serif);
                    font-size: clamp(1.7rem, 2.6vw, 2.2rem);
                    font-weight: 900;
                    line-height: 1.2;
                    letter-spacing: -0.6px;
                    color: var(--text2, #1e2535);
                    margin-bottom: 14px;
                }

                .partner-desc {
                    font-size: 0.95rem;
                    line-height: 1.75;
                    color: var(--muted, #5e6f8a);
                    margin-bottom: 26px;
                    max-width: 520px;
                }

                .partner-steps {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    margin-bottom: 32px;
                }

                .partner-steps li {
                    display: flex;
                    gap: 14px;
                    align-items: flex-start;
                }

                .step-num {
                    min-width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 900;
                    color: #fff;
                    background: linear-gradient(135deg, #2ca6a4, #34a853);
                    box-shadow: 0 3px 10px rgba(44, 166, 164, 0.3);
                    flex-shrink: 0;
                }

                .step-content {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .step-content strong {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: var(--text2, #1e2535);
                }

                .step-content span {
                    font-size: 0.82rem;
                    color: var(--muted, #5e6f8a);
                    line-height: 1.5;
                }

                .partner-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 15px 32px;
                    border-radius: 40px;
                    background: linear-gradient(135deg, #2ca6a4 0%, #34a853 100%);
                    color: #fff;
                    font-size: 15px;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 6px 24px rgba(44, 166, 164, 0.35);
                    width: fit-content;
                }

                .partner-cta:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 32px rgba(44, 166, 164, 0.5);
                }

                .partner-cta .cta-arrow {
                    transition: transform 0.3s ease;
                }

                .partner-cta:hover:not(:disabled) .cta-arrow {
                    transform: translateX(4px);
                }

                .partner-right {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    position: relative;
                    z-index: 1;
                }

                .trust-card {
                    background: var(--surface, rgba(0, 0, 0, 0.02));
                    border: 1px solid var(--border, #e0e6f0);
                    border-radius: 18px;
                    padding: 18px 20px;
                    transition: all 0.3s ease;
                }

                .trust-card:hover {
                    transform: translateY(-3px);
                    border-color: rgba(44, 166, 164, 0.3);
                    box-shadow: 0 6px 20px rgba(44, 166, 164, 0.12);
                }

                .trust-icon {
                    font-size: 22px;
                    margin-bottom: 8px;
                }

                .trust-value {
                    font-size: 1.05rem;
                    font-weight: 800;
                    color: var(--text2, #1e2535);
                    margin-bottom: 4px;
                }

                .trust-label {
                    font-size: 0.78rem;
                    color: var(--muted, #5e6f8a);
                    line-height: 1.5;
                }

                .highlight-card {
                    background: linear-gradient(135deg, rgba(44, 166, 164, 0.08), rgba(52, 168, 83, 0.04));
                    border-color: rgba(44, 166, 164, 0.25);
                }

                .highlight-card .trust-value {
                    color: var(--teal, #2ca6a4);
                }

                @media (max-width: 960px) {
                    .partner-card {
                        grid-template-columns: 1fr;
                        padding: 36px 32px;
                        gap: 28px;
                    }
                    .partner-right {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 12px;
                    }
                }

                @media (max-width: 640px) {
                    .partner-card {
                        padding: 28px 22px;
                        border-radius: 22px;
                        gap: 24px;
                    }
                    .partner-title {
                        font-size: 1.5rem;
                    }
                    .partner-desc {
                        font-size: 0.9rem;
                    }
                    .partner-cta {
                        width: 100%;
                        justify-content: center;
                        font-size: 14px;
                        padding: 14px 24px;
                    }
                    .partner-right {
                        grid-template-columns: 1fr;
                    }
                    .trust-card {
                        padding: 16px;
                    }
                }
            `}</style>
        </section>
    )
}

export default HowItWorks;