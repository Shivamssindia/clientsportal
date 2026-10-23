// @ts-nocheck
import React, { useRef, useEffect } from 'react'
import axios from 'axios';
import { Role, useAuth } from '@/contexts/AuthContext';
import { openModalClient, switchToSignIn } from '@/Script'

const HowItWorks = () => {
    const [loadingClient, setLoadingClient] = React.useState(false);
    const [showPopup, setShowPopup] = React.useState(false);
    const [popupMessage, setPopupMessage] = React.useState('');
    const [popupType, setPopupType] = React.useState<'error' | 'info' | 'warning' | 'success'>('warning');
    const timeoutRef = useRef<NodeJS.Timeout>(null);
    const {user} = useAuth();

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const getUserRoles = async () => {
        if (!user) return [];
        try {
            const response = await axios.get(`${API_BASE}/api/auth/me`, {
                withCredentials: true
            });
            return response.data?.roles || [];
        } catch (error) {
            console.error('Error fetching user roles:', error);
            return [];
        }
    };

    const showNotification = (message: string, type: 'error' | 'info' | 'warning' | 'success' = 'warning') => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setPopupMessage(message);
        setPopupType(type);
        setShowPopup(true);
        timeoutRef.current = setTimeout(() => setShowPopup(false), 4000);
    };

    const handlePostRequirement = async () => {
        if (!user) {
            window.triggerGoogleLogin?.();
            return;
        }

        setLoadingClient(true);
        try {
            const roles = await getUserRoles();
            if (!roles || roles.length === 0) {
                openModalClient();
                switchToSignIn();
                return;
            }
            
            const hasClientRole = roles.some((role: Role) => role.ptype === 'CLIENT');
            
            if (hasClientRole) {
                const clientRole = roles.find((role: Role) => role.ptype === 'CLIENT');
                if (clientRole?.isApproved === 'APPROVED') {
                    showNotification("✅ You are already an approved client! You can post requirements.", 'success');
                } else if (clientRole?.isApproved === 'PENDING') {
                    showNotification("⏳ Your client application is pending approval! Please wait.", 'info');
                } else if (clientRole?.isApproved === 'REJECTED') {
                    showNotification("❌ Your client application was rejected! Please contact support.", 'error');
                }
                return;
            }
            
            showNotification("ℹ️ You don't have client access. Please apply to become a client first.", 'info');
            
        } catch (error) {
            console.error('Error:', error);
            showNotification("Something went wrong. Please try again.", 'error');
        } finally {
            setLoadingClient(false);
        }
    };

    const PopupNotification = () => {
        if (!showPopup) return null;
        
        const getIcon = () => {
            switch(popupType) {
                case 'error': return '❌';
                case 'success': return '✅';
                case 'info': return 'ℹ️';
                default: return '⚠️';
            }
        };
        
        const getBorderColor = () => {
            switch(popupType) {
                case 'error': return '#ef4444';
                case 'success': return '#10b981';
                case 'info': return '#3b82f6';
                default: return '#f59e0b';
            }
        };
        
        return (
            <div className={`role-check-popup ${popupType}`}>
                <div className="popup-content" style={{ borderLeftColor: getBorderColor() }}>
                    <span className="popup-icon">{getIcon()}</span>
                    <p>{popupMessage}</p>
                    <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
                </div>
            </div>
        );
    };

    return (
        <>
            <PopupNotification />
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

                            {/* Steps */}
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
                                onClick={handlePostRequirement}
                                disabled={loadingClient}
                            >
                                {loadingClient ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    <i className="fas fa-paper-plane"></i>
                                )}
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
            </section>

            <style jsx>{`
                .role-check-popup {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease-out;
                }

                .popup-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: var(--card-bg, #ffffff);
                    border-left: 4px solid #f59e0b;
                    border-radius: 12px;
                    padding: 14px 20px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                    min-width: 320px;
                    max-width: 420px;
                }

                .role-check-popup.error .popup-content { background: linear-gradient(135deg, #fff5f5, #ffffff); }
                .role-check-popup.warning .popup-content { background: linear-gradient(135deg, #fffbeb, #ffffff); }
                .role-check-popup.info .popup-content { background: linear-gradient(135deg, #eff6ff, #ffffff); }
                .role-check-popup.success .popup-content { background: linear-gradient(135deg, #ecfdf5, #ffffff); }

                .popup-icon { font-size: 24px; }
                .popup-content p { flex: 1; margin: 0; font-size: 13px; color: var(--text-primary, #1f2937); }

                .popup-close {
                    background: transparent;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: var(--text-secondary, #6b7280);
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                .popup-close:hover { background: rgba(0,0,0,0.05); color: #ef4444; }

                .loading-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 0.6s linear infinite;
                    margin-right: 8px;
                }

                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                button:disabled { opacity: 0.7; cursor: not-allowed; }

                /* ============================================
                   PARTNER CARD
                   ============================================ */
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

                /* Right trust panel */
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

                /* ============================================
                   RESPONSIVE
                   ============================================ */
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

                @media (max-width: 640px) {
                    .role-check-popup { top: 10px; right: 10px; left: 10px; }
                    .popup-content { min-width: auto; width: calc(100% - 20px); }
                }
            `}</style>
        </>
    )
}

