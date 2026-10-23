// "use client";

// import React, { useState } from 'react';
// import axios from 'axios';

// // ============================================
// // EXTERNAL INQUIRY API (no login required)
// // ============================================

// interface InquiryPayload {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   projectName: string;
//   projectType: string;
//   budgetRange: string;
//   timeline: string;
//   projectDescription: string;
// }

// const submitInquiry = async (payload: InquiryPayload) => {
//   const res = await axios.post(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/v1/external/project-inquiry`,
//     payload,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         apikey: process.env.NEXT_PUBLIC_PROJECT_SOFTMAX_APIKEY || '',
//       },
//     }
//   );
//   return res.data;
// };

// // ============================================
// // TYPES
// // ============================================

// type Mode = 'inquiry' | 'consultation';

// type SuccessState = {
//   referenceId?: string;
//   message?: string;
//   emailSentTo?: string;
// };

// // ============================================
// // COMPONENT
// // ============================================

// const ProjectInquiry: React.FC = () => {
//   const [mode, setMode] = useState<Mode>('inquiry');

//   // shared fields
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');

//   // inquiry-only fields
//   const [projectName, setProjectName] = useState('');
//   const [projectType, setProjectType] = useState('');
//   const [budgetRange, setBudgetRange] = useState('');
//   const [timeline, setTimeline] = useState('');
//   const [description, setDescription] = useState('');

//   // consultation-only fields
//   const [consultTopic, setConsultTopic] = useState('');
//   const [consultWhen, setConsultWhen] = useState('');
//   const [consultDescription, setConsultDescription] = useState('');

//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState<SuccessState | null>(null);

