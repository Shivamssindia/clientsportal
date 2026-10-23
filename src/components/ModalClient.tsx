

"use client";

import { closeModal } from '@/Script';
import axios from 'axios';
import React, { useState } from 'react';
import { getAuth } from "firebase/auth";

type ClientTaskData = {
    companyName: string,
    companyMobileNumber: string,
    companyEmail: string,
    orgType: string,
    clientWebsite: string,
};

const ModalClient = () => {

    const [ClientTaskData, setClientTaskData] = useState<ClientTaskData>({
        companyName: '',
        companyMobileNumber: '',
        companyEmail: '',
        orgType: '',
        clientWebsite: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClientTaskData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 🔥 LOGIC UNCHANGED
    const RagisterClient = async () => {
        try {
            const auth = getAuth();

            if (!auth.currentUser) {
                alert("❌ Please login first");
                return;
            }

            const token = await auth.currentUser.getIdToken();
            console.log("🔥 TOKEN:", token);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/client/apply`,
                ClientTaskData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            console.log("✅ API RESPONSE:", response.data);
            alert("Client Data Submited Successfully!");

            setClientTaskData({
                companyName: '',
                companyMobileNumber: '',
                companyEmail: '',
                orgType: '',
                clientWebsite: '',
            });
            closeModal();
        } catch (error) {
            alert("Client already exist.");
        }
    };

    return (
        <>
            <div className="modal-mask" id="modalMask">
                <div className="modal-box softmax-client-modal">
                    <button className="m-close" onClick={closeModal}>
                        <i className="fas fa-times"></i>
                    </button>

                    <div className="sm-header">
                        <div className="sm-icon">🏢</div>
                        <div className="sm-heading">
                            <h2>Become a SoftMax Client</h2>
                            <p>
                                Tell us about your business. We'll analyse the problem and propose
                                the right technical solution.
                            </p>
                        </div>
                    </div>

                    <div className="m-form sm-form" id='fSI'>
                        <div className="sm-row">
                            <label htmlFor="companyName">Company Name</label>
                            <input
                                id="companyName"
                                name="companyName"
                                placeholder="e.g., Acme Pvt Ltd"
                                value={ClientTaskData.companyName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="sm-row">
                            <label htmlFor="companyMobileNumber">Mobile Number</label>
                            <input
                                id="companyMobileNumber"
                                name="companyMobileNumber"
                                placeholder="e.g., +91 98765 43210"
                                value={ClientTaskData.companyMobileNumber}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="sm-row">
                            <label htmlFor="companyEmail">Email Address</label>
                            <input
                                id="companyEmail"
                                name="companyEmail"
                                placeholder="you@company.com"
                                value={ClientTaskData.companyEmail}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="sm-row">
                            <label htmlFor="orgType">Organization Type</label>
                            <input
                                id="orgType"
                                name="orgType"
                                placeholder="e.g., Private Limited, LLP, Startup"
                                value={ClientTaskData.orgType}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="sm-row">
                            <label htmlFor="clientWebsite">Client Website</label>
                            <input
                                id="clientWebsite"
                                name="clientWebsite"
                                placeholder="e.g., https://yourcompany.com"
                                value={ClientTaskData.clientWebsite}
                                onChange={handleInputChange}
                            />
                        </div>

                        <button className="btn-msub sm-submit" onClick={RagisterClient}>
                            Submit <span className="sm-arrow">→</span>
                        </button>

                        <p className="sm-hint">
                            🔒 Your details are safe. Our team manually reviews every application.
                        </p>
                    </div>

                    <div className="m-form" id='fSU'></div>
                </div>
            </div>

            <style jsx>{`
                .modal-mask {
                    display: flex;
                    position: fixed;
                    inset: 0;
                    z-index: 2000;
                    background: rgba(0, 0, 0, 0.55);
                    backdrop-filter: blur(8px);
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                }

                .softmax-client-modal {
                    background: var(--card-bg, #ffffff);
                    border: 1px solid var(--border, #e0e6f0);
                    border-radius: 24px;
                    padding: 32px 28px;
                    width: 100%;
                    max-width: 520px;
                    max-height: 92vh;
                    overflow-y: auto;
                    position: relative;
                    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
                    animation: smModalIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
                    font-family: var(--font-b, 'DM Sans', system-ui, sans-serif);
                    margin: auto;
                }

                @keyframes smModalIn {
                    from { opacity: 0; transform: scale(0.94) translateY(12px); }
                    to { opacity: 1; transform: none; }
                }

                .softmax-client-modal .m-close {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    background: var(--surface, rgba(0, 0, 0, 0.04));
                    border: 1px solid var(--border, #e0e6f0);
                    color: var(--muted, #5e6f8a);
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .softmax-client-modal .m-close:hover {
                    background: #ef4444;
                    border-color: #ef4444;
                    color: white;
                }

                .sm-header {
                    display: flex;
                    gap: 14px;
                    align-items: flex-start;
                    margin-bottom: 22px;
                    padding-right: 32px;
                }

                .sm-icon {
                    font-size: 32px;
                    flex-shrink: 0;
                    line-height: 1;
                    padding-top: 4px;
                }

                .sm-heading {
                    flex: 1;
                    min-width: 0;
                }

                .sm-heading h2 {
                    font-family: var(--font-h, 'Fraunces', Georgia, serif);
                    font-size: 22px;
                    font-weight: 800;
                    margin: 0 0 6px;
                    color: var(--text2, #1e2535);
                    letter-spacing: -0.3px;
                    line-height: 1.2;
                }

                .sm-heading p {
                    font-size: 13.5px;
                    color: var(--muted, #5e6f8a);
                    line-height: 1.55;
                    margin: 0;
                }

                .sm-form {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    width: 100%;
                }

                .sm-row {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    width: 100%;
                }

                .sm-row label {
                    font-size: 12.5px;
                    font-weight: 600;
                    color: var(--text2, #1e2535);
                    letter-spacing: 0.2px;
                }

                .sm-row input {
                    padding: 12px 14px;
                    border: 1.5px solid var(--border, #e0e6f0);
                    border-radius: 12px;
                    background: var(--surface, rgba(0, 0, 0, 0.02));
                    color: var(--text, #0c1018);
                    font-size: 14px;
                    font-family: inherit;
                    outline: none;
                    transition: all 0.2s ease;
                    width: 100%;
                    box-sizing: border-box;
                }

                .sm-row input::placeholder {
                    color: var(--muted, #5e6f8a);
                    opacity: 0.6;
                }

                .sm-row input:focus {
                    border-color: #2ca6a4;
                    background: var(--card-bg, #ffffff);
                    box-shadow: 0 0 0 4px rgba(44, 166, 164, 0.12);
                }

                .sm-submit {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 14px 20px;
                    border: none;
                    border-radius: 50px;
                    background: linear-gradient(135deg, #2ca6a4 0%, #34a853 100%);
                    color: white;
                    font-size: 15px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 4px 16px rgba(44, 166, 164, 0.28);
                    margin-top: 6px;
                    box-sizing: border-box;
                }

                .sm-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(44, 166, 164, 0.38);
                }

                .sm-arrow {
                    transition: transform 0.25s ease;
                }

                .sm-submit:hover .sm-arrow {
                    transform: translateX(4px);
                }

                .sm-hint {
                    text-align: center;
                    font-size: 11.5px;
                    color: var(--muted, #5e6f8a);
                    margin: 4px 0 0;
                }

                /* Dark mode */
                [data-theme="dark"] .softmax-client-modal {
                    background: #0d1118;
                    border-color: rgba(255, 255, 255, 0.08);
                }
                [data-theme="dark"] .sm-heading h2,
                [data-theme="dark"] .sm-row label {
                    color: #e5ecff;
                }
                [data-theme="dark"] .sm-row input {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.1);
                    color: #e5ecff;
                }
                [data-theme="dark"] .sm-row input:focus {
                    background: rgba(255, 255, 255, 0.07);
                    border-color: #2ca6a4;
                }
                [data-theme="dark"] .softmax-client-modal .m-close {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                @media (max-width: 540px) {
                    .softmax-client-modal { padding: 24px 20px; border-radius: 20px; }
                    .sm-heading h2 { font-size: 19px; }
                    .sm-heading p { font-size: 13px; }
                    .sm-icon { font-size: 28px; }
                    .sm-submit { padding: 13px 18px; font-size: 14px; }
                }
            `}</style>
        </>
    );
};

export default ModalClient;







// "use client";

// import { closeModal, switchToSignIn, switchToSignUp } from '@/Script';
// import axios from 'axios';
// import React, { useState } from 'react';
// import { getAuth } from "firebase/auth"; // 🔥 ADD THIS

// type ClientTaskData = {
//     companyName: string,
//     companyMobileNumber: string,
//     companyEmail: string,
//     orgType: string,
//     clientWebsite: string,
// };

// const ModalClient = () => {

//     const [ClientTaskData, setClientTaskData] = useState<ClientTaskData>({
//         companyName: '',
//         companyMobileNumber: '',
//         companyEmail: '',
//         orgType: '',
//         clientWebsite: '',
//     });

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setClientTaskData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // 🔥 FINAL FIXED FUNCTION
//     const RagisterClient = async () => {
//         try {
//             const auth = getAuth();

//             if (!auth.currentUser) {
//                 alert("❌ Please login first");
//                 return;
//             }

//             // 🔥 GET FIREBASE JWT
//             const token = await auth.currentUser.getIdToken();

//             console.log("🔥 TOKEN:", token);

//             const response = await axios.post(
//                 `${process.env.NEXT_PUBLIC_API_URL}/api/client/apply`,
//                 ClientTaskData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`, // 🔥 FIXED
//                         "Content-Type": "application/json",
//                     },
//                     withCredentials: true,
//                 }
//             );

//             console.log("✅ API RESPONSE:", response.data);
//             alert("Client Data Submited Successfully!");

//             setClientTaskData({
//                 companyName: '',
//                 companyMobileNumber: '',
//                 companyEmail: '',
//                 orgType: '',
//                 clientWebsite: '',
//             });
//             closeModal();
//         } catch (error) {
//             // console.error("❌ Client Registration Error:", );
//             alert("Client already exist.");
//         }
        
//     };

//     return (
//         <>
//             <div className="modal-mask" id="modalMask">
//                 <div className="modal-box">
//                     <button className="m-close" onClick={closeModal}>
//                         <i className="fas fa-times"></i>
//                     </button>

//                     <h2>Become a SoftMax Client</h2>
// <p>Tell us about your business. We'll analyse the problem and propose the right technical solution.</p>

//                     <div className="m-tabs">
//                         <button id='tSI' className="m-tab on" onClick={switchToSignIn}>Sign In</button>
//                         <button id='tSU' className="m-tab" onClick={switchToSignUp}>Contact</button>
//                     </div>

//                     <div className="m-form" id='fSI'>
//                         <input name="companyName" placeholder="Company Name" value={ClientTaskData.companyName} onChange={handleInputChange} />
//                         <input name="companyMobileNumber" placeholder="Mobile Number" value={ClientTaskData.companyMobileNumber} onChange={handleInputChange} />
//                         <input name="companyEmail" placeholder="Email Address" value={ClientTaskData.companyEmail} onChange={handleInputChange} />
//                         <input name="orgType" placeholder="Organization Type" value={ClientTaskData.orgType} onChange={handleInputChange} />
//                         <input name="clientWebsite" placeholder="Client Website" value={ClientTaskData.clientWebsite} onChange={handleInputChange} />

//                         <button className="btn-msub" onClick={RagisterClient}>
//                             Submit →
//                         </button>
//                     </div>
//                     <div className="m-form" id='fSU'>

//                     </div>
//                     {/* <div className="m-form">
//                         <input
//                             name="marks10"
//                             placeholder="Enter 10th Marks"
//                             value={signUpData.marks10}
//                             onChange={handleInputChange}
//                         />

//                         <input
//                             name="marks12"
//                             placeholder="Enter 12th Marks"
//                             value={signUpData.marks12}
//                             onChange={handleInputChange}
//                         />

//                         <input
//                             name="graduationMarks"
//                             placeholder="Enter Graduation Marks"
//                             value={signUpData.graduationMarks}
//                             onChange={handleInputChange}
//                         />

//                         <input
//                             name="stream"
//                             placeholder="Enter Your Stream"
//                             value={signUpData.stream}
//                             onChange={handleInputChange}
//                         />

//                         <input
//                             name="experience"
//                             placeholder="Enter Experience (e.g. 3 years)"
//                             value={signUpData.experience}
//                             onChange={handleInputChange}
//                         />

//                         <input
//                             name="skill"
//                             placeholder="Enter Skills (Java, Spring Boot, React)"
//                             value={signUpData.skill}
//                             onChange={handleInputChange}
//                         />

//                         <input
//                             name="skillType"
//                             placeholder="Enter Skill Type"
//                             value={signUpData.skillType}
//                             onChange={handleInputChange}
//                         />

//                         <input
//                             type="file"
//                             name="resume"
//                             accept=".pdf,.doc,.docx"
//                             onChange={handleFileChange}
//                         />

//                         <button className="btn-msub" onClick={RagisterClient}>
//                             Submit →
//                         </button>
//                     </div> */}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ModalClient;