export default HowItWorks;

















// // @ts-nocheck
// import React, { useRef, useEffect } from 'react'
// import axios from 'axios';
// import { Role, useAuth } from '@/contexts/AuthContext';
// import { openModalClient, openModalConsult, switchToSignIn, switchToSignUp } from '@/Script'

// const HowItWorks = () => {
//     const [loadingClient, setLoadingClient] = React.useState(false);
//     const [loadingConsultant, setLoadingConsultant] = React.useState(false);
//     const [showPopup, setShowPopup] = React.useState(false);
//     const [popupMessage, setPopupMessage] = React.useState('');
//     const [popupType, setPopupType] = React.useState<'error' | 'info' | 'warning' | 'success'>('warning');
//     const timeoutRef = useRef<NodeJS.Timeout>(null);
//     const {user} = useAuth();

//     const API_BASE = process.env.NEXT_PUBLIC_API_URL;

//     useEffect(() => {
//         return () => {
//             if (timeoutRef.current) clearTimeout(timeoutRef.current);
//         };
//     }, []);

//     const getUserRoles = async () => {
//         if (!user) return [];
//         try {
//             const response = await axios.get(`${API_BASE}/api/auth/me`, {
//                 withCredentials: true
//             });
//             return response.data?.roles || [];
//         } catch (error) {
//             console.error('Error fetching user roles:', error);
//             return [];
//         }
//     };

//     const showNotification = (message: string, type: 'error' | 'info' | 'warning' | 'success' = 'warning') => {
//         if (timeoutRef.current) clearTimeout(timeoutRef.current);
//         setPopupMessage(message);
//         setPopupType(type);
//         setShowPopup(true);
//         timeoutRef.current = setTimeout(() => setShowPopup(false), 4000);
//     };

//     const handlePostRequirement = async () => {
//         if (!user) {
//             window.triggerGoogleLogin?.();
//             return;
//         }

//         setLoadingClient(true);
//         try {
//             const roles = await getUserRoles();
//             if (!roles || roles.length === 0) {
//                 openModalClient();
//                 switchToSignIn();
//                 return;
//             }
            
//             const hasClientRole = roles.some((role: Role) => role.ptype === 'CLIENT');
            
//             if (hasClientRole) {
//                 const clientRole = roles.find((role: Role) => role.ptype === 'CLIENT');
//                 if (clientRole?.isApproved === 'APPROVED') {
//                     showNotification("✅ You are already an approved client! You can post requirements.", 'success');
//                 } else if (clientRole?.isApproved === 'PENDING') {
//                     showNotification("⏳ Your client application is pending approval! Please wait.", 'info');
//                 } else if (clientRole?.isApproved === 'REJECTED') {
//                     showNotification("❌ Your client application was rejected! Please contact support.", 'error');
//                 }
//                 return;
//             }
            
//             showNotification("ℹ️ You don't have client access. Please apply to become a client first.", 'info');
            
//         } catch (error) {
//             console.error('Error:', error);
//             showNotification("Something went wrong. Please try again.", 'error');
//         } finally {
//             setLoadingClient(false);
//         }
//     };

//     const handleJoinConsultant = async () => {
//         if (!user) {
//             window.triggerGoogleLogin?.();
//             return;
//         }

//         setLoadingConsultant(true);
//         try {
//             const roles = await getUserRoles();
//             if (!roles || roles.length === 0) {
//                 openModalConsult();
//                 switchToSignUp();
//                 return;
//             }
            
//             const hasConsultantRole = roles.some((role: Role) => role.ptype === 'CONSULTANT');
            
//             if (hasConsultantRole) {
//                 const consultantRole = roles.find((role: Role) => role.ptype === 'CONSULTANT');
//                 if (consultantRole?.isApproved === 'APPROVED') {
//                     showNotification("✅ You are already an approved consultant!", 'success');
//                 } else if (consultantRole?.isApproved === 'PENDING') {
//                     showNotification("⏳ Your consultant application is pending approval!", 'info');
//                 } else if (consultantRole?.isApproved === 'REJECTED') {
//                     showNotification("❌ Your consultant application was rejected!", 'error');
//                 }
//                 return;
//             }
            
//             showNotification("ℹ️ You don't have consultant access. Please apply to become a consultant first.", 'info');
            
//         } catch (error) {
//             console.error('Error:', error);
//             showNotification("Something went wrong. Please try again.", 'error');
//         } finally {
//             setLoadingConsultant(false);
//         }
//     };

//     const PopupNotification = () => {
//         if (!showPopup) return null;
        