//   const resetAll = () => {
//     setName('');
//     setEmail('');
//     setPhone('');
//     setProjectName('');
//     setProjectType('');
//     setBudgetRange('');
//     setTimeline('');
//     setDescription('');
//     setConsultTopic('');
//     setConsultWhen('');
//     setConsultDescription('');
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!name.trim() || !email.trim() || !phone.trim()) {
//       setError('Please fill Name, Email and Phone Number.');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       let payload: InquiryPayload;

//       if (mode === 'inquiry') {
//         if (!projectName.trim() || !description.trim()) {
//           setError('Please fill Project Name and Description.');
//           setSubmitting(false);
//           return;
//         }

//         payload = {
//           name: name.trim(),
//           email: email.trim(),
//           phoneNumber: phone.trim(),
//           projectName: projectName.trim(),
//           projectType: projectType.trim() || 'General',
//           budgetRange: budgetRange.trim() || 'Not specified',
//           timeline: timeline.trim() || 'Not specified',
//           projectDescription: description.trim(),
//         };
//       } else {
//         if (!consultTopic.trim() || !consultDescription.trim()) {
//           setError('Please fill Consultation Topic and Description.');
//           setSubmitting(false);
//           return;
//         }

//         payload = {
//           name: name.trim(),
//           email: email.trim(),
//           phoneNumber: phone.trim(),
//           projectName: `Free Consultation: ${consultTopic.trim()}`,
//           projectType: 'Free Consultation',
//           budgetRange: 'Not specified',
//           timeline: consultWhen.trim() || 'Flexible',
//           projectDescription: consultDescription.trim(),
//         };
//       }

//       const res = await submitInquiry(payload);
//       setSuccess({
//         referenceId: res?.referenceId,
//         message: res?.message,
//         emailSentTo: res?.emailSentTo,
//       });
//       resetAll();
//     } catch (err: any) {
//       const status = err?.response?.status;
//       const msg = err?.response?.data?.message || err?.message || '';

//       if (status === 401) {
//         setError('Unauthorized. Please check API key configuration.');
//       } else if (status === 400) {
//         setError(msg || 'Please check your details and try again.');
//       } else if (/Missing Token/i.test(msg)) {
//         setError('Backend: Missing Token — JwtFilter shouldNotFilter for /api/v1/external/');
//       } else if (/Invalid or missing API key/i.test(msg)) {
//         setError('Backend: Invalid API key — check "apikey" header name and value.');
//       } else {
//         setError(msg || 'Submission failed. Please try again.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ============ SUCCESS SCREEN ============ */
//   if (success) {
//     return (
//       <section className="inquiry-sec" id="inquiry">
//         <div className="inquiry-wrap">
//           <div className="success-card">
//             <div className="success-icon">🎉</div>
//             <h2>Inquiry Submitted!</h2>
//             <p>
//               {success.message ||
//                 'Your inquiry has been submitted. Our team will contact you soon.'}
//             </p>
//             {success.referenceId && (
//               <div className="ref-box">
//                 <span className="ref-label">Reference ID</span>
//                 <span className="ref-value">{success.referenceId}</span>
//               </div>
//             )}
//             {success.emailSentTo && (
//               <p className="success-note">
//                 📧 Confirmation sent to <strong>{success.emailSentTo}</strong>
//               </p>
//             )}
//             <button
//               className="new-btn"
//               onClick={() => setSuccess(null)}
//             >
//               Send another inquiry
//             </button>
//           </div>

//           <style jsx>{`
//             .inquiry-sec { padding: 5rem clamp(.9rem, 3.5vw, 2rem); background: var(--bg, #faf8ff); }
//             .inquiry-wrap { max-width: 640px; margin: 0 auto; }
//             .success-card { background: var(--card-bg, #fff); border: 1px solid var(--border, #e9e2f8); border-radius: 24px; padding: 48px 36px; text-align: center; box-shadow: var(--shadow-lg, 0 8px 40px rgba(0,0,0,0.1)); }
//             .success-icon { font-size: 64px; margin-bottom: 14px; animation: pop 0.6s var(--bounce, cubic-bezier(.34,1.56,.64,1)); }
//             @keyframes pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
//             .success-card h2 { font-family: var(--font-h, Georgia, serif); font-size: 26px; font-weight: 900; color: var(--text2, #1e2535); margin: 0 0 12px; }
//             .success-card p { font-size: 15px; color: var(--muted, #6b6a8a); line-height: 1.65; margin: 0 0 16px; }
//             .ref-box { display: inline-flex; flex-direction: column; gap: 4px; padding: 12px 24px; background: rgba(27, 207, 180, 0.1); border-radius: 14px; margin-bottom: 16px; }
//             .ref-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--teal, #1bcbf4); }
//             .ref-value { font-family: monospace; font-size: 16px; font-weight: 700; color: var(--teal, #1bcbf4); }
//             .success-note { font-size: 13px; color: var(--muted, #6b6a8a); margin: 0 0 20px; }
//             .new-btn { padding: 12px 28px; border-radius: 40px; background: linear-gradient(135deg, #1bcbf4, #1bcbf4); color: white; border: none; font-weight: 700; font-size: 14px; cursor: pointer; transition: transform 0.2s; }
//             .new-btn:hover { transform: translateY(-2px); }
//           `}</style>
//         </div>
//       </section>
//     );
//   }

//   /* ============ FORM SCREEN ============ */
//   return (
//     <section className="inquiry-sec" id="inquiry">
//       <div className="inquiry-wrap">
//         {/* Header */}
//         <div className="inquiry-header">
//           <div className="sec-label">
//             <i className="fas fa-bolt"></i> {mode === 'inquiry' ? 'Project Inquiry' : 'Free Consultation'}
//           </div>
//           <h2 className="inquiry-title">
//             {mode === 'inquiry' ? (
//               <>Tell us about <span className="highlight">your project</span></>
//             ) : (
//               <>Book a <span className="highlight">free consultation</span></>
//             )}
//           </h2>
//           <p className="inquiry-sub">
//             {mode === 'inquiry'
//               ? 'Share your requirements — our team will analyse the problem and propose the right solution within 24 hours.'
//               : 'No commitment, just a 30-minute call to understand your challenges and explore how SoftMax can help.'}
//           </p>
//         </div>

//         {/* Toggle */}
//         <div className="mode-toggle">
//           <button
//             type="button"
//             className={`mode-btn ${mode === 'inquiry' ? 'active' : ''}`}
//             onClick={() => { setMode('inquiry'); setError(''); }}
//           >
//             💼 Project Inquiry
//           </button>
//           <button
//             type="button"
//             className={`mode-btn ${mode === 'consultation' ? 'active' : ''}`}
//             onClick={() => { setMode('consultation'); setError(''); }}
//           >
//             🎯 Free Consultation
//           </button>
//         </div>

//         {/* Card */}
//         <form className="inquiry-card" onSubmit={handleSubmit}>
//           <div className="form-grid">
//             {/* Common */}
//             <div className="form-row full">
//               <label htmlFor="pi-name">Full Name *</label>
//               <input
//                 id="pi-name"
//                 type="text"
//                 placeholder="Your full name"
//                 value={name}
//                 onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
//                 disabled={submitting}
//                 required
//               />
//             </div>

//             <div className="form-row">
//               <label htmlFor="pi-email">Email *</label>
//               <input
//                 id="pi-email"
//                 type="email"
//                 placeholder="you@company.com"
//                 value={email}
//                 onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
//                 disabled={submitting}
//                 required
//               />
//             </div>

//             <div className="form-row">
//               <label htmlFor="pi-phone">Phone Number *</label>
//               <input
//                 id="pi-phone"
//                 type="tel"
//                 placeholder="+91 98765 43210"
//                 value={phone}
//                 onChange={(e) => { setPhone(e.target.value); if (error) setError(''); }}
//                 disabled={submitting}
//                 required
//               />
//             </div>

//             {/* Inquiry-only fields */}
//             {mode === 'inquiry' && (
//               <>
//                 <div className="form-row">
//                   <label htmlFor="pi-project-name">Project Name *</label>
//                   <input
//                     id="pi-project-name"
//                     type="text"
//                     placeholder="e.g., E-Commerce Website"
//                     value={projectName}
//                     onChange={(e) => { setProjectName(e.target.value); if (error) setError(''); }}
//                     disabled={submitting}
//                     required
//                   />
//                 </div>

//                 <div className="form-row">
//                   <label htmlFor="pi-project-type">Project Type</label>
//                   <input
//                     id="pi-project-type"
//                     type="text"
//                     placeholder="e.g., Web Development, Mobile App"
//                     value={projectType}
//                     onChange={(e) => setProjectType(e.target.value)}
//                     disabled={submitting}
//                   />
//                 </div>

//                 <div className="form-row">
//                   <label htmlFor="pi-budget">Budget Range</label>
//                   <input
//                     id="pi-budget"
//                     type="text"
//                     placeholder="e.g., 5-10 Lakhs"
//                     value={budgetRange}
//                     onChange={(e) => setBudgetRange(e.target.value)}
//                     disabled={submitting}
//                   />
//                 </div>

//                 <div className="form-row">
//                   <label htmlFor="pi-timeline">Timeline</label>
//                   <input
//                     id="pi-timeline"
//                     type="text"
//                     placeholder="e.g., 3 months"
//                     value={timeline}
//                     onChange={(e) => setTimeline(e.target.value)}
//                     disabled={submitting}
//                   />
//                 </div>

//                 <div className="form-row full">
//                   <label htmlFor="pi-desc">Project Description *</label>
//                   <textarea
//                     id="pi-desc"
//                     rows={4}
//                     placeholder="Describe your project requirements in detail..."
//                     value={description}
//                     onChange={(e) => { setDescription(e.target.value); if (error) setError(''); }}
//                     disabled={submitting}
//                     required
//                   />
//                 </div>
//               </>
//             )}

//             {/* Consultation-only fields */}
//             {mode === 'consultation' && (
//               <>
//                 <div className="form-row full">
//                   <label htmlFor="pi-consult-topic">Consultation Topic *</label>
//                   <input
//                     id="pi-consult-topic"
//                     type="text"
//                     placeholder="e.g., Digital Transformation Strategy, AI Adoption"
//                     value={consultTopic}
//                     onChange={(e) => { setConsultTopic(e.target.value); if (error) setError(''); }}
//                     disabled={submitting}
//                     required
//                   />
//                 </div>

//                 <div className="form-row full">
//                   <label htmlFor="pi-consult-when">Preferred Time (Optional)</label>
//                   <input
//                     id="pi-consult-when"
//                     type="text"
//                     placeholder="e.g., Next week, Weekday evenings, Flexible"
//                     value={consultWhen}
//                     onChange={(e) => setConsultWhen(e.target.value)}
//                     disabled={submitting}
//                   />
//                 </div>

//                 <div className="form-row full">
//                   <label htmlFor="pi-consult-desc">What's on your mind? *</label>
//                   <textarea
//                     id="pi-consult-desc"
//                     rows={4}
//                     placeholder="Briefly describe your challenge or the topic you'd like to discuss..."
//                     value={consultDescription}
//                     onChange={(e) => { setConsultDescription(e.target.value); if (error) setError(''); }}
//                     disabled={submitting}
//                     required
//                   />
//                 </div>
//               </>
//             )}
//           </div>

//           {error && <div className="error-box">{error}</div>}

//           <button type="submit" className="submit-btn" disabled={submitting}>
//             {submitting ? (
//               <>
//                 <span className="spinner" /> Submitting…
//               </>
//             ) : (
//               <>
//                 {mode === 'inquiry' ? 'Submit Inquiry' : 'Request Free Consultation'} →
//               </>
//             )}
//           </button>

//           <p className="privacy-note">
//             🔒 Your information is safe. We reply within 24 hours.
//           </p>
//         </form>
//       </div>

//       <style jsx>{`
//         .inquiry-sec {
//           padding: 5rem clamp(.9rem, 3.5vw, 2rem);
//           background: var(--bg, #faf8ff);
//         }

//         .inquiry-wrap {
//           max-width: 720px;
//           margin: 0 auto;
//         }

//         .inquiry-header {
//           text-align: center;
//           margin-bottom: 28px;
//         }

//         .sec-label {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 6px 14px;
//           border-radius: 40px;
//           border: 1px solid rgba(27, 207, 180, 0.3);
//           background: rgba(27, 207, 180, 0.08);
//           font-size: 11px;
//           font-weight: 800;
//           color: var(--teal, #1bcbf4);
//           letter-spacing: 0.08em;
//           text-transform: uppercase;
//           margin-bottom: 14px;
//         }

//         .inquiry-title {
//           font-family: var(--font-h, Georgia, serif);
//           font-size: clamp(1.8rem, 3.2vw, 2.4rem);
//           font-weight: 900;
//           color: var(--text2, #1e2535);
//           line-height: 1.2;
//           letter-spacing: -0.5px;
//           margin: 0 0 10px;
//         }

//         .highlight {
//           background: linear-gradient(135deg, #1bcbf4, #1bcbf4);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         .inquiry-sub {
//           font-size: 14.5px;
//           color: var(--muted, #6b6a8a);
//           line-height: 1.7;
//           max-width: 500px;
//           margin: 0 auto;
//         }

//         /* Mode toggle */
//         .mode-toggle {
//           display: flex;
//           gap: 6px;
//           background: var(--card-bg, #fff);
//           border: 1px solid var(--border, #e9e2f8);
//           border-radius: 40px;
//           padding: 4px;
//           margin-bottom: 20px;
//           box-shadow: var(--shadow, 0 2px 16px rgba(0,0,0,0.05));
//         }

//         .mode-btn {
//           flex: 1;
//           padding: 11px 18px;
//           border-radius: 40px;
//           background: transparent;
//           border: none;
//           font-size: 13.5px;
//           font-weight: 700;
//           color: var(--muted, #6b6a8a);
//           cursor: pointer;
//           transition: all 0.25s ease;
//           font-family: inherit;
//         }

//         .mode-btn:hover:not(.active) {
//           color: var(--text2, #1e2535);
//           background: rgba(27, 207, 180, 0.06);
//         }

//         .mode-btn.active {
//           background: linear-gradient(135deg, #1bcbf4, #1bcbf4);
//           color: white;
//           box-shadow: 0 4px 16px rgba(27, 207, 180, 0.35);
//         }

//         /* Card */
//         .inquiry-card {
//           background: var(--card-bg, #fff);
//           border: 1px solid var(--border, #e9e2f8);
//           border-radius: 24px;
//           padding: 36px;
//           box-shadow: var(--shadow-lg, 0 8px 40px rgba(0,0,0,0.08));
//         }

//         .form-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 16px;
//           margin-bottom: 20px;
//         }

//         .form-row {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .form-row.full {
//           grid-column: 1 / -1;
//         }

//         .form-row label {
//           font-size: 12px;
//           font-weight: 600;
//           color: var(--text2, #1e2535);
//           letter-spacing: 0.2px;
//         }

//         .form-row input,
//         .form-row textarea {
//           padding: 12px 14px;
//           border: 1.5px solid var(--border, #e9e2f8);
//           border-radius: 12px;
//           background: var(--surface, rgba(0,0,0,0.02));
//           color: var(--text, #0c1018);
//           font-size: 14px;
//           font-family: inherit;
//           outline: none;
//           transition: all 0.2s ease;
//           resize: vertical;
//         }

//         .form-row input::placeholder,
//         .form-row textarea::placeholder {
//           color: var(--muted, #6b6a8a);
//           opacity: 0.65;
//         }

//         .form-row input:focus,
//         .form-row textarea:focus {
//           border-color: #1bcbf4;
//           background: var(--card-bg, #fff);
//           box-shadow: 0 0 0 4px rgba(27, 207, 180, 0.12);
//         }

//         .form-row input:disabled,
//         .form-row textarea:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .error-box {
//           padding: 12px 16px;
//           background: rgba(239, 68, 68, 0.08);
//           border: 1px solid rgba(239, 68, 68, 0.25);
//           border-radius: 10px;
//           color: #dc2626;
//           font-size: 13px;
//           line-height: 1.5;
//           margin-bottom: 16px;
//         }

//         .submit-btn {
//           width: 100%;
//           padding: 15px 24px;
//           border: none;
//           border-radius: 40px;
//           background: linear-gradient(135deg, #1bcbf4, #1bcbf4);
//           color: white;
//           font-size: 15px;
//           font-weight: 700;
//           cursor: pointer;
//           transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
//           box-shadow: 0 5px 20px rgba(27, 207, 180, 0.35);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 10px;
//           font-family: inherit;
//         }

//         .submit-btn:hover:not(:disabled) {
//           transform: translateY(-3px);
//           box-shadow: 0 10px 28px rgba(27, 207, 180, 0.5);
//         }

//         .submit-btn:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .spinner {
//           width: 15px;
//           height: 15px;
//           border: 2px solid rgba(255, 255, 255, 0.35);
//           border-top-color: white;
//           border-radius: 50%;
//           animation: spin 0.7s linear infinite;
//         }

//         @keyframes spin { to { transform: rotate(360deg); } }

//         .privacy-note {
//           text-align: center;
//           font-size: 11.5px;
//           color: var(--muted, #6b6a8a);
//           margin: 14px 0 0;
//         }

//         /* Success */
//         .success-card {
//           background: var(--card-bg, #fff);
//           border: 1px solid var(--border, #e9e2f8);
//           border-radius: 24px;
//           padding: 48px 36px;
//           text-align: center;
//           box-shadow: var(--shadow-lg, 0 8px 40px rgba(0,0,0,0.1));
//         }

//         .success-icon {
//           font-size: 64px;
//           margin-bottom: 14px;
//           animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
//         }

//         @keyframes pop {
//           from { transform: scale(0.4); opacity: 0; }
//           to { transform: scale(1); opacity: 1; }
//         }

//         .success-card h2 {
//           font-family: var(--font-h, Georgia, serif);
//           font-size: 26px;
//           font-weight: 900;
//           color: var(--text2, #1e2535);
//           margin: 0 0 12px;
//         }

//         .success-card p {
//           font-size: 15px;
//           color: var(--muted, #6b6a8a);
//           line-height: 1.65;
//           margin: 0 0 16px;
//         }

//         .ref-box {
//           display: inline-flex;
//           flex-direction: column;
//           gap: 4px;
//           padding: 12px 24px;
//           background: rgba(27, 207, 180, 0.1);
//           border-radius: 14px;
//           margin-bottom: 16px;
//         }

//         .ref-label {
//           font-size: 10.5px;
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: 0.08em;
//           color: var(--teal, #1bcbf4);
//         }

//         .ref-value {
//           font-family: monospace;
//           font-size: 16px;
//           font-weight: 700;
//           color: var(--teal, #1bcbf4);
//         }

//         .new-btn {
//           padding: 12px 28px;
//           border-radius: 40px;
//           background: linear-gradient(135deg, #1bcbf4, #1bcbf4);
//           color: white;
//           border: none;
//           font-weight: 700;
//           font-size: 14px;
//           cursor: pointer;
//           transition: transform 0.2s;
//         }

//         .new-btn:hover {
//           transform: translateY(-2px);
//         }

//         /* Responsive */
//         @media (max-width: 640px) {
//           .form-grid {
//             grid-template-columns: 1fr;
//           }

//           .inquiry-card {
//             padding: 24px 20px;
//             border-radius: 20px;
//           }

//           .mode-toggle {
//             flex-direction: column;
//           }

//           .success-card {
//             padding: 36px 24px;
//           }

//           .success-card h2 {
//             font-size: 22px;
//           }
//         }
//       `}</style>
//     </section>
//   );
// };

// export default ProjectInquiry;
"use client";

import React, { useState } from 'react';
import axios from 'axios';

// ============================================
// EXTERNAL INQUIRY API (no login required)
// ============================================

interface InquiryPayload {
  name: string;
  email: string;
  phoneNumber: string;
  projectName: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  projectDescription: string;
}

const submitInquiry = async (payload: InquiryPayload) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/external/project-inquiry`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.NEXT_PUBLIC_PROJECT_SOFTMAX_APIKEY || '',
      },
    }
  );
  return res.data;
};

// ============================================
// TYPES
// ============================================

type Mode = 'inquiry' | 'consultation';

type SuccessState = {
  referenceId?: string;
  message?: string;
  emailSentTo?: string;
};

// ============================================
// COMPONENT
// ============================================

const ProjectInquiry: React.FC = () => {
  const [mode, setMode] = useState<Mode>('inquiry');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [timeline, setTimeline] = useState('');
  const [description, setDescription] = useState('');

  const [consultTopic, setConsultTopic] = useState('');
  const [consultWhen, setConsultWhen] = useState('');
  const [consultDescription, setConsultDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<SuccessState | null>(null);

  const resetAll = () => {
    setName('');
    setEmail('');
    setPhone('');
    setProjectName('');
    setProjectType('');
    setBudgetRange('');
    setTimeline('');
    setDescription('');
    setConsultTopic('');
    setConsultWhen('');
    setConsultDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill Name, Email and Phone Number.');
      return;
    }

    setSubmitting(true);
    try {
      let payload: InquiryPayload;

      if (mode === 'inquiry') {
        if (!projectName.trim() || !description.trim()) {
          setError('Please fill Project Name and Description.');
          setSubmitting(false);
          return;
        }

        payload = {
          name: name.trim(),
          email: email.trim(),
          phoneNumber: phone.trim(),
          projectName: projectName.trim(),
          projectType: projectType.trim() || 'General',
          budgetRange: budgetRange.trim() || 'Not specified',
          timeline: timeline.trim() || 'Not specified',
          projectDescription: description.trim(),
        };
      } else {
        if (!consultTopic.trim() || !consultDescription.trim()) {
          setError('Please fill Consultation Topic and Description.');
          setSubmitting(false);
          return;
        }

        payload = {
          name: name.trim(),
          email: email.trim(),
          phoneNumber: phone.trim(),
          projectName: `Free Consultation: ${consultTopic.trim()}`,
          projectType: 'Free Consultation',
          budgetRange: 'Not specified',
          timeline: consultWhen.trim() || 'Flexible',
          projectDescription: consultDescription.trim(),
        };
      }

      const res = await submitInquiry(payload);
      setSuccess({
        referenceId: res?.referenceId,
        message: res?.message,
        emailSentTo: res?.emailSentTo,
      });
      resetAll();
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || '';

      if (status === 401) {
        setError('Unauthorized. Please check API key configuration.');
      } else if (status === 400) {
        setError(msg || 'Please check your details and try again.');
      } else if (/Missing Token/i.test(msg)) {
        setError('Backend: Missing Token — JwtFilter shouldNotFilter for /api/v1/external/');
      } else if (/Invalid or missing API key/i.test(msg)) {
        setError('Backend: Invalid API key — check "apikey" header name and value.');
      } else {
        setError(msg || 'Submission failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ============ SUCCESS SCREEN ============ */
  if (success) {
    return (
      <section className="inquiry-sec" id="inquiry">
        <div className="inquiry-wrap">
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h2>Inquiry Submitted!</h2>
            <p>
              {success.message ||
                'Your inquiry has been submitted. Our team will contact you soon.'}
            </p>
            {success.referenceId && (
              <div className="ref-box">
                <span className="ref-label">Reference ID</span>
                <span className="ref-value">{success.referenceId}</span>
              </div>
            )}
            {success.emailSentTo && (
              <p className="success-note">
                📧 Confirmation sent to <strong>{success.emailSentTo}</strong>
              </p>
            )}
            <button className="new-btn" onClick={() => setSuccess(null)}>
              Send another inquiry
            </button>
          </div>
        </div>

        <style>{`
          .inquiry-sec { padding: 5rem clamp(.9rem, 3.5vw, 2rem); background: var(--bg, #faf8ff); }
          .inquiry-wrap { max-width: 640px; margin: 0 auto; }
          .success-card { background: var(--card-bg, #fff); border: 1px solid var(--border, #e9e2f8); border-radius: 24px; padding: 48px 36px; text-align: center; box-shadow: var(--shadow-lg, 0 8px 40px rgba(0,0,0,0.1)); }
          .success-icon { font-size: 64px; margin-bottom: 14px; animation: pop 0.6s cubic-bezier(.34,1.56,.64,1); }
          @keyframes pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .success-card h2 { font-family: var(--font-h, Georgia, serif); font-size: 26px; font-weight: 900; color: var(--text2, #1e2535); margin: 0 0 12px; }
          .success-card p { font-size: 15px; color: var(--muted, #6b6a8a); line-height: 1.65; margin: 0 0 16px; }
          .ref-box { display: inline-flex; flex-direction: column; gap: 4px; padding: 12px 24px; background: rgba(27, 207, 180, 0.1); border-radius: 14px; margin-bottom: 16px; }
          .ref-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--teal, #1bcbf4); }
          .ref-value { font-family: monospace; font-size: 16px; font-weight: 700; color: var(--teal, #1bcbf4); }
          .success-note { font-size: 13px; color: var(--muted, #6b6a8a); margin: 0 0 20px; }
          .new-btn { padding: 12px 28px; border-radius: 40px; background: linear-gradient(135deg, #1bcbf4, #1bcbf4); color: white; border: none; font-weight: 700; font-size: 14px; cursor: pointer; transition: transform 0.2s; }
          .new-btn:hover { transform: translateY(-2px); }
        `}</style>
      </section>
    );
  }

  /* ============ FORM SCREEN ============ */
  return (
    <section className="inquiry-sec" id="inquiry">
      <div className="inquiry-wrap">
        {/* Header */}
        <div className="inquiry-header">
          <div className="sec-label">
            <i className="fas fa-bolt"></i> {mode === 'inquiry' ? 'Project Inquiry' : 'Free Consultation'}
          </div>
          <h2 className="inquiry-title">
            {mode === 'inquiry' ? (
              <>Tell us about <span className="highlight">your project</span></>
            ) : (
              <>Book a <span className="highlight">free consultation</span></>
            )}
          </h2>
          <p className="inquiry-sub">
            {mode === 'inquiry'
              ? 'Share your requirements — our team will analyse the problem and propose the right solution within 24 hours.'
              : 'No commitment, just a 30-minute call to understand your challenges and explore how SoftMax can help.'}
          </p>
        </div>

        {/* Toggle */}
        <div className="mode-toggle">
          <button
            type="button"
            className={`mode-btn ${mode === 'inquiry' ? 'active' : ''}`}
            onClick={() => { setMode('inquiry'); setError(''); }}
          >
            💼 Project Inquiry
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === 'consultation' ? 'active' : ''}`}
            onClick={() => { setMode('consultation'); setError(''); }}
          >
            🎯 Free Consultation
          </button>
        </div>

        {/* Card */}
        <form className="inquiry-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Common */}
            <div className="form-row full">
              <label htmlFor="pi-name">Full Name *</label>
              <input
                id="pi-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
                disabled={submitting}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="pi-email">Email *</label>
              <input
                id="pi-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                disabled={submitting}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="pi-phone">Phone Number *</label>
              <input
                id="pi-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (error) setError(''); }}
                disabled={submitting}
                required
              />
            </div>

            {/* Inquiry-only fields */}
            {mode === 'inquiry' && (
              <>
                <div className="form-row">
                  <label htmlFor="pi-project-name">Project Name *</label>
                  <input
                    id="pi-project-name"
                    type="text"
                    placeholder="e.g., E-Commerce Website"
                    value={projectName}
                    onChange={(e) => { setProjectName(e.target.value); if (error) setError(''); }}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="pi-project-type">Project Type</label>
                  <input
                    id="pi-project-type"
                    type="text"
                    placeholder="e.g., Web Development, Mobile App"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="pi-budget">Budget Range</label>
                  <input
                    id="pi-budget"
                    type="text"
                    placeholder="e.g., 5-10 Lakhs"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="pi-timeline">Timeline</label>
                  <input
                    id="pi-timeline"
                    type="text"
                    placeholder="e.g., 3 months"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="form-row full">
                  <label htmlFor="pi-desc">Project Description *</label>
                  <textarea
                    id="pi-desc"
                    rows={4}
                    placeholder="Describe your project requirements in detail..."
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); if (error) setError(''); }}
                    disabled={submitting}
                    required
                  />
                </div>
              </>
            )}

            {/* Consultation-only fields */}
            {mode === 'consultation' && (
              <>
                <div className="form-row full">
                  <label htmlFor="pi-consult-topic">Consultation Topic *</label>
                  <input
                    id="pi-consult-topic"
                    type="text"
                    placeholder="e.g., Digital Transformation Strategy, AI Adoption"
                    value={consultTopic}
                    onChange={(e) => { setConsultTopic(e.target.value); if (error) setError(''); }}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="form-row full">
                  <label htmlFor="pi-consult-when">Preferred Time (Optional)</label>
                  <input
                    id="pi-consult-when"
                    type="text"
                    placeholder="e.g., Next week, Weekday evenings, Flexible"
                    value={consultWhen}
                    onChange={(e) => setConsultWhen(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="form-row full">
                  <label htmlFor="pi-consult-desc">What's on your mind? *</label>
                  <textarea
                    id="pi-consult-desc"
                    rows={4}
                    placeholder="Briefly describe your challenge or the topic you'd like to discuss..."
                    value={consultDescription}
                    onChange={(e) => { setConsultDescription(e.target.value); if (error) setError(''); }}
                    disabled={submitting}
                    required
                  />
                </div>
              </>
            )}
          </div>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner" /> Submitting…
              </>
            ) : (
              <>
                {mode === 'inquiry' ? 'Submit Inquiry' : 'Request Free Consultation'} →
              </>
            )}
          </button>

          <p className="privacy-note">
            🔒 Your information is safe. We reply within 24 hours.
          </p>
        </form>
      </div>

      <style>{`
        .inquiry-sec {
          padding: 5rem clamp(.9rem, 3.5vw, 2rem);
          background: var(--bg, #faf8ff);
        }

        .inquiry-wrap {
          max-width: 720px;
          margin: 0 auto;
        }

        .inquiry-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .sec-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 40px;
          border: 1px solid rgba(27, 207, 180, 0.3);
          background: rgba(27, 207, 180, 0.08);
          font-size: 11px;
          font-weight: 800;
          color: var(--teal, #1bcbf4);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .inquiry-title {
          font-family: var(--font-h, Georgia, serif);
          font-size: clamp(1.8rem, 3.2vw, 2.4rem);
          font-weight: 900;
          color: var(--text2, #1e2535);
          line-height: 1.2;
          letter-spacing: -0.5px;
          margin: 0 0 10px;
        }

        .highlight {
          background: linear-gradient(135deg, #1bcbf4, #1bcbf4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .inquiry-sub {
          font-size: 14.5px;
          color: var(--muted, #6b6a8a);
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto;
        }

        .mode-toggle {
          display: flex;
          gap: 6px;
          background: var(--card-bg, #fff);
          border: 1px solid var(--border, #e9e2f8);
          border-radius: 40px;
          padding: 4px;
          margin-bottom: 20px;
          box-shadow: var(--shadow, 0 2px 16px rgba(0,0,0,0.05));
        }

        .mode-btn {
          flex: 1;
          padding: 11px 18px;
          border-radius: 40px;
          background: transparent;
          border: none;
          font-size: 13.5px;
          font-weight: 700;
          color: var(--muted, #6b6a8a);
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
        }

        .mode-btn:hover:not(.active) {
          color: var(--text2, #1e2535);
          background: rgba(27, 207, 180, 0.06);
        }

        .mode-btn.active {
          background: linear-gradient(135deg, #1bcbf4, #1bcbf4);
          color: white;
          box-shadow: 0 4px 16px rgba(27, 207, 180, 0.35);
        }

        .inquiry-card {
          background: var(--card-bg, #fff);
          border: 1px solid var(--border, #e9e2f8);
          border-radius: 24px;
          padding: 36px;
          box-shadow: var(--shadow-lg, 0 8px 40px rgba(0,0,0,0.08));
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .form-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-row.full {
          grid-column: 1 / -1;
        }

        .form-row label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text2, #1e2535);
          letter-spacing: 0.2px;
        }

        .form-row input,
        .form-row textarea {
          padding: 12px 14px;
          border: 1.5px solid var(--border, #e9e2f8);
          border-radius: 12px;
          background: var(--surface, rgba(0,0,0,0.02));
          color: var(--text, #0c1018);
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
          resize: vertical;
        }

        .form-row input::placeholder,
        .form-row textarea::placeholder {
          color: var(--muted, #6b6a8a);
          opacity: 0.65;
        }

        .form-row input:focus,
        .form-row textarea:focus {
          border-color: #1bcbf4;
          background: var(--card-bg, #fff);
          box-shadow: 0 0 0 4px rgba(27, 207, 180, 0.12);
        }

        .form-row input:disabled,
        .form-row textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-box {
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 10px;
          color: #dc2626;
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .submit-btn {
          width: 100%;
          padding: 15px 24px;
          border: none;
          border-radius: 40px;
          background: linear-gradient(135deg, #1bcbf4, #1bcbf4);
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 5px 20px rgba(27, 207, 180, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: inherit;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(27, 207, 180, 0.5);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .privacy-note {
          text-align: center;
          font-size: 11.5px;
          color: var(--muted, #6b6a8a);
          margin: 14px 0 0;
        }

        .success-card {
          background: var(--card-bg, #fff);
          border: 1px solid var(--border, #e9e2f8);
          border-radius: 24px;
          padding: 48px 36px;
          text-align: center;
          box-shadow: var(--shadow-lg, 0 8px 40px rgba(0,0,0,0.1));
        }

        .success-icon {
          font-size: 64px;
          margin-bottom: 14px;
          animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes pop {
          from { transform: scale(0.4); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-card h2 {
          font-family: var(--font-h, Georgia, serif);
          font-size: 26px;
          font-weight: 900;
          color: var(--text2, #1e2535);
          margin: 0 0 12px;
        }

        .success-card p {
          font-size: 15px;
          color: var(--muted, #6b6a8a);
          line-height: 1.65;
          margin: 0 0 16px;
        }

        .ref-box {
          display: inline-flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px 24px;
          background: rgba(27, 207, 180, 0.1);
          border-radius: 14px;
          margin-bottom: 16px;
        }

        .ref-label {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--teal, #1bcbf4);
        }

        .ref-value {
          font-family: monospace;
          font-size: 16px;
          font-weight: 700;
          color: var(--teal, #1bcbf4);
        }

        .new-btn {
          padding: 12px 28px;
          border-radius: 40px;
          background: linear-gradient(135deg, #1bcbf4, #1bcbf4);
          color: white;
          border: none;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .new-btn:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .inquiry-card {
            padding: 24px 20px;
            border-radius: 20px;
          }

          .mode-toggle {
            flex-direction: column;
          }

          .success-card {
            padding: 36px 24px;
          }

          .success-card h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </section>
  );
};

export default ProjectInquiry;