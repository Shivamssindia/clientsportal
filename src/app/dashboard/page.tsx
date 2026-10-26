"use client";

import { JSX, useEffect, useState } from "react";
import axios from "axios";
import './dashboard.css';

import Navbar from "@/components/Navbar";
import Client from "@/components/dashboard/Client";
import NoRolePage from "@/components/dashboard/no-role";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const [roleComponent, setRoleComponent] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const { user, loading: authLoading } = useAuth();

  // ---------- COMPONENT FOR ROLE ----------
  const getComponentForRole = (role: any) => {
    if (!role || !role.ptype) {
      return <NoRolePage />;
    }

    if (role.ptype === "CLIENT") {
      return <Client />;
    }

    // Client-only portal — baaki koi role nahi allowed
    return <NoRolePage />;
  };

  // ---------- LOAD USER DETAILS ----------
  const getUserDetails = async () => {
    try {
      if (!user) {
        setNeedsLogin(true);
        setRoleComponent(<NoRolePage />);
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getmydetails`,
        { withCredentials: true }
      );

      console.log("User details response:", res.data);

      const data = res?.data?.data;

      if (!data) {
        console.error("Invalid response");
        setRoleComponent(<NoRolePage />);
        setLoading(false);
        return;
      }

      const roles = data.roles || [];
      const employee = data.employee;

      setUserRoles(roles);

      try {
        localStorage.setItem('userRoles', JSON.stringify(roles));
        localStorage.setItem('userEmployee', JSON.stringify(employee));
      } catch {}

      // No roles at all → just NoRolePage (no popup)
      if (roles.length === 0) {
        console.log("No roles found — showing NoRolePage");
        setCurrentRole(null);
        setRoleComponent(<NoRolePage />);
        return;
      }

      const initialRole = roles[0];

      // No CLIENT role → NoRolePage (no popup)
      const hasClientRole = roles.some(
        (r: any) => String(r?.ptype || '').toUpperCase() === "CLIENT"
      );

      if (!hasClientRole) {
        console.log("No CLIENT role — showing NoRolePage");
        setCurrentRole(initialRole);
        setRoleComponent(<NoRolePage />);
        return;
      }

      // CLIENT role hai — dashboard render karo
      setCurrentRole(initialRole);
      setRoleComponent(getComponentForRole(initialRole));

    } catch (error) {
      console.error("Error fetching user details", error);
      setRoleComponent(<NoRolePage />);
    } finally {
      setLoading(false);
    }
  };

  // ---------- ROLE CHANGE LISTENER ----------
  useEffect(() => {
    const handleRoleChange = (event: CustomEvent) => {
      const { role } = event.detail;
      setCurrentRole(role);

      if (role?.ptype === "CLIENT") {
        setRoleComponent(<Client />);
      } else {
        setRoleComponent(<NoRolePage />);
      }
    };

    window.addEventListener('roleChanged', handleRoleChange as EventListener);
    return () => {
      window.removeEventListener('roleChanged', handleRoleChange as EventListener);
    };
  }, []);

  // ---------- AUTH GUARD ----------
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setNeedsLogin(true);
      setLoading(false);
      setTimeout(() => {
        window.triggerGoogleLogin?.();
      }, 500);
      return;
    }

    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  // ---------- NOT LOGGED IN ----------
  if (!authLoading && needsLogin) {
    return (
      <>
        <Navbar currentRole={currentRole} userRoles={userRoles} />
        <main
          style={{
            marginTop: "80px",
            minHeight: "calc(100vh - 160px)",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "480px",
              padding: "2rem",
              background: "var(--card-bg, #ffffff)",
              border: "1px solid var(--border, #e5e7eb)",
              borderRadius: "20px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
            <h2
              style={{
                fontFamily: "var(--font-h, sans-serif)",
                fontSize: "1.5rem",
                fontWeight: 800,
                marginBottom: "0.5rem",
              }}
            >
              Login Required
            </h2>
            <p
              style={{
                color: "var(--muted, #6b7280)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              Please sign in with Google to access your SoftMax Client Portal.
            </p>
            <button
              className="btn-prim"
              onClick={() => window.triggerGoogleLogin?.()}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <i className="fas fa-sign-in-alt"></i> Sign in with Google
            </button>
          </div>
        </main>
      </>
    );
  }

  // ---------- DASHBOARD ----------
  return (
    <>
      <Navbar currentRole={currentRole} userRoles={userRoles} />

      <main
        style={{
          marginTop: "80px",
          minHeight: "calc(100vh - 160px)",
          padding: "20px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {loading || authLoading ? (
          <p className="loader">
            <img
              src="https://cdn.pixabay.com/animation/2025/05/05/15/47/15-47-41-779_512.gif"
              alt=""
            />
          </p>
        ) : (
          roleComponent
        )}
      </main>
    </>
  );
}