//         const getIcon = () => {
//             switch(popupType) {
//                 case 'error': return '❌';
//                 case 'success': return '✅';
//                 case 'info': return 'ℹ️';
//                 default: return '⚠️';
//             }
//         };
        
//         const getBorderColor = () => {
//             switch(popupType) {
//                 case 'error': return '#ef4444';
//                 case 'success': return '#10b981';
//                 case 'info': return '#3b82f6';
//                 default: return '#f59e0b';
//             }
//         };
        
//         return (
//             <div className={`role-check-popup ${popupType}`}>
//                 <div className="popup-content" style={{ borderLeftColor: getBorderColor() }}>
//                     <span className="popup-icon">{getIcon()}</span>
//                     <p>{popupMessage}</p>
//                     <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <>
//             <PopupNotification />
//             <section id="how" className="how-sec">
//                 <div className="sec-inner sec-c">
//                     <div className="sec-label "><i className="fas fa-route"></i> How It Works</div>
//                     <h2 className="sec-title fu d1">One Goal, Two Pathways</h2>
//                     <p className="sec-sub fu d2">Whether you need a technical solution built or want to join our delivery network — there's a clear path for you.</p>
//                 </div>
//                 <div className="sec-inner dual-grid">
//                     <div className="dual-card fu d1">
//                         <div className="dual-icon di-b"><i className="fas fa-building"></i></div>
//                         <h3>For Businesses</h3>
//                         <p>Tell us the problem. We analyse it, design the solution, and build it with AI and modern technology — then let you track every step through your client portal.</p>
//                         <ul className="step-list">
//                             <li><span className="sn sn-b">1</span>Share your business problem and goals</li>
//                             <li><span className="sn sn-b">2</span>We analyse and propose the right technical solution</li>
//                             <li><span className="sn sn-b">3</span>Solution architecture and development begins</li>
//                             <li><span className="sn sn-b">4</span>Track live project status through the client portal</li>
//                             <li><span className="sn sn-b">5</span>Measure ROI and iterate for continuous improvement</li>
//                         </ul>
//                         <button 
//                             className="btn-cn" 
//                             onClick={handlePostRequirement}
//                             disabled={loadingClient}
//                         >
//                             {loadingClient ? <span className="loading-spinner"></span> : <i className="fas fa-paper-plane"></i>}
//                             Start Your Project
//                         </button>
//                     </div>
//                     <div className="dual-card fu d2">
//                         <div className="dual-icon di-g"><i className="fas fa-user-tie"></i></div>
//                         <h3>For Consultants</h3>
//                         <p>Join SoftMax's delivery network. Work on real AI and software projects with transparent management and measurable outcomes.</p>
//                         <ul className="step-list">
//                             <li><span className="sn sn-g">1</span>Create your verified consultant profile</li>
//                             <li><span className="sn sn-g">2</span>Complete skill and domain assessments</li>
//                             <li><span className="sn sn-g">3</span>Get matched with SoftMax client projects</li>
//                             <li><span className="sn sn-g">4</span>Deliver with full project transparency</li>
//                             <li><span className="sn sn-g">5</span>Build your reputation on measurable results</li>
//                         </ul>
//                         <button 
//                             className="btn-cn" 
//                             onClick={handleJoinConsultant}
//                             disabled={loadingConsultant}
//                         >
//                             {loadingConsultant ? <span className="loading-spinner"></span> : <i className="fas fa-user-plus"></i>}
//                             Join as Consultant
//                         </button>
//                     </div>
//                 </div>
//             </section>

//             <style jsx>{`
//                 .role-check-popup {
//                     position: fixed;
//                     top: 20px;
//                     right: 20px;
//                     z-index: 10000;
//                     animation: slideInRight 0.3s ease-out;
//                 }

//                 .popup-content {
//                     display: flex;
//                     align-items: center;
//                     gap: 12px;
//                     background: var(--card-bg, #ffffff);
//                     border-left: 4px solid #f59e0b;
//                     border-radius: 12px;
//                     padding: 14px 20px;
//                     box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
//                     min-width: 320px;
//                     max-width: 420px;
//                 }

//                 .role-check-popup.error .popup-content { background: linear-gradient(135deg, #fff5f5, #ffffff); }
//                 .role-check-popup.warning .popup-content { background: linear-gradient(135deg, #fffbeb, #ffffff); }
//                 .role-check-popup.info .popup-content { background: linear-gradient(135deg, #eff6ff, #ffffff); }
//                 .role-check-popup.success .popup-content { background: linear-gradient(135deg, #ecfdf5, #ffffff); }

//                 .popup-icon { font-size: 24px; }
//                 .popup-content p { flex: 1; margin: 0; font-size: 13px; color: var(--text-primary, #1f2937); }

//                 .popup-close {
//                     background: transparent;
//                     border: none;
//                     font-size: 20px;
//                     cursor: pointer;
//                     color: var(--text-secondary, #6b7280);
//                     width: 24px;
//                     height: 24px;
//                     border-radius: 50%;
//                     transition: all 0.2s;
//                 }
//                 .popup-close:hover { background: rgba(0,0,0,0.05); color: #ef4444; }

