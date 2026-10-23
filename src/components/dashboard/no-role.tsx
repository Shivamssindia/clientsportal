'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

type ClientTaskData = {
  companyName: string;
  companyMobileNumber: string;
  companyEmail: string;
  orgType: string;
  clientWebsite: string;
};

const NoRolePage: React.FC = () => {
  const { user } = useAuth();

  const [form, setForm] = useState<ClientTaskData>({
    companyName: '',
    companyMobileNumber: '',
    companyEmail: '',
    orgType: '',
    clientWebsite: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // basic validation
    if (
      !form.companyName.trim() ||
      !form.companyMobileNumber.trim() ||
      !form.companyEmail.trim()
    ) {
      setErrorMsg('Please fill Company Name, Mobile Number and Email.');
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        setErrorMsg('Please login first.');
        setLoading(false);
        return;
      }

      const token = await auth.currentUser.getIdToken(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client/apply`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      setSuccess(true);
      setForm({
        companyName: '',
        companyMobileNumber: '',
        companyEmail: '',
        orgType: '',
        clientWebsite: '',
      });

      // small delay to show success then reload to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1600);
    } catch (err: any) {
      console.error('Client apply failed:', err);
      setErrorMsg(
        err?.response?.data?.message ||
          'Client already exist or submission failed. Please check details.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     SUCCESS STATE
     ============================================================ */
  if (success) {
    return (
      <div className="profile-wrapper">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Profile Submitted Successfully!</h2>
          <p>
            Our team will review your details within 24–48 hours. You'll get
            access to the SoftMax Client Portal once approved.
          </p>
          <div className="success-redirect">
            <span className="spinner"></span>
            Redirecting to dashboard…
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     FORM STATE
     ============================================================ */
  return (
    <div className="profile-wrapper">
      {/* ===== HERO BANNER ===== */}
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-icon">👋</div>
          <div>
            <h1>
              Welcome, {user?.name?.split(' ')[0] || 'there'}!
            </h1>
            <p>Just one step away from the SoftMax Client Portal 🚀</p>
          </div>
        </div>
        <div className="status-pill">
          <span className="status-dot"></span>
          <span>Profile Incomplete</span>
        </div>
      </div>

      {/* ===== MAIN CARD ===== */}
      <div className="main-card">
        <div className="main-card-inner">
          <div className="main-icon">🏢</div>

          <h2 className="main-title">
            Please <span className="highlight-text">Complete Your Profile</span>
          </h2>

          <p className="main-desc">
            Tell us about your business so our team can analyse your problem
            and propose the right technical solution. Once approved, you'll
            get full access to the SoftMax Client Portal.
          </p>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  id="companyName"
                  name="companyName"
                  placeholder="e.g., Acme Pvt Ltd"
                  value={form.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="companyMobileNumber">Mobile Number *</label>
                <input
                  id="companyMobileNumber"
                  name="companyMobileNumber"
                  placeholder="e.g., +91 98765 43210"
                  value={form.companyMobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="companyEmail">Email Address *</label>
                <input
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  placeholder="you@company.com"
                  value={form.companyEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="orgType">Organization Type</label>
                <input
                  id="orgType"
                  name="orgType"
                  placeholder="e.g., Private Limited, LLP, Startup"
                  value={form.orgType}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="clientWebsite">Client Website</label>
                <input
                  id="clientWebsite"
                  name="clientWebsite"
                  placeholder="e.g., https://yourcompany.com"
                  value={form.clientWebsite}
                  onChange={handleChange}
                />
              </div>
            </div>

            {errorMsg && <div className="error-box">{errorMsg}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner"></span> Submitting…
                </>
              ) : (
                <>
                  Submit Profile <span className="arrow">→</span>
                </>
              )}
            </button>

            <p className="form-hint">
              🔒 Your details are safe. Our team reviews every application
              manually.
            </p>
          </form>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div className="how-section">
        <h3 className="how-title">What Happens Next? ✨</h3>

        <div className="how-grid">
          <div className="how-card">
            <div className="how-number">1</div>
            <div className="how-icon">📝</div>
            <h4>We Review</h4>
            <p>Our team checks your details</p>
          </div>

          <div className="how-card">
            <div className="how-number">2</div>
            <div className="how-icon">⏳</div>
            <h4>Approval</h4>
            <p>Usually within 24–48 hours</p>
          </div>

          <div className="how-card">
            <div className="how-number">3</div>
            <div className="how-icon">🎉</div>
            <h4>Access Portal</h4>
            <p>Post projects & track ROI</p>
          </div>
        </div>
      </div>

      {/* ===== HOME LINK ===== */}
      <div className="home-link-wrap">
        <Link href="/" className="home-link">
          🏠 Back to Home
        </Link>
      </div>

      <style jsx>{`
        .profile-wrapper {
          flex: 1;
          padding: 28px 36px;
          min-height: 100vh;
          background: var(--bg, #f5f7fc);
          font-family: var(--font-b, 'DM Sans', system-ui, sans-serif);
        }

        /* ===== HERO BANNER ===== */
        .hero-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding: 28px 36px;
          background: linear-gradient(
            135deg,
            rgba(44, 166, 164, 0.08),
            rgba(52, 168, 83, 0.04)
          );
          border-radius: 24px;
          border: 1px solid rgba(44, 166, 164, 0.1);
          flex-wrap: wrap;
          gap: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .hero-banner:hover {
          border-color: rgba(44, 166, 164, 0.2);
          box-shadow: 0 4px 24px rgba(44, 166, 164, 0.06);
        }

        .hero-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .hero-icon {
          font-size: 40px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .hero-content h1 {
          font-size: 26px;
          font-weight: 800;
          margin: 0;
          color: var(--text2, #1e2535);
          font-family: var(--font-h, 'Fraunces', Georgia, serif);
          letter-spacing: -0.5px;
        }

        .hero-content p {
          font-size: 15px;
          color: var(--muted, #5e6f8a);
          margin: 4px 0 0;
          font-weight: 500;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 24px;
          background: rgba(245, 158, 11, 0.12);
          border-radius: 50px;
          border: 1px solid rgba(245, 158, 11, 0.2);
          font-weight: 600;
          font-size: 14px;
          color: #f59e0b;
          white-space: nowrap;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #f59e0b;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.7);
          }
        }

        /* ===== MAIN CARD ===== */
        .main-card {
          
          border: 1px solid var(--border, #e0e6f0);
          border-radius: 28px;
          padding: 48px 44px;
          margin-bottom: 32px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
          transition: all 0.4s ease;
        }

        .main-card:hover {
          box-shadow: 0 8px 48px rgba(0, 0, 0, 0.08);
        }

        .main-card-inner {
          max-width: 820px;
          margin: 0 auto;
          text-align: center;
        }

        .main-icon {
          font-size: 64px;
          display: block;
          margin-bottom: 16px;
          animation: float 3s ease-in-out infinite;
        }

        .main-title {
          font-size: 32px;
          font-weight: 900;
          margin-bottom: 14px;
          color: var(--text2, #1e2535);
          font-family: var(--font-h, 'Fraunces', Georgia, serif);
          letter-spacing: -0.5px;
        }

        .highlight-text {
          background: linear-gradient(135deg, #2ca6a4, #34a853);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .main-desc {
          font-size: 16px;
          line-height: 1.8;
          color: var(--muted, #5e6f8a);
          margin-bottom: 32px;
          max-width: 620px;
          margin-left: auto;
          margin-right: auto;
        }

        /* ===== FORM ===== */
        .profile-form {
          text-align: left;
          max-width: 720px;
          margin: 0 auto;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field.full-width {
          grid-column: 1 / -1;
        }

        .form-field label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text2, #1e2535);
          letter-spacing: 0.2px;
        }

        .form-field input {
          padding: 14px 16px;
          border: 1.5px solid var(--border, #e0e6f0);
          border-radius: 12px;
          background: var(--surface, rgba(0, 0, 0, 0.02));
          color: var(--text, #0c1018);
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s ease;
          outline: none;
        }

        .form-field input::placeholder {
          color: var(--muted, #5e6f8a);
          opacity: 0.7;
        }

        .form-field input:focus {
          border-color: #2ca6a4;
          background: var(--card-bg, #ffffff);
          box-shadow: 0 0 0 4px rgba(44, 166, 164, 0.12);
        }

        /* ===== ERROR BOX ===== */
        .error-box {
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #dc2626;
          font-size: 13px;
          margin-bottom: 20px;
          text-align: left;
        }

        /* ===== SUBMIT BTN ===== */
        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          border: none;
          border-radius: 60px;
          background: var(--g-main, linear-gradient(135deg, #2ca6a4, #34a853));
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 20px rgba(44, 166, 164, 0.25);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(44, 166, 164, 0.35);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .arrow {
          transition: transform 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) .arrow {
          transform: translateX(4px);
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .form-hint {
          margin-top: 16px;
          text-align: center;
          font-size: 12.5px;
          color: var(--muted, #5e6f8a);
        }

        /* ===== HOW IT WORKS ===== */
        .how-section {
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--border, #e0e6f0);
          border-radius: 28px;
          padding: 40px 44px;
          margin-bottom: 24px;
        }

        .how-title {
          font-size: 24px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 32px;
          color: var(--text2, #1e2535);
          font-family: var(--font-h, 'Fraunces', Georgia, serif);
        }

        .how-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .how-card {
          background: var(--surface, rgba(0, 0, 0, 0.02));
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          border: 1px solid var(--border, #e0e6f0);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .how-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
          border-color: rgba(44, 166, 164, 0.2);
        }

        .how-number {
          position: absolute;
          top: -14px;
          right: -14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--g-main, linear-gradient(135deg, #34a853, #2ca6a4, #1f6da8));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 15px;
          box-shadow: 0 4px 16px rgba(44, 166, 164, 0.3);
        }

        .how-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 14px;
        }

        .how-card h4 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
          color: var(--text2, #1e2535);
        }

        .how-card p {
          font-size: 14px;
          color: var(--muted, #5e6f8a);
          margin: 0;
          line-height: 1.5;
        }

        /* ===== HOME LINK ===== */
        .home-link-wrap {
          text-align: center;
          padding: 12px 0 32px;
        }

        .home-link {
          display: inline-block;
          color: var(--muted, #5e6f8a);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 20px;
          border-radius: 40px;
          transition: all 0.2s ease;
        }

        .home-link:hover {
          color: #2ca6a4;
          background: rgba(44, 166, 164, 0.06);
        }

        /* ===== SUCCESS ===== */
        .success-card {
          max-width: 560px;
          margin: 80px auto;
          text-align: center;
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--border, #e0e6f0);
          border-radius: 28px;
          padding: 48px 36px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.06);
        }

        .success-icon {
          font-size: 64px;
          margin-bottom: 16px;
          animation: float 3s ease-in-out infinite;
        }

        .success-card h2 {
          font-family: var(--font-h, 'Fraunces', Georgia, serif);
          font-size: 26px;
          font-weight: 900;
          margin-bottom: 12px;
          color: var(--text2, #1e2535);
        }

        .success-card p {
          font-size: 15px;
          color: var(--muted, #5e6f8a);
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .success-redirect {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border-radius: 40px;
          background: rgba(44, 166, 164, 0.08);
          color: #2ca6a4;
          font-size: 13px;
          font-weight: 600;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(44, 166, 164, 0.3);
          border-top-color: #2ca6a4;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* ===== DARK MODE ===== */
        [data-theme='dark'] .main-card,
        [data-theme='dark'] .how-section,
        [data-theme='dark'] .how-card,
        [data-theme='dark'] .success-card {
          background: #0d1118;
          border-color: rgba(255, 255, 255, 0.07);
        }

        [data-theme='dark'] .hero-banner {
          background: rgba(44, 166, 164, 0.06);
          border-color: rgba(44, 166, 164, 0.08);
        }

        [data-theme='dark'] .hero-content h1,
        [data-theme='dark'] .main-title,
        [data-theme='dark'] .how-title,
        [data-theme='dark'] .how-card h4,
        [data-theme='dark'] .form-field label,
        [data-theme='dark'] .success-card h2 {
          color: #c7d0e8;
        }

        [data-theme='dark'] .form-field input {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.09);
          color: #e5ecff;
        }

        [data-theme='dark'] .form-field input:focus {
          background: rgba(255, 255, 255, 0.06);
          border-color: #2ca6a4;
        }

        [data-theme='dark'] .how-card {
          background: rgba(255, 255, 255, 0.03);
        }

        [data-theme='dark'] .status-pill {
          background: rgba(245, 158, 11, 0.08);
          border-color: rgba(245, 158, 11, 0.12);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .profile-wrapper {
            padding: 24px 28px;
          }
          .main-card {
            padding: 36px 32px;
          }
          .how-section {
            padding: 32px 28px;
          }
        }

        @media (max-width: 768px) {
          .profile-wrapper {
            padding: 16px;
          }
          .hero-banner {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px 24px;
          }
          .hero-content h1 {
            font-size: 22px;
          }
          .status-pill {
            padding: 8px 18px;
            font-size: 13px;
          }
          .main-title {
            font-size: 24px;
          }
          .main-desc {
            font-size: 14.5px;
          }
          .main-card {
            padding: 28px 20px;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .how-section {
            padding: 24px 20px;
          }
          .how-title {
            font-size: 20px;
          }
          .how-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .submit-btn {
            padding: 14px 20px;
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .main-title {
            font-size: 20px;
          }
          .main-icon {
            font-size: 48px;
          }
          .success-card {
            padding: 36px 24px;
            margin: 40px auto;
          }
          .success-card h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default NoRolePage;