//@ts-nocheck
"use client";
import React from 'react'

const Services = () => {
    const industriesData = [
        {
            id: 1,
            name: "Agriculture & Allied",
            tag: "Agriculture",
            icon: "fas fa-seedling",
            color: "ct",
            frontDesc: "AI-powered farming solutions",
            description: "Precision farming, crop monitoring, AI-based yield prediction, and warehouse management systems that help agribusinesses reduce waste and increase output.",
            features: [
                "AI-Based Crop Monitoring",
                "Warehouse Management",
                "Supply Chain Optimization",
                "Yield Prediction & Analytics"
            ]
        },
        {
            id: 2,
            name: "Healthcare",
            tag: "Healthcare",
            icon: "fas fa-hospital-user",
            color: "cr",
            frontDesc: "Patient-first digital systems",
            description: "Online appointment booking, patient management systems, telemedicine platforms, and health data analytics for clinics, hospitals, and healthcare startups.",
            features: [
                "Online Booking Systems",
                "Patient Management Systems",
                "Telemedicine Platforms",
                "Health Data Analytics"
            ]
        },
        {
            id: 3,
            name: "MSME & Startups",
            tag: "MSME & Startups",
            icon: "fas fa-chart-line",
            color: "co",
            frontDesc: "Build, launch, scale",
            description: "Custom web and mobile applications, AI-powered automation, and scalable cloud infrastructure for growing businesses that need speed and reliability.",
            features: [
                "Custom Web & Mobile Apps",
                "AI Workflow Automation",
                "Cloud-Native Architecture",
                "ROI-Focused Development"
            ]
        },
        {
            id: 4,
            name: "Government & Public Sector",
            tag: "Government",
            icon: "fas fa-landmark",
            color: "cg",
            frontDesc: "Digital public infrastructure",
            description: "E-governance platforms, citizen service portals, and transparent project tracking systems for public-sector digital transformation.",
            features: [
                "E-Governance Solutions",
                "Citizen Engagement Portals",
                "Transparent Project Tracking",
                "Public Service Optimization"
            ]
        },
        {
            id: 5,
            name: "Education",
            tag: "Education",
            icon: "fas fa-graduation-cap",
            color: "cb",
            frontDesc: "Modern learning systems",
            description: "Learning management systems, digital classrooms, and skill-development platforms for institutions and EdTech startups.",
            features: [
                "Learning Management Systems",
                "Digital Classroom Platforms",
                "Student Management Systems",
                "EdTech Product Development"
            ]
        },
        {
            id: 6,
            name: "Retail & E-commerce",
            tag: "Retail",
            icon: "fas fa-shopping-cart",
            color: "ct",
            frontDesc: "Sell smarter, scale faster",
            description: "Inventory management, customer analytics, personalization engines, and omnichannel integration for seamless commerce experiences.",
            features: [
                "Inventory Management Systems",
                "Customer Analytics",
                "Personalization Engines",
                "Omnichannel Integration"
            ]
        },
        {
            id: 7,
            name: "Logistics & Warehousing",
            tag: "Logistics",
            icon: "fas fa-truck",
            color: "cg",
            frontDesc: "Move and store smarter",
            description: "Warehouse management systems, route optimization, fleet tracking, and real-time inventory visibility for efficient supply chain operations.",
            features: [
                "Warehouse Management Systems",
                "Route Optimization",
                "Fleet & Inventory Tracking",
                "Real-Time Visibility Dashboards"
            ]
        },
        {
            id: 8,
            name: "Manufacturing",
            tag: "Manufacturing",
            icon: "fas fa-industry",
            color: "cr",
            frontDesc: "Industry 4.0 ready",
            description: "Smart factory systems, predictive maintenance, supply chain automation, and operational efficiency tools for modern manufacturers.",
            features: [
                "Smart Factory Systems",
                "Predictive Maintenance",
                "Supply Chain Automation",
                "Operational Efficiency Analytics"
            ]
        },
        {
            id: 9,
            name: "Infrastructure",
            tag: "Infrastructure",
            icon: "fas fa-road",
            color: "cp",
            frontDesc: "Build with data",
            description: "Project management systems, IoT-enabled monitoring, and smart infrastructure solutions for construction and public works.",
            features: [
                "Project Management Systems",
                "IoT Infrastructure Monitoring",
                "Smart City Solutions",
                "Construction Tech Platforms"
            ]
        },
        {
            id: 10,
            name: "CSR & Social Impact",
            tag: "CSR",
            icon: "fas fa-hands-helping",
            color: "cb",
            frontDesc: "Purpose-driven technology",
            description: "Impact measurement systems, NGO partnership platforms, and community development tools for socially focused organizations.",
            features: [
                "Impact Measurement Systems",
                "NGO Partnership Platforms",
                "Community Development Tools",
                "CSR Reporting Dashboards"
            ]
        }
    ];

    const getDelayClass = (index: any) => {
        const delays = ["", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9"];
        return delays[index % delays.length];
    };

    return (
        <>
            {/* <!-- =================== INDUSTRIES WE SERVE =================== --> */}
            <section id="services" className="services-sec">
                <div className="sec-inner sec-c">
                    <div className="sec-label fu"><i className="fas fa-industry"></i> Industries We Serve</div>
                    <h2 className="sec-title fu d1">Sectors We Transform</h2>
                    <p className="sec-sub fu d2">Performance-driven. AI-enabled. ROI-focused. <strong style={{ color: "var(--teal)" }}>Hover a card</strong> to flip and explore industry details.</p>
                </div>
                <div className="sec-inner services-grid">
                    {industriesData.map((industry, index) => (
                        <div key={industry.id} className={`flip-card fu ${getDelayClass(index)} ${industry.color}`}>
                            <div className="flip-inner">
                                <div className="flip-front">
                                    <div className="flip-hint-lbl">
                                        <i className="fas fa-sync-alt"></i>Flip
                                    </div>
                                    <div className={`fc-icon ${industry.color}`}>
                                        <i className={industry.icon}></i>
                                    </div>
                                    <h3>{industry.name}</h3>
                                    <p className="fc-hint">{industry.frontDesc}</p>
                                </div>
                                
                                <div className={`flip-back ${industry.color}`}>
                                    <div className="fc-tag">{industry.tag}</div>
                                    <h3>{industry.name}</h3>
                                    <p>{industry.description}</p>
                                    <ul>
                                        {industry.features.map((feature, idx) => (
                                            <li key={idx}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Services