//                 .loading-spinner {
//                     display: inline-block;
//                     width: 16px;
//                     height: 16px;
//                     border: 2px solid rgba(255,255,255,0.3);
//                     border-radius: 50%;
//                     border-top-color: white;
//                     animation: spin 0.6s linear infinite;
//                     margin-right: 8px;
//                 }

//                 @keyframes spin { to { transform: rotate(360deg); } }
//                 @keyframes slideInRight {
//                     from { opacity: 0; transform: translateX(100px); }
//                     to { opacity: 1; transform: translateX(0); }
//                 }

//                 button:disabled { opacity: 0.7; cursor: not-allowed; }

//                 @media (max-width: 640px) {
//                     .role-check-popup { top: 10px; right: 10px; left: 10px; }
//                     .popup-content { min-width: auto; width: calc(100% - 20px); }
//                 }
//             `}</style>
//         </>
//     )
// }

// export default HowItWorks;











// // // @ts-nocheck
// // import React, { useRef, useEffect } from 'react'
// // import axios from 'axios';
// // import { Role, useAuth } from '@/contexts/AuthContext';
// // import { openModalClient, openModalConsult, switchToSignIn, switchToSignUp } from '@/Script'

// // const HowItWorks = () => {
// //     const [loadingClient, setLoadingClient] = React.useState(false);
// //     const [loadingConsultant, setLoadingConsultant] = React.useState(false);
// //     const [showPopup, setShowPopup] = React.useState(false);
// //     const [popupMessage, setPopupMessage] = React.useState('');
// //     const [popupType, setPopupType] = React.useState<'error' | 'info' | 'warning' | 'success'>('warning');
// //     const timeoutRef = useRef<NodeJS.Timeout>(null);
// //     const {user} = useAuth();

// //     const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// //     useEffect(() => {
// //         return () => {
// //             if (timeoutRef.current) clearTimeout(timeoutRef.current);
// //         };
// //     }, []);

// //     const getUserRoles = async () => {
// //         if (!user) return [];
// //         try {
// //             const response = await axios.get(`${API_BASE}/api/auth/me`, {
// //                 withCredentials: true
// //             });
// //             return response.data?.roles || [];
// //         } catch (error) {
// //             console.error('Error fetching user roles:', error);
// //             return [];
// //         }
// //     };

// //     const showNotification = (message: string, type: 'error' | 'info' | 'warning' | 'success' = 'warning') => {
// //         if (timeoutRef.current) clearTimeout(timeoutRef.current);
// //         setPopupMessage(message);
// //         setPopupType(type);
// //         setShowPopup(true);
// //         timeoutRef.current = setTimeout(() => setShowPopup(false), 4000);
// //     };

// //     const handlePostRequirement = async () => {
// //         if (!user) {
// //             window.triggerGoogleLogin?.();
// //             return;
// //         }

// //         setLoadingClient(true);
// //         try {
// //             const roles = await getUserRoles();
// //             if (!roles || roles.length === 0) {
// //                 openModalClient();
// //                 switchToSignIn();
// //                 return;
// //             }
            
// //             const hasClientRole = roles.some((role: Role) => role.ptype === 'CLIENT');
            
// //             if (hasClientRole) {
// //                 const clientRole = roles.find((role: Role) => role.ptype === 'CLIENT');
// //                 if (clientRole?.isApproved === 'APPROVED') {
// //                     showNotification("✅ You are already an approved client! You can post requirements.", 'success');
// //                 } else if (clientRole?.isApproved === 'PENDING') {
// //                     showNotification("⏳ Your client application is pending approval! Please wait.", 'info');
// //                 } else if (clientRole?.isApproved === 'REJECTED') {
// //                     showNotification("❌ Your client application was rejected! Please contact support.", 'error');
// //                 }
// //                 return;
// //             }
            
// //             showNotification("ℹ️ You don't have client access. Please apply to become a client first.", 'info');
            
// //         } catch (error) {
// //             console.error('Error:', error);
// //             showNotification("Something went wrong. Please try again.", 'error');
// //         } finally {
// //             setLoadingClient(false);
// //         }
// //     };

// //     const handleJoinConsultant = async () => {
// //         if (!user) {
// //             window.triggerGoogleLogin?.();
// //             return;
// //         }

// //         setLoadingConsultant(true);
// //         try {
// //             const roles = await getUserRoles();
// //             if (!roles || roles.length === 0) {
// //                 openModalConsult();
// //                 switchToSignUp();
// //                 return;
// //             }
            
// //             const hasConsultantRole = roles.some((role: Role) => role.ptype === 'CONSULTANT');
            
