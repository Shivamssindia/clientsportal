"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Cta = () => {
    const router = useRouter();
    const { user } = useAuth();

    const handleBecomeClient = () => {
        if (!user) {
            window.triggerGoogleLogin?.();
            return;
        }
        router.push('/dashboard');
    };

    return (
        <section className="cta-sec" id="contact">
            <div className="cta-box fu">
                <div className="cta-text">
                    <div className="sec-label" style={{ marginBottom: '.7rem' }}>
                        <i className="fas fa-bolt"></i> Get Started Today
                    </div>
                    <h2>Ready to Solve<br />Your Business Problem?</h2>
                    <p>
                        SoftMax Technologies & IT Services builds AI-powered, scalable digital
                        systems that improve ROI, automate workflows, and deliver measurable results.
                        Let's find the right solution for your business.
                    </p>
                </div>
                <div className="cta-actions">
                    <button
                        className="btn-prim"
                        onClick={handleBecomeClient}
                    >
                        <i className="fas fa-rocket"></i>
                        Become a Client
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Cta;