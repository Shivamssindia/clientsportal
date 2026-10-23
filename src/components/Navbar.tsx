//@ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import OneTapFirebase from "./OneTapFirebase";
import Link from "next/link";

export default function Navbar({ currentRole, userRoles }: { currentRole?: any, userRoles?: any[] }) {
  // const [user, setUser] = useState(null);
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [activeRole, setActiveRole] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const nav = document.getElementById('nav') as HTMLElement,
      sp = document.getElementById('sp') as HTMLElement,
      btt = document.getElementById('btt') as HTMLElement;

    const handleScroll = () => {
      const s = window.scrollY,
        max = document.documentElement.scrollHeight - window.innerHeight;

      setIsScrolled(s > 50); // 🔥 main logic

      nav?.classList.toggle('scrolled', s > 50);
      btt?.classList.toggle('show', s > 500);

      if (sp) sp.style.width = (max > 0 ? (s / max) * 100 : 0) + '%';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      btt?.removeEventListener('click', () => { });
    };
  }, []);

  // Load user data and roles
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Try to get user data from localStorage first
        const storedRoles = localStorage.getItem('userRoles');
        const storedEmployee = localStorage.getItem('userEmployee');

        if (storedRoles) {
          const roles = JSON.parse(storedRoles);
          setAvailableRoles(roles);

          // Set active role from props or localStorage
          if (currentRole) {
            setActiveRole(currentRole);
          } else if (roles.length > 0) {
            setActiveRole(roles[0]);
          }
        }

      } catch (error) {
        console.error("Error loading user roles:", error);
      }
    };

    loadUserData();
  }, [isAuthenticated, currentRole]);

  // Update available roles when prop changes
  useEffect(() => {
    if (userRoles && userRoles.length > 0) {
      setAvailableRoles(userRoles);
      if (!activeRole && userRoles.length > 0) {
        setActiveRole(userRoles[0]);
      }
    }
  }, [userRoles]);

  const handleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  const handleRoleSwitch = (role: any) => {
    setActiveRole(role);
    setIsRoleDropdownOpen(false);

    // Store selected role in localStorage
    localStorage.setItem('selectedRole', JSON.stringify(role));

    // Dispatch event to update dashboard
    const employeeData = localStorage.getItem('userEmployee');
    const event = new CustomEvent('roleChanged', {
      detail: {
        role: role,
        employee: employeeData ? JSON.parse(employeeData) : null
      }
    });
    window.dispatchEvent(event);

    // If on dashboard page, refresh to show updated content
    if (pathname === '/dashboard') {
      router.refresh();
    }
  };

  const getRoleDisplayName = (role: any) => {
    if (role.ptype === "CLIENT") return "Client";
    if (role.ptype === "CONSULTANT") return "Consultant";
    if (role.ptype === "EMP") {
      const dept = getDepartmentName(role.departmentId);
      const type = role.stype === "MANAGER" ? "Manager" : "Employee";
      return `${type} - ${dept}`;
    }
    return role.ptype;
  };

  const getDepartmentName = (deptId: number) => {
    const departments: { [key: number]: string } = {
      1: "Head",
      2: "BDE",
      3: "HR",
      4: "Finance",
      5: "Core"
    };
    return departments[deptId] || "Unknown";
  };

  if (loading) return <div className="nav-placeholder h-16 bg-transparent"></div>;

  return (
    <>
      {!isAuthenticated && <OneTapFirebase />}
      <nav
        className={`nav fixed top-0 left-0 w-full z-50 transition-all duration-300
  ${isScrolled
            ? "backdrop-blur-md bg-white/70 dark:var(--bg) shadow-md"
            : "bg-transparent backdrop-blur-none"
          }`}
        id="nav"
      >
        <div className="nav-inner">
          <a className="nav-logo" href="#">
            <div className="logo-mk"><img src="img/logo.png" alt="" /></div>
            <div className="logo-text"><span className="logo-gb">Softmax</span> client portal</div>
          </a>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/service">Services</Link></li>
            <li><Link href="/career">Career</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
          <div className="nav-right">
            <button className="btn-theme" onClick={handleTheme}>
              <i className="fas fa-moon"></i>
            </button>

            {/* Role Switcher Dropdown - Only show on dashboard and when user has multiple roles */}
            {isAuthenticated && availableRoles.length > 1 && pathname === '/dashboard' && (
              <div className="relative ml-2">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="btn-role-switcher flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <i className="fas fa-exchange-alt text-xs"></i>
                  <span className="text-xs sm:text-sm font-medium">
                    {activeRole ? getRoleDisplayName(activeRole) : "Switch Role"}
                  </span>
                  <i className={`fas fa-chevron-down text-xs transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {isRoleDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsRoleDropdownOpen(false)}
                    />
                    <div className="role-switcher-dropdown">
                      <div className="role-switcher-header">
                        Switch Role
                      </div>
                      <div className="role-switcher-items">
                        {availableRoles.map((role, index) => (
                          <button
                            key={index}
                            onClick={() => handleRoleSwitch(role)}
                            className={`role-switcher-item ${activeRole === role ? 'active' : ''}`}
                          >
                            <span>{getRoleDisplayName(role)}</span>
                            {activeRole === role && (
                              <span className="role-check">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="hidden md:flex items-center">
              {isAuthenticated && user ? (
                <button
                  className="btn-nav-pro flex items-center gap-1.5 sm:gap-2"
                  onClick={() => router.push("/dashboard")}
                >
                  <img
                    src={user.photoUrl}
                    alt="Profile"
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-blue-500"
                  />
                  <span className="hidden sm:inline text-xs sm:text-[.85rem] font-semibold text-amber-50 truncate max-w-[120px]">
                    {user.name}
                  </span>
                </button>
              ) : (
                <button className="btn-nav-cta" onClick={() => window.triggerGoogleLogin?.()}>
                  <i className="fas fa-user mr-1"></i>
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
            <button
              className={`hamburger ${isMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`mob-drawer ${isMenuOpen ? 'open' : ''}`} id="mobDrawer">
        <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link href="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
        <Link href="/service" onClick={() => setIsMenuOpen(false)}>Services</Link>
        <Link href="/career" onClick={() => setIsMenuOpen(false)}>Career</Link>
        <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        <div className="mob-div"></div>
        {isAuthenticated && user ? (
          <>
            {availableRoles.length > 1 && pathname === '/dashboard' && (
              <div className="mb-2 px-4">
                <select
                  onChange={(e) => {
                    const selectedRole = availableRoles[parseInt(e.target.value)];
                    if (selectedRole) handleRoleSwitch(selectedRole);
                  }}
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  value={activeRole ? availableRoles.indexOf(activeRole) : 0}
                >
                  {availableRoles.map((role, idx) => (
                    <option key={idx} value={idx}>
                      {getRoleDisplayName(role)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button className="mob-cta-btn flex items-center gap-2" onClick={() => router.push("/dashboard")}>
              <img src={user.photoUrl} className="w-10 h-10 rounded-full object-cover" alt="Profile" />
              <span className="text-sm font-semibold">{user.name}</span>
            </button>
          </>
        ) : (
          <button className="mob-cta-btn" onClick={() => window.triggerGoogleLogin?.()}>
            <i className="fas fa-user"></i> <span>Sign In</span>
          </button>
        )}
      </div>
    </>
  );
}