// //             if (hasConsultantRole) {
// //                 const consultantRole = roles.find((role: Role) => role.ptype === 'CONSULTANT');
// //                 if (consultantRole?.isApproved === 'APPROVED') {
// //                     showNotification("✅ You are already an approved consultant!", 'success');
// //                 } else if (consultantRole?.isApproved === 'PENDING') {
// //                     showNotification("⏳ Your consultant application is pending approval!", 'info');
// //                 } else if (consultantRole?.isApproved === 'REJECTED') {
// //                     showNotification("❌ Your consultant application was rejected!", 'error');
// //                 }
// //                 return;
// //             }
            
// //             showNotification("ℹ️ You don't have consultant access. Please apply to become a consultant first.", 'info');
            
// //         } catch (error) {
// //             console.error('Error:', error);
// //             showNotification("Something went wrong. Please try again.", 'error');
// //         } finally {
// //             setLoadingConsultant(false);
// //         }
// //     };

// //     const PopupNotification = () => {
// //         if (!showPopup) return null;
        
// //         const getIcon = () => {
// //             switch(popupType) {
// //                 case 'error': return '❌';
// //                 case 'success': return '✅';
// //                 case 'info': return 'ℹ️';
// //                 default: return '⚠️';
// //             }
// //         };
        
// //         const getBorderColor = () => {
// //             switch(popupType) {
// //                 case 'error': return '#ef4444';
// //                 case 'success': return '#10b981';
// //                 case 'info': return '#3b82f6';
// //                 default: return '#f59e0b';
// //             }
// //         };
        
// //         return (
// //             <div className={`role-check-popup ${popupType}`}>
// //                 <div className="popup-content" style={{ borderLeftColor: getBorderColor() }}>
// //                     <span className="popup-icon">{getIcon()}</span>
// //                     <p>{popupMessage}</p>
// //                     <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
// //                 </div>
// //             </div>
// //         );
// //     };

// //     return (
// //         <>
// //             <PopupNotification />
// //             <section id="how" className="how-sec">
// //                 <div className="sec-inner sec-c">
// //                     <div className="sec-label "><i className="fas fa-route"></i> How It Works</div>
// //                     <h2 className="sec-title fu d1">One Goal, Two Pathways</h2>
// //                     <p className="sec-sub fu d2">Whether you need a technical solution built or want to join our delivery network — there's a clear path for you.</p>
// //                 </div>
// //                 <div className="sec-inner dual-grid">
// //                     <div className="dual-card fu d1">
// //                         <div className="dual-icon di-b"><i className="fas fa-building"></i></div>
// //                         <h3>For Businesses</h3>
// //                         <p>Tell us the problem. We analyse it, design the solution, and build it with AI and modern technology — then let you track every step through your client portal.</p>
// //                         <ul className="step-list">
// //                             <li><span className="sn sn-b">1</span>Share your business problem and goals</li>
// //                             <li><span className="sn sn-b">2</span>We analyse and propose the right technical solution</li>
// //                             <li><span className="sn sn-b">3</span>Solution architecture and development begins</li>
// //                             <li><span className="sn sn-b">4</span>Track live project status through the client portal</li>
// //                             <li><span className="sn sn-b">5</span>Measure ROI and iterate for continuous improvement</li>
// //                         </ul>
// //                         <button 
// //                             className="btn-cn" 
// //                             onClick={handlePostRequirement}
// //                             disabled={loadingClient}
// //                         >
// //                             {loadingClient ? <span className="loading-spinner"></span> : <i className="fas fa-paper-plane"></i>}
// //                             Start Your Project
// //                         </button>
// //                     </div>
// //                     <div className="dual-card fu d2">
// //                         <div className="dual-icon di-g"><i className="fas fa-user-tie"></i></div>
// //                         <h3>For Consultants</h3>
// //                         <p>Join SoftMax's delivery network. Work on real AI and software projects with transparent management and measurable outcomes.</p>
// //                         <ul className="step-list">
// //                             <li><span className="sn sn-g">1</span>Create your verified consultant profile</li>
// //                             <li><span className="sn sn-g">2</span>Complete skill and domain assessments</li>
// //                             <li><span className="sn sn-g">3</span>Get matched with SoftMax client projects</li>
// //                             <li><span className="sn sn-g">4</span>Deliver with full project transparency</li>
// //                             <li><span className="sn sn-g">5</span>Build your reputation on measurable results</li>
// //                         </ul>
// //                         <button 
// //                             className="btn-cn" 
// //                             onClick={handleJoinConsultant}
// //                             disabled={loadingConsultant}
// //                         >
// //                             {loadingConsultant ? <span className="loading-spinner"></span> : <i className="fas fa-user-plus"></i>}
// //                             Join as Consultant
// //                         </button>
// //                     </div>
// //                 </div>
// //             </section>

// //             <style jsx>{`
// //                 .role-check-popup {
// //                     position: fixed;
// //                     top: 20px;
// //                     right: 20px;
// //                     z-index: 10000;
// //                     animation: slideInRight 0.3s ease-out;
// //                 }

// //                 .popup-content {
// //                     display: flex;
// //                     align-items: center;
// //                     gap: 12px;
// //                     background: var(--card-bg, #ffffff);
// //                     border-left: 4px solid #f59e0b;
// //                     border-radius: 12px;
// //                     padding: 14px 20px;
// //                     box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
// //                     min-width: 320px;
// //                     max-width: 420px;
// //                 }

// //                 .role-check-popup.error .popup-content { background: linear-gradient(135deg, #fff5f5, #ffffff); }
// //                 .role-check-popup.warning .popup-content { background: linear-gradient(135deg, #fffbeb, #ffffff); }
// //                 .role-check-popup.info .popup-content { background: linear-gradient(135deg, #eff6ff, #ffffff); }
// //                 .role-check-popup.success .popup-content { background: linear-gradient(135deg, #ecfdf5, #ffffff); }

// //                 .popup-icon { font-size: 24px; }
// //                 .popup-content p { flex: 1; margin: 0; font-size: 13px; color: var(--text-primary, #1f2937); }

// //                 .popup-close {
// //                     background: transparent;
// //                     border: none;
// //                     font-size: 20px;
// //                     cursor: pointer;
// //                     color: var(--text-secondary, #6b7280);
// //                     width: 24px;
// //                     height: 24px;
// //                     border-radius: 50%;
// //                     transition: all 0.2s;
// //                 }
// //                 .popup-close:hover { background: rgba(0,0,0,0.05); color: #ef4444; }

// //                 .loading-spinner {
// //                     display: inline-block;
// //                     width: 16px;
// //                     height: 16px;
// //                     border: 2px solid rgba(255,255,255,0.3);
// //                     border-radius: 50%;
// //                     border-top-color: white;
// //                     animation: spin 0.6s linear infinite;
// //                     margin-right: 8px;
// //                 }

// //                 @keyframes spin { to { transform: rotate(360deg); } }
// //                 @keyframes slideInRight {
// //                     from { opacity: 0; transform: translateX(100px); }
// //                     to { opacity: 1; transform: translateX(0); }
// //                 }

// //                 button:disabled { opacity: 0.7; cursor: not-allowed; }

// //                 @media (max-width: 640px) {
// //                     .role-check-popup { top: 10px; right: 10px; left: 10px; }
// //                     .popup-content { min-width: auto; width: calc(100% - 20px); }
// //                 }
// //             `}</style>
// //         </>
// //     )
// // }

// // export default HowItWorks;









// // // // @ts-nocheck
// // // import React, { useRef, useEffect } from 'react'
// // // import axios from 'axios';
// // // import { Role, useAuth } from '@/contexts/AuthContext';
// // // import { openModalClient, openModalConsult, switchToSignIn, switchToSignUp } from '@/Script'

// // // const HowItWorks = () => {
// // //     const [loadingClient, setLoadingClient] = React.useState(false);
// // //     const [loadingConsultant, setLoadingConsultant] = React.useState(false);
// // //     const [showPopup, setShowPopup] = React.useState(false);
// // //     const [popupMessage, setPopupMessage] = React.useState('');
// // //     const [popupType, setPopupType] = React.useState<'error' | 'info' | 'warning' | 'success'>('warning');
// // //     const timeoutRef = useRef<NodeJS.Timeout>(null);
// // //     const {user} = useAuth();

// // //     const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// // //     useEffect(() => {
// // //         return () => {
// // //             if (timeoutRef.current) clearTimeout(timeoutRef.current);
// // //         };
// // //     }, []);

// // //     const getUserRoles = async () => {
// // //         if (!user) return [];
// // //         try {
// // //             const response = await axios.get(`${API_BASE}/api/auth/me`, {
// // //                 withCredentials: true
// // //             });
// // //             return response.data?.roles || [];
// // //         } catch (error) {
// // //             console.error('Error fetching user roles:', error);
// // //             return [];
// // //         }
// // //     };

// // //     const showNotification = (message: string, type: 'error' | 'info' | 'warning' | 'success' = 'warning') => {
// // //         if (timeoutRef.current) clearTimeout(timeoutRef.current);
// // //         setPopupMessage(message);
// // //         setPopupType(type);
// // //         setShowPopup(true);
// // //         timeoutRef.current = setTimeout(() => setShowPopup(false), 4000);
// // //     };

// // //     const handlePostRequirement = async () => {
// // //         console.log("user: ",user);
// // //         if (!user) {
// // //             window.triggerGoogleLogin?.();
// // //             return;
// // //         }

// // //         setLoadingClient(true);
// // //         try {
// // //             const roles = await getUserRoles();
// // //             console.log('User roles:', roles);
// // //             // ✅ If NO roles → Show FORM only (no popup)
// // //             if (!roles || roles.length === 0) {
// // //                 openModalClient();
// // //                 switchToSignIn();
// // //                 return;
// // //             }
            
// // //             // ✅ If roles exist → Show POPUP only (no form)
// // //             const hasClientRole = roles.some((role: Role) => role.ptype === 'CLIENT');
            
