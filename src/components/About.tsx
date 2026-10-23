import React from 'react'

const About = () => {
    return (
        <>
            {/* <!-- =================== ABOUT =================== --> */}
            <section id="about" className="about-sec">
                <div className="sec-inner">
                    <div className="about-grid">
                        <div className="about-text fu">
                            <div className="sec-label"><i className="fas fa-seedling"></i> About Us</div>
                            <h2 className="sec-title">The SoftMax Story</h2>
                            <p>SoftMax Technologies & IT Services is a purpose-driven technology company focused on solving real business problems with AI and modern software. We find where your business is losing time, money, or opportunity — then build the exact digital system that fixes it.</p>
                            <p>Our approach is simple: understand the client's benefit first, engineer the solution, and deliver it with complete transparency. Through the SoftMax Client Portal, you can track your project's live status at every stage. No surprises. No technical anxiety. Just measurable progress.</p>
                            <div className="about-ctas">
                                <button className="btn-prim" onClick={() => { }}>How We Work →</button>
                                <button className="btn-outline-t">Case Studies</button>
                            </div>
                        </div>
                        <div className="about-visual fu d2">
                            <div className="av-row">
                                <div className="av-card"><div className="av-icon">🎯</div><h4>AI-First Problem Solving</h4><p>We analyse your business challenge and match it with the right AI and software solution.</p></div>
                                <div className="av-card"><div className="av-icon">📊</div><h4>Transparent Project Tracking</h4><p>Live status dashboards through our client portal — you always know where things stand.</p></div>
                            </div>
                            <div className="av-row">
                                <div className="av-card"><div className="av-icon">🌐</div><h4>Multi-Industry Expertise</h4><p>Agriculture, healthcare, booking systems, warehouse management, and more.</p></div>
                                <div className="av-card"><div className="av-icon">🔒</div><h4>Enterprise-Grade Delivery</h4><p>Sub-second response times, automated workflows, and cloud-native architecture.</p></div>
                            </div>
                            <div className="av-hero">
                                <div className="av-hero-num">ROI-First</div>
                                <div className="av-hero-lbl">Every solution is engineered to improve your return on investment — measurable, not theoretical.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default About