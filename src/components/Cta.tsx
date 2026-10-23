// import React, { useRef, useEffect } from 'react'
// import { openModalClient, openModalConsult, switchToSignIn, switchToSignUp } from '@/Script'
// import { Role, useAuth } from '@/contexts/AuthContext';
// import axios from 'axios';

// const Cta = () => {
//     const {user} = useAuth();
//     const [loadingClient, setLoadingClient] = React.useState(false);
//     const [loadingConsultant, setLoadingConsultant] = React.useState(false);
//     const [showPopup, setShowPopup] = React.useState(false);
//     const [popupMessage, setPopupMessage] = React.useState('');
//     const [popupType, setPopupType] = React.useState<'error' | 'info' | 'warning' | 'success'>('warning');
//     const timeoutRef = useRef<NodeJS.Timeout>(null);

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
//             <section className="cta-sec" id="contact">
//                 <div className="cta-box fu">
//                     <div className="cta-text">
//                         <div className="sec-label" style={{ marginBottom: '.7rem' }}>
//                             <i className="fas fa-bolt"></i> Get Started Today
//                         </div>
//                         <h2>Ready to Solve<br />Your Business Problem?</h2>
//                         <p>SoftMax Technologies & IT Services builds AI-powered, scalable digital systems that improve ROI, automate workflows, and deliver measurable results. Let's find the right solution for your business.</p>
//                     </div>
//                     <div className="cta-actions">
//                         <button 
//                             className="btn-prim" 
//                             onClick={handlePostRequirement}
//                             disabled={loadingClient}
//                         >
//                             {loadingClient ? <span className="loading-spinner"></span> : <i className="fas fa-rocket"></i>}
//                             Become a Client
//                         </button>
//                         <button 
//                             className="btn-ghost" 
//                             onClick={handleJoinConsultant}
//                             disabled={loadingConsultant}
//                         >
//                             {loadingConsultant ? <span className="loading-spinner"></span> : <i className="fas fa-user-tie"></i>}
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

//                 .role-check-popup.error .popup-content {
//                     background: linear-gradient(135deg, #fff5f5, #ffffff);
//                 }
//                 .role-check-popup.warning .popup-content {
//                     background: linear-gradient(135deg, #fffbeb, #ffffff);
//                 }
//                 .role-check-popup.info .popup-content {
//                     background: linear-gradient(135deg, #eff6ff, #ffffff);
//                 }
//                 .role-check-popup.success .popup-content {
//                     background: linear-gradient(135deg, #ecfdf5, #ffffff);
//                 }

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

// export default Cta;









// // import React, { useRef, useEffect } from 'react'
// // import { openModalClient, openModalConsult, switchToSignIn, switchToSignUp } from '@/Script'
// // import { Role, useAuth } from '@/contexts/AuthContext';
// // import axios from 'axios';

// // const Cta = () => {
// //     const {user} = useAuth();
// //     const [loadingClient, setLoadingClient] = React.useState(false);
// //     const [loadingConsultant, setLoadingConsultant] = React.useState(false);
// //     const [showPopup, setShowPopup] = React.useState(false);
// //     const [popupMessage, setPopupMessage] = React.useState('');
// //     const [popupType, setPopupType] = React.useState<'error' | 'info' | 'warning' | 'success'>('warning');
// //     const timeoutRef = useRef<NodeJS.Timeout>(null);

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
// //         console.log("user: ",user);
// //         if (!user) {
// //             window.triggerGoogleLogin?.();
// //             return;
// //         }

// //         setLoadingClient(true);
// //         try {
// //             const roles = await getUserRoles();
// //             console.log('User roles:', roles);
// //             // ✅ If NO roles → Show FORM only (no popup)
// //             if (!roles || roles.length === 0) {
// //                 openModalClient();
// //                 switchToSignIn();
// //                 return;
// //             }
            
// //             // ✅ If roles exist → Show POPUP only (no form)
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
            
// //             // If no client role but other roles exist
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
            
// //             // ✅ If NO roles → Show FORM only (no popup)
// //             console.log(!roles || roles.length === 0);
// //             if (!roles || roles.length === 0) {
// //                 openModalConsult();
// //                 switchToSignUp();
// //                 return;
// //             }
            