// // //             if (hasClientRole) {
// // //                 const clientRole = roles.find((role: Role) => role.ptype === 'CLIENT');
// // //                 if (clientRole?.isApproved === 'APPROVED') {
// // //                     showNotification("✅ You are already an approved client! You can post requirements.", 'success');
// // //                 } else if (clientRole?.isApproved === 'PENDING') {
// // //                     showNotification("⏳ Your client application is pending approval! Please wait.", 'info');
// // //                 } else if (clientRole?.isApproved === 'REJECTED') {
// // //                     showNotification("❌ Your client application was rejected! Please contact support.", 'error');
// // //                 }
// // //                 return;
// // //             }
            
// // //             // If no client role but other roles exist
// // //             showNotification("ℹ️ You don't have client access. Please apply to become a client first.", 'info');
            
// // //         } catch (error) {
// // //             console.error('Error:', error);
// // //             showNotification("Something went wrong. Please try again.", 'error');
// // //         } finally {
// // //             setLoadingClient(false);
// // //         }
// // //     };

// // //     const handleJoinConsultant = async () => {
// // //         if (!user) {
// // //             window.triggerGoogleLogin?.();
// // //             return;
// // //         }

// // //         setLoadingConsultant(true);
// // //         try {
// // //             const roles = await getUserRoles();
            
// // //             // ✅ If NO roles → Show FORM only (no popup)
// // //             console.log(!roles || roles.length === 0);
// // //             if (!roles || roles.length === 0) {
// // //                 openModalConsult();
// // //                 switchToSignUp();
// // //                 return;
// // //             }
            
// // //             // ✅ If roles exist → Show POPUP only (no form)
// // //             const hasConsultantRole = roles.some((role: Role) => role.ptype === 'CONSULTANT');
            
// // //             if (hasConsultantRole) {
// // //                 const consultantRole = roles.find((role: Role) => role.ptype === 'CONSULTANT');
// // //                 if (consultantRole?.isApproved === 'APPROVED') {
// // //                     showNotification("✅ You are already an approved consultant!", 'success');
// // //                 } else if (consultantRole?.isApproved === 'PENDING') {
// // //                     showNotification("⏳ Your consultant application is pending approval!", 'info');
// // //                 } else if (consultantRole?.isApproved === 'REJECTED') {
// // //                     showNotification("❌ Your consultant application was rejected!", 'error');
// // //                 }
// // //                 return;
// // //             }
            
// // //             // If no consultant role but other roles exist
// // //             showNotification("ℹ️ You don't have consultant access. Please apply to become a consultant first.", 'info');
            
// // //         } catch (error) {
// // //             console.error('Error:', error);
// // //             showNotification("Something went wrong. Please try again.", 'error');
// // //         } finally {
// // //             setLoadingConsultant(false);
// // //         }
// // //     };

// // //     const PopupNotification = () => {
// // //         if (!showPopup) return null;
        
// // //         const getIcon = () => {
// // //             switch(popupType) {
// // //                 case 'error': return '❌';
// // //                 case 'success': return '✅';
// // //                 case 'info': return 'ℹ️';
// // //                 default: return '⚠️';
// // //             }
// // //         };
        
// // //         const getBorderColor = () => {
// // //             switch(popupType) {
// // //                 case 'error': return '#ef4444';
// // //                 case 'success': return '#10b981';
// // //                 case 'info': return '#3b82f6';
// // //                 default: return '#f59e0b';
// // //             }
// // //         };
        
// // //         return (
// // //             <div className={`role-check-popup ${popupType}`}>
// // //                 <div className="popup-content" style={{ borderLeftColor: getBorderColor() }}>
// // //                     <span className="popup-icon">{getIcon()}</span>
// // //                     <p>{popupMessage}</p>
// // //                     <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
// // //                 </div>
// // //             </div>
// // //         );
// // //     };

