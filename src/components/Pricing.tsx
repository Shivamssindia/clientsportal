import { openModalClient, switchToSignIn, switchToSignUp } from '@/Script'
import React from 'react'

const Pricing = () => {
    return (
        <>
            <style>{`
                .company-description {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }

                .company-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 50px;
                    align-items: start;
                }

                .company-content {
                    background: #ffffff;
                    border-radius: 30px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
                }

                .company-intro {
                    position: relative;
                    margin-bottom: 30px;
                }

                .quote-icon {
                    font-size: 3rem;
                    color: #10b981;
                    opacity: 0.3;
                    margin-bottom: -20px;
                }

                .company-mission {
                    font-size: 1.8rem;
                    font-weight: 600;
                    color: #1a1a2e;
                    line-height: 1.3;
                    margin: 0;
                }

                .company-mission strong {
                    color: #10b981;
                }

                .company-text {
                    margin: 30px 0;
                }

                .company-text p {
                    color: #4a5568;
                    line-height: 1.7;
                    margin-bottom: 20px;
                    font-size: 1rem;
                }

                .company-text strong {
                    color: #10b981;
                }

                .core-values {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                    margin: 40px 0;
                    padding: 30px 0;
                    border-top: 1px solid #e2e8f0;
                    border-bottom: 1px solid #e2e8f0;
                }

                .value-item {
                    text-align: center;
                    flex: 1;
                }

                .value-item i {
                    font-size: 2rem;
                    color: #10b981;
                    margin-bottom: 15px;
                }

                .value-item h4 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin-bottom: 8px;
                }

                .value-item p {
                    font-size: 0.85rem;
                    color: #718096;
                    margin: 0;
                }

                .company-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin: 40px 0;
                }

                .stat {
                    text-align: center;
                }

                .stat-number {
                    display: block;
                    font-size: 2rem;
                    font-weight: 800;
                    color: #10b981;
                    margin-bottom: 5px;
                }

                .stat-label {
                    font-size: 0.85rem;
                    color: #718096;
                    font-weight: 500;
                }

                .company-cta {
                    display: flex;
                    gap: 15px;
                    margin-top: 30px;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    padding: 14px 28px;
                    border-radius: 50px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1rem;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
                }

                .btn-outline {
                    background: transparent;
                    color: #10b981;
                    border: 2px solid #10b981;
                    padding: 12px 26px;
                    border-radius: 50px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1rem;
                }

                .btn-outline:hover {
                    background: #10b981;
                    color: white;
                }

                .company-features {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 25px;
                }

                .feature-card {
                    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
                    border-radius: 20px;
                    padding: 30px;
                    transition: transform 0.3s, box-shadow 0.3s;
                    border: 1px solid rgba(16, 185, 129, 0.1);
                }

                .feature-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(16, 185, 129, 0.15);
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .feature-card i {
                    font-size: 2.5rem;
                    color: #10b981;
                    margin-bottom: 20px;
                }

                .feature-card h4 {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin-bottom: 12px;
                }

                .feature-card p {
                    color: #718096;
                    line-height: 1.5;
                    font-size: 0.9rem;
                    margin: 0;
                }

                .sec-label {
                    color: #10b981 !important;
                }

                .sec-label i {
                    color: #10b981 !important;
                }

                @media (max-width: 1024px) {
                    .company-grid {
                        grid-template-columns: 1fr;
                        gap: 30px;
                    }
                    
                    .company-features {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .core-values {
                        flex-direction: column;
                    }
                    
                    .company-stats {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 25px;
                    }
                    
                    .company-features {
                        grid-template-columns: 1fr;
                    }
                    
                    .company-cta {
                        flex-direction: column;
                    }
                    
                    .company-content {
                        padding: 25px;
                    }
                    
                    .company-mission {
                        font-size: 1.3rem;
                    }
                }
            `}</style>

            <section id="pricing" className="pricing-sec">
                <div className="sec-inner sec-c">
                    <div className="sec-label fu"><i className="fas fa-building"></i> About SoftMax</div>
                    <h2 className="sec-title fu d1">SoftMax Technologies <span style={{color: '#10b981'}}>& IT Services</span></h2>
                    <p className="sec-sub fu d2">Solving Business Problems with AI and Modern Technology</p>
                </div>

                <div className="sec-inner company-description fu">
                    <div className="company-grid">
                        <div className="company-content">
                            <div className="company-intro">
                                <div className="quote-icon">
                                    <i className="fas fa-quote-left"></i>
                                </div>
                                <p className="company-mission">
                                    We don't just build software — we build <strong>measurable business outcomes</strong>.
                                </p>
                            </div>
                            
                            <div className="company-text">
                                <p><strong>SoftMax Technologies & IT Services</strong> delivers high-velocity, scalable digital systems engineered to perform under pressure. We focus on zero technical anxiety, measurable business ROI, sub-second response times, and automated workflows.</p>
                                
                                <p>Our approach starts with your business problem. We analyse where you're losing time or money, then engineer the exact AI-powered or cloud-native solution that fixes it. From patient management systems and online booking platforms to AI-based agriculture tools and warehouse management software — we build technology that works for your business, not the other way around.</p>
                                
                                <p>Every client gets access to the <strong>SoftMax Client Portal</strong> — a transparent project tracking system where you can see live status, milestones, and progress at any time. Transparency and client care are SoftMax's first priorities.</p>
                            </div>

                            <div className="core-values">
                                <div className="value-item">
                                    <i className="fas fa-chart-line"></i>
                                    <h4>ROI-First</h4>
                                    <p>Every solution is measured by business impact</p>
                                </div>
                                <div className="value-item">
                                    <i className="fas fa-eye"></i>
                                    <h4>Transparent</h4>
                                    <p>Live project tracking through client portal</p>
                                </div>
                                <div className="value-item">
                                    <i className="fas fa-bolt"></i>
                                    <h4>High-Velocity</h4>
                                    <p>Sub-second response times, automated workflows</p>
                                </div>
                            </div>

                            <div className="company-stats">
                                <div className="stat">
                                    <span className="stat-number">99%</span>
                                    <span className="stat-label">Problems AI Can Solve</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">98%</span>
                                    <span className="stat-label">Client Satisfaction</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">500+</span>
                                    <span className="stat-label">Solutions Delivered</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">24/7</span>
                                    <span className="stat-label">Project Transparency</span>
                                </div>
                            </div>

                            <div className="company-cta">
                                <button className="btn-primary" onClick={() => { openModalClient(); switchToSignUp() }}>
                                    <i className="fas fa-rocket"></i> Start Your Project
                                </button>
                                <button className="btn-outline" onClick={() => { alert('📞 Contact us: softmaxdigitals@gmail.com') }}>
                                    <i className="fas fa-headset"></i> Talk to Expert
                                </button>
                            </div>
                        </div>

                        <div className="company-features">
                            <div className="feature-card">
                                <i className="fas fa-robot"></i>
                                <h4>AI-Powered Solutions</h4>
                                <p>We use machine learning, automation, and modern AI tools to solve business problems that traditional software cannot.</p>
                            </div>
                            <div className="feature-card">
                                <i className="fas fa-eye"></i>
                                <h4>Transparent Tracking</h4>
                                <p>Every client gets live access to project status through the SoftMax Client Portal — no guesswork, no anxiety.</p>
                            </div>
                            <div className="feature-card">
                                <i className="fas fa-chart-pie"></i>
                                <h4>Measurable ROI</h4>
                                <p>We don't ship features and disappear. We measure outcomes and iterate until the business impact is real.</p>
                            </div>
                            <div className="feature-card">
                                <i className="fas fa-layer-group"></i>
                                <h4>Modern Tech Stack</h4>
                                <p>Flutter, Kotlin, Next.js, Spring Boot, Spring AI, WebRTC, WebSocket, and Cloud DevOps — chosen for performance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Pricing









// import { openModalClient, switchToSignIn, switchToSignUp } from '@/Script'
// import React from 'react'

// const Pricing = () => {
//     return (
//         <>
//             <style>{`
//                 /* Company Description Styles - Green Theme */
//                 .company-description {
//                     max-width: 1400px;
//                     margin: 0 auto;
//                     padding: 40px 20px;
//                 }

//                 .company-grid {
//                     display: grid;
//                     grid-template-columns: 1fr 1fr;
//                     gap: 50px;
//                     align-items: start;
//                 }

//                 .company-content {
//                     background: #ffffff;
//                     border-radius: 30px;
//                     padding: 40px;
//                     box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
//                 }

//                 .company-intro {
//                     position: relative;
//                     margin-bottom: 30px;
//                 }

//                 .quote-icon {
//                     font-size: 3rem;
//                     color: #10b981;
//                     opacity: 0.3;
//                     margin-bottom: -20px;
//                 }

//                 .company-mission {
//                     font-size: 1.8rem;
//                     font-weight: 600;
//                     color: #1a1a2e;
//                     line-height: 1.3;
//                     margin: 0;
//                 }

//                 .company-mission strong {
//                     color: #10b981;
//                 }

//                 .company-text {
//                     margin: 30px 0;
//                 }

//                 .company-text p {
//                     color: #4a5568;
//                     line-height: 1.7;
//                     margin-bottom: 20px;
//                     font-size: 1rem;
//                 }

//                 .company-text strong {
//                     color: #10b981;
//                 }

//                 /* Core Values */
//                 .core-values {
//                     display: flex;
//                     justify-content: space-between;
//                     gap: 20px;
//                     margin: 40px 0;
//                     padding: 30px 0;
//                     border-top: 1px solid #e2e8f0;
//                     border-bottom: 1px solid #e2e8f0;
//                 }

//                 .value-item {
//                     text-align: center;
//                     flex: 1;
//                 }

//                 .value-item i {
//                     font-size: 2rem;
//                     color: #10b981;
//                     margin-bottom: 15px;
//                 }

//                 .value-item h4 {
//                     font-size: 1.1rem;
//                     font-weight: 700;
//                     color: #1a1a2e;
//                     margin-bottom: 8px;
//                 }

//                 .value-item p {
//                     font-size: 0.85rem;
//                     color: #718096;
//                     margin: 0;
//                 }

//                 /* Stats */
//                 .company-stats {
//                     display: grid;
//                     grid-template-columns: repeat(4, 1fr);
//                     gap: 20px;
//                     margin: 40px 0;
//                 }

//                 .stat {
//                     text-align: center;
//                 }

//                 .stat-number {
//                     display: block;
//                     font-size: 2rem;
//                     font-weight: 800;
//                     color: #10b981;
//                     margin-bottom: 5px;
//                 }

//                 .stat-label {
//                     font-size: 0.85rem;
//                     color: #718096;
//                     font-weight: 500;
//                 }

//                 /* Buttons */
//                 .company-cta {
//                     display: flex;
//                     gap: 15px;
//                     margin-top: 30px;
//                 }

//                 .btn-primary {
//                     background: linear-gradient(135deg, #10b981 0%, #059669 100%);
//                     color: white;
//                     border: none;
//                     padding: 14px 28px;
//                     border-radius: 50px;
//                     font-weight: 600;
//                     cursor: pointer;
//                     transition: transform 0.2s, box-shadow 0.2s;
//                     display: flex;
//                     align-items: center;
//                     gap: 10px;
//                     font-size: 1rem;
//                 }

//                 .btn-primary:hover {
//                     transform: translateY(-2px);
//                     box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
//                 }

//                 .btn-outline {
//                     background: transparent;
//                     color: #10b981;
//                     border: 2px solid #10b981;
//                     padding: 12px 26px;
//                     border-radius: 50px;
//                     font-weight: 600;
//                     cursor: pointer;
//                     transition: all 0.2s;
//                     display: flex;
//                     align-items: center;
//                     gap: 10px;
//                     font-size: 1rem;
//                 }

//                 .btn-outline:hover {
//                     background: #10b981;
//                     color: white;
//                 }

//                 /* Features Cards */
//                 .company-features {
//                     display: grid;
//                     grid-template-columns: 1fr;
//                     gap: 25px;
//                 }

//                 .feature-card {
//                     background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
//                     border-radius: 20px;
//                     padding: 30px;
//                     transition: transform 0.3s, box-shadow 0.3s;
//                     border: 1px solid rgba(16, 185, 129, 0.1);
//                 }

//                 .feature-card:hover {
//                     transform: translateY(-5px);
//                     box-shadow: 0 15px 30px rgba(16, 185, 129, 0.15);
//                     border-color: rgba(16, 185, 129, 0.3);
//                 }

//                 .feature-card i {
//                     font-size: 2.5rem;
//                     color: #10b981;
//                     margin-bottom: 20px;
//                 }

//                 .feature-card h4 {
//                     font-size: 1.2rem;
//                     font-weight: 700;
//                     color: #1a1a2e;
//                     margin-bottom: 12px;
//                 }

//                 .feature-card p {
//                     color: #718096;
//                     line-height: 1.5;
//                     font-size: 0.9rem;
//                     margin: 0;
//                 }

//                 /* Section Label Green */
//                 .sec-label {
//                     color: #10b981 !important;
//                 }

//                 .sec-label i {
//                     color: #10b981 !important;
//                 }

//                 /* Responsive */
//                 @media (max-width: 1024px) {
//                     .company-grid {
//                         grid-template-columns: 1fr;
//                         gap: 30px;
//                     }
                    
//                     .company-features {
//                         grid-template-columns: repeat(2, 1fr);
//                     }
//                 }

//                 @media (max-width: 768px) {
//                     .core-values {
//                         flex-direction: column;
//                     }
                    
//                     .company-stats {
//                         grid-template-columns: repeat(2, 1fr);
//                         gap: 25px;
//                     }
                    
//                     .company-features {
//                         grid-template-columns: 1fr;
//                     }
                    
//                     .company-cta {
//                         flex-direction: column;
//                     }
                    
//                     .company-content {
//                         padding: 25px;
//                     }
                    
//                     .company-mission {
//                         font-size: 1.3rem;
//                     }
//                 }
//             `}</style>

//             {/* <!-- =================== ABOUT GAURION BHARAT =================== --> */}
//             <section id="pricing" className="pricing-sec">
//                 <div className="sec-inner sec-c">
//                     <div className="sec-label fu"><i className="fas fa-building"></i> About Company</div>
//                     <h2 className="sec-title fu d1">Gaurion Bharat <span style={{color: '#10b981'}}>Pvt Ltd</span></h2>
//                     <p className="sec-sub fu d2">Empowering Indian Businesses Through Strategic Excellence</p>
//                 </div>

//                 {/* Company Description Section */}
//                 <div className="sec-inner company-description fu">
//                     <div className="company-grid">
//                         <div className="company-content">
//                             <div className="company-intro">
//                                 <div className="quote-icon">
//                                     <i className="fas fa-quote-left"></i>
//                                 </div>
//                                 <p className="company-mission">
//                                     We don't just consult — we partner for <strong>transformational growth</strong>.
//                                 </p>
//                             </div>
                            
//                             <div className="company-text">
//                                 <p><strong>Gaurion Bharat Pvt Ltd</strong> stands at the forefront of India's consulting revolution, combining cutting-edge AI technology with deep industry expertise to deliver measurable business outcomes. Founded with a vision to democratize expert consulting, we've successfully empowered over <strong>500+ businesses</strong> across manufacturing, technology, healthcare, and government sectors.</p>
                                
//                                 <p>Our proprietary <strong>AI-powered consultant matching platform</strong> ensures that every client connects with the perfect expert for their unique challenges. Whether you're an MSME seeking growth strategies or a large enterprise undergoing digital transformation, Gaurion Bharat provides end-to-end solutions that drive real results.</p>
//                             </div>

//                             <div className="core-values">
//                                 <div className="value-item">
//                                     <i className="fas fa-chart-line"></i>
//                                     <h4>Data-Driven</h4>
//                                     <p>Insights backed by real-time analytics</p>
//                                 </div>
//                                 <div className="value-item">
//                                     <i className="fas fa-handshake"></i>
//                                     <h4>Trust First</h4>
//                                     <p>Escrow protection & transparent dealings</p>
//                                 </div>
//                                 <div className="value-item">
//                                     <i className="fas fa-rocket"></i>
//                                     <h4>Fast Execution</h4>
//                                     <p>AI-matched consultants in 48 hours</p>
//                                 </div>
//                             </div>

//                             <div className="company-stats">
//                                 <div className="stat">
//                                     <span className="stat-number">500+</span>
//                                     <span className="stat-label">Projects Delivered</span>
//                                 </div>
//                                 <div className="stat">
//                                     <span className="stat-number">98%</span>
//                                     <span className="stat-label">Client Satisfaction</span>
//                                 </div>
//                                 <div className="stat">
//                                     <span className="stat-number">50+</span>
//                                     <span className="stat-label">Expert Consultants</span>
//                                 </div>
//                                 <div className="stat">
//                                     <span className="stat-number">24/7</span>
//                                     <span className="stat-label">Support Coverage</span>
//                                 </div>
//                             </div>

//                             <div className="company-cta">
//                                 <button className="btn-primary" onClick={() => { openModalClient(); switchToSignUp() }}>
//                                     <i className="fas fa-rocket"></i> Start Your Journey
//                                 </button>
//                                 <button className="btn-outline" onClick={() => { alert('📞 Contact us: hello@gaurionbharat.com') }}>
//                                     <i className="fas fa-headset"></i> Talk to Expert
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="company-features">
//                             <div className="feature-card">
//                                 <i className="fas fa-robot"></i>
//                                 <h4>AI-Powered Matching</h4>
//                                 <p>Intelligent algorithms find your ideal consultant based on industry, challenge type, and budget.</p>
//                             </div>
//                             <div className="feature-card">
//                                 <i className="fas fa-shield-alt"></i>
//                                 <h4>Escrow Protection</h4>
//                                 <p>Payments secured until milestone delivery — complete peace of mind.</p>
//                             </div>
//                             <div className="feature-card">
//                                 <i className="fas fa-chart-pie"></i>
//                                 <h4>Real-Time Dashboards</h4>
//                                 <p>Track KPIs, project progress, and ROI with intuitive analytics.</p>
//                             </div>
//                             <div className="feature-card">
//                                 <i className="fas fa-users"></i>
//                                 <h4>Managed Delivery</h4>
//                                 <p>End-to-end project management with dedicated account oversight.</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     )
// }

// export default Pricing

// // import { openModalClient, switchToSignIn, switchToSignUp } from '@/Script'
// // import React from 'react'

// // const Pricing = () => {
// //     return (
// //         <>
// //             {/* <!-- =================== PRICING =================== --> */}
// //             <section id="pricing" className="pricing-sec">
// //                 <div className="sec-inner sec-c">
// //                     <div className="sec-label fu"><i className="fas fa-layer-group"></i> Pricing</div>
// //                     <h2 className="sec-title fu d1">Transparent, Flexible Plans</h2>
// //                     <p className="sec-sub fu d2">From growing MSMEs to enterprise conglomerates — a plan for every stage of your journey.</p>
// //                 </div>
// //                 <div className="sec-inner pricing-grid">
// //                     <div className="pc fu d1">
// //                         <div className="pc-tier">Starter</div>
// //                         <div className="pc-price">₹49K <sub>/ project</sub></div>
// //                         <div className="pc-desc">Perfect for MSMEs and startups exploring consulting for the first time.</div>
// //                         <ul className="pc-feat">
// //                             <li><i className="fas fa-check-circle"></i>1 AI-matched consultant</li>
// //                             <li><i className="fas fa-check-circle"></i>Up to 3-month engagement</li>
// //                             <li><i className="fas fa-check-circle"></i>Basic KPI dashboard</li>
// //                             <li><i className="fas fa-check-circle"></i>Email &amp; chat support</li>
// //                             <li><i className="fas fa-check-circle"></i>Project escrow protection</li>
// //                         </ul>
// //                         <button className="btn-pc-out" onClick={()=>{openModalClient();switchToSignIn()}}>Get Started</button>
// //                     </div>
// //                     <div className="pc feat fu d2">
// //                         <div className="pc-badge">Most Popular</div>
// //                         <div className="pc-tier">Growth</div>
// //                         <div className="pc-price">₹1.8L <sub>/ quarter</sub></div>
// //                         <div className="pc-desc">For scaling enterprises needing ongoing strategic expertise and managed delivery.</div>
// //                         <ul className="pc-feat">
// //                             <li><i className="fas fa-check-circle"></i>Up to 3 simultaneous consultants</li>
// //                             <li><i className="fas fa-check-circle"></i>Unlimited projects per quarter</li>
// //                             <li><i className="fas fa-check-circle"></i>Advanced analytics dashboard</li>
// //                             <li><i className="fas fa-check-circle"></i>Dedicated account manager</li>
// //                             <li><i className="fas fa-check-circle"></i>Managed mode available</li>
// //                             <li><i className="fas fa-check-circle"></i>Priority 24/7 support</li>
// //                         </ul>
// //                         <button className="btn-pc" onClick={()=>{openModalClient();switchToSignUp()}}>Start Free Trial</button>
// //                     </div>
// //                     <div className="pc fu d3">
// //                         <div className="pc-tier">Enterprise</div>
// //                         <div className="pc-price">Custom <sub>pricing</sub></div>
// //                         <div className="pc-desc">Full-scale transformation programs for large enterprises and government bodies.</div>
// //                         <ul className="pc-feat">
// //                             <li><i className="fas fa-check-circle"></i>Unlimited consultants</li>
// //                             <li><i className="fas fa-check-circle"></i>Full managed mode execution</li>
// //                             <li><i className="fas fa-check-circle"></i>White-label dashboards</li>
// //                             <li><i className="fas fa-check-circle"></i>PPP deal structuring</li>
// //                             <li><i className="fas fa-check-circle"></i>On-site team deployment</li>
// //                             <li><i className="fas fa-check-circle"></i>SLA-guaranteed delivery</li>
// //                         </ul>
// //                         <button className="btn-pc-out" onClick={()=>{alert('📞 Our enterprise team will reach out within 2 business hours.\n\n📧 enterprise@gaurionbharat.com')}}>Contact Sales</button>
// //                     </div>
// //                 </div>
// //             </section>
// //         </>
// //     )
// // }

// // export default Pricing