// //             // ✅ If roles exist → Show POPUP only (no form)
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
            
// //             // If no consultant role but other roles exist
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
// //             <section className="cta-sec" id="contact">
// //                 <div className="cta-box fu">
// //                     <div className="cta-text">
// //                         <div className="sec-label" style={{ marginBottom: '.7rem' }}>
// //                             <i className="fas fa-bolt"></i> Get Started Today
// //                         </div>
// //                         <h2>Ready to Transform<br />Your Business?</h2>
// //                         <p>Join 200+ enterprises that trust Gaurion Bharat for mission-critical consulting, AI-powered matching, and managed transformation programs that deliver real outcomes.</p>
// //                     </div>
// //                     <div className="cta-actions">
// //                         <button 
// //                             className="btn-prim" 
// //                             onClick={handlePostRequirement}
// //                             disabled={loadingClient}
// //                         >
// //                             {loadingClient ? <span className="loading-spinner"></span> : <i className="fas fa-rocket"></i>}
// //                             Become a Client
// //                         </button>
// //                         <button 
// //                             className="btn-ghost" 
// //                             onClick={handleJoinConsultant}
// //                             disabled={loadingConsultant}
// //                         >
// //                             {loadingConsultant ? <span className="loading-spinner"></span> : <i className="fas fa-user-tie"></i>}
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

// //                 .role-check-popup.error .popup-content {
// //                     background: linear-gradient(135deg, #fff5f5, #ffffff);
// //                 }
// //                 .role-check-popup.warning .popup-content {
// //                     background: linear-gradient(135deg, #fffbeb, #ffffff);
// //                 }
// //                 .role-check-popup.info .popup-content {
// //                     background: linear-gradient(135deg, #eff6ff, #ffffff);
// //                 }
// //                 .role-check-popup.success .popup-content {
// //                     background: linear-gradient(135deg, #ecfdf5, #ffffff);
// //                 }

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

// // export default Cta;
import React, { useRef, useEffect } from 'react'
import { openModalClient, switchToSignIn } from '@/Script'
import { Role, useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

const Cta = () => {
    const {user} = useAuth();
    const [loadingClient, setLoadingClient] = React.useState(false);
    const [showPopup, setShowPopup] = React.useState(false);
    const [popupMessage, setPopupMessage] = React.useState('');
    const [popupType, setPopupType] = React.useState<'error' | 'info' | 'warning' | 'success'>('warning');
    const timeoutRef = useRef<NodeJS.Timeout>(null);

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
            <section className="cta-sec" id="contact">
                <div className="cta-box fu">
                    <div className="cta-text">
                        <div className="sec-label" style={{ marginBottom: '.7rem' }}>
                            <i className="fas fa-bolt"></i> Get Started Today
                        </div>
                        <h2>Ready to Solve<br />Your Business Problem?</h2>
                        <p>SoftMax Technologies & IT Services builds AI-powered, scalable digital systems that improve ROI, automate workflows, and deliver measurable results. Let's find the right solution for your business.</p>
                    </div>
                    <div className="cta-actions">
                        <button 
                            className="btn-prim" 
                            onClick={handlePostRequirement}
                            disabled={loadingClient}
                        >
                            {loadingClient ? <span className="loading-spinner"></span> : <i className="fas fa-rocket"></i>}
                            Become a Client
                        </button>
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

                .role-check-popup.error .popup-content {
                    background: linear-gradient(135deg, #fff5f5, #ffffff);
                }
                .role-check-popup.warning .popup-content {
                    background: linear-gradient(135deg, #fffbeb, #ffffff);
                }
                .role-check-popup.info .popup-content {
                    background: linear-gradient(135deg, #eff6ff, #ffffff);
                }
                .role-check-popup.success .popup-content {
                    background: linear-gradient(135deg, #ecfdf5, #ffffff);
                }

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

                @media (max-width: 640px) {
                    .role-check-popup { top: 10px; right: 10px; left: 10px; }
                    .popup-content { min-width: auto; width: calc(100% - 20px); }
                }
            `}</style>
        </>
    )
}

export default Cta;