// // //     return (
// // //         <>
// // //             <PopupNotification />
// // //             <section id="how" className="how-sec">
// // //                 <div className="sec-inner sec-c">
// // //                     <div className="sec-label "><i className="fas fa-route"></i> How It Works</div>
// // //                     <h2 className="sec-title fu d1">Two Pathways, One Platform</h2>
// // //                     <p className="sec-sub fu d2">Whether you`re an enterprise seeking expertise or a consultant ready to deliver impact — we have a tailored journey for you.</p>
// // //                 </div>
// // //                 <div className="sec-inner dual-grid">
// // //                     <div className="dual-card fu d1">
// // //                         <div className="dual-icon di-b"><i className="fas fa-building"></i></div>
// // //                         <h3>For Companies</h3>
// // //                         <p>Post your requirements, receive AI-matched consultant profiles within 24 hours, and track every deliverable through live KPI dashboards.</p>
// // //                         <ul className="step-list">
// // //                             <li><span className="sn sn-b">1</span>Post your project with AI-guided requirement prompts</li>
// // //                             <li><span className="sn sn-b">2</span>Receive top-3 matched consultant profiles instantly</li>
// // //                             <li><span className="sn sn-b">3</span>Choose Standard or Managed engagement mode</li>
// // //                             <li><span className="sn sn-b">4</span>Track progress through live KPI dashboards</li>
// // //                             <li><span className="sn sn-b">5</span>Rate, review, and scale for future projects</li>
// // //                         </ul>
// // //                         <button 
// // //                             className="btn-cn" 
// // //                             onClick={handlePostRequirement}
// // //                             disabled={loadingClient}
// // //                         >
// // //                             {loadingClient ? <span className="loading-spinner"></span> : <i className="fas fa-paper-plane"></i>}
// // //                             Post a Requirement
// // //                         </button>
// // //                     </div>
// // //                     <div className="dual-card fu d2">
// // //                         <div className="dual-icon di-g"><i className="fas fa-user-tie"></i></div>
// // //                         <h3>For Consultants</h3>
// // //                         <p>Build your verified profile, complete domain assessments, and get AI-matched with projects that align perfectly with your expertise.</p>
// // //                         <ul className="step-list">
// // //                             <li><span className="sn sn-g">1</span>Create your verified consultant profile in 10 minutes</li>
// // //                             <li><span className="sn sn-g">2</span>Complete skill assessments and domain verification</li>
// // //                             <li><span className="sn sn-g">3</span>Browse curated project opportunities</li>
// // //                             <li><span className="sn sn-g">4</span>Receive smart project matches via AI engine</li>
// // //                             <li><span className="sn sn-g">5</span>Deliver, earn, and build your reputation score</li>
// // //                         </ul>
// // //                         <button 
// // //                             className="btn-cn" 
// // //                             onClick={handleJoinConsultant}
// // //                             disabled={loadingConsultant}
// // //                         >
// // //                             {loadingConsultant ? <span className="loading-spinner"></span> : <i className="fas fa-user-plus"></i>}
// // //                             Join as Consultant
// // //                         </button>
// // //                     </div>
// // //                 </div>
// // //             </section>

// // //             <style jsx>{`
// // //                 .role-check-popup {
// // //                     position: fixed;
// // //                     top: 20px;
// // //                     right: 20px;
// // //                     z-index: 10000;
// // //                     animation: slideInRight 0.3s ease-out;
// // //                 }

// // //                 .popup-content {
// // //                     display: flex;
// // //                     align-items: center;
// // //                     gap: 12px;
// // //                     background: var(--card-bg, #ffffff);
// // //                     border-left: 4px solid #f59e0b;
// // //                     border-radius: 12px;
// // //                     padding: 14px 20px;
// // //                     box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
// // //                     min-width: 320px;
// // //                     max-width: 420px;
// // //                 }

// // //                 .role-check-popup.error .popup-content { background: linear-gradient(135deg, #fff5f5, #ffffff); }
// // //                 .role-check-popup.warning .popup-content { background: linear-gradient(135deg, #fffbeb, #ffffff); }
// // //                 .role-check-popup.info .popup-content { background: linear-gradient(135deg, #eff6ff, #ffffff); }
// // //                 .role-check-popup.success .popup-content { background: linear-gradient(135deg, #ecfdf5, #ffffff); }

// // //                 .popup-icon { font-size: 24px; }
// // //                 .popup-content p { flex: 1; margin: 0; font-size: 13px; color: var(--text-primary, #1f2937); }

// // //                 .popup-close {
// // //                     background: transparent;
// // //                     border: none;
// // //                     font-size: 20px;
// // //                     cursor: pointer;
// // //                     color: var(--text-secondary, #6b7280);
// // //                     width: 24px;
// // //                     height: 24px;
// // //                     border-radius: 50%;
// // //                     transition: all 0.2s;
// // //                 }
// // //                 .popup-close:hover { background: rgba(0,0,0,0.05); color: #ef4444; }

// // //                 .loading-spinner {
// // //                     display: inline-block;
// // //                     width: 16px;
// // //                     height: 16px;
// // //                     border: 2px solid rgba(255,255,255,0.3);
// // //                     border-radius: 50%;
// // //                     border-top-color: white;
// // //                     animation: spin 0.6s linear infinite;
// // //                     margin-right: 8px;
// // //                 }

// // //                 @keyframes spin { to { transform: rotate(360deg); } }
// // //                 @keyframes slideInRight {
// // //                     from { opacity: 0; transform: translateX(100px); }
// // //                     to { opacity: 1; transform: translateX(0); }
// // //                 }

// // //                 button:disabled { opacity: 0.7; cursor: not-allowed; }

// // //                 @media (max-width: 640px) {
// // //                     .role-check-popup { top: 10px; right: 10px; left: 10px; }
// // //                     .popup-content { min-width: auto; width: calc(100% - 20px); }
// // //                 }
// // //             `}</style>
// // //         </>
// // //     )
// // // }

// // // export default HowItWorks;


