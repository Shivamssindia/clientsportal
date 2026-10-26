// //@ts-nocheck
// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { useRouter, usePathname } from "next/navigation";
// import OneTapFirebase from "./OneTapFirebase";
// import Link from "next/link";

// export default function Navbar({ currentRole, userRoles }: { currentRole?: any, userRoles?: any[] }) {
//   // const [user, setUser] = useState(null);
//   const { isAuthenticated, loading, user } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDark, setIsDark] = useState(false);
//   const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
//   const [availableRoles, setAvailableRoles] = useState<any[]>([]);
//   const [activeRole, setActiveRole] = useState<any>(null);
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const nav = document.getElementById('nav') as HTMLElement,
//       sp = document.getElementById('sp') as HTMLElement,
//       btt = document.getElementById('btt') as HTMLElement;

//     const handleScroll = () => {
//       const s = window.scrollY,
//         max = document.documentElement.scrollHeight - window.innerHeight;

//       setIsScrolled(s > 50); // 🔥 main logic

//       nav?.classList.toggle('scrolled', s > 50);
//       btt?.classList.toggle('show', s > 500);

//       if (sp) sp.style.width = (max > 0 ? (s / max) * 100 : 0) + '%';
//     };

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//       btt?.removeEventListener('click', () => { });
//     };
//   }, []);

//   // Load user data and roles
//   useEffect(() => {
//     const loadUserData = async () => {
//       try {
//         // Try to get user data from localStorage first
//         const storedRoles = localStorage.getItem('userRoles');
//         const storedEmployee = localStorage.getItem('userEmployee');

//         if (storedRoles) {
//           const roles = JSON.parse(storedRoles);
//           setAvailableRoles(roles);

//           // Set active role from props or localStorage
//           if (currentRole) {
//             setActiveRole(currentRole);
//           } else if (roles.length > 0) {
//             setActiveRole(roles[0]);
//           }
//         }

//       } catch (error) {
//         console.error("Error loading user roles:", error);
//       }
//     };

//     loadUserData();
//   }, [isAuthenticated, currentRole]);

//   // Update available roles when prop changes
//   useEffect(() => {
//     if (userRoles && userRoles.length > 0) {
//       setAvailableRoles(userRoles);
//       if (!activeRole && userRoles.length > 0) {
//         setActiveRole(userRoles[0]);
//       }
//     }
//   }, [userRoles]);

//   const handleTheme = () => {
//     setIsDark(!isDark);
//     document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
//   };

//   const handleRoleSwitch = (role: any) => {
//     setActiveRole(role);
//     setIsRoleDropdownOpen(false);

//     // Store selected role in localStorage
//     localStorage.setItem('selectedRole', JSON.stringify(role));

//     // Dispatch event to update dashboard
//     const employeeData = localStorage.getItem('userEmployee');
//     const event = new CustomEvent('roleChanged', {
//       detail: {
//         role: role,
//         employee: employeeData ? JSON.parse(employeeData) : null
//       }
//     });
//     window.dispatchEvent(event);

//     // If on dashboard page, refresh to show updated content
//     if (pathname === '/dashboard') {
//       router.refresh();
//     }
//   };

//   const getRoleDisplayName = (role: any) => {
//     if (role.ptype === "CLIENT") return "Client";
//     if (role.ptype === "CONSULTANT") return "Consultant";
//     if (role.ptype === "EMP") {
//       const dept = getDepartmentName(role.departmentId);
//       const type = role.stype === "MANAGER" ? "Manager" : "Employee";
//       return `${type} - ${dept}`;
//     }
//     return role.ptype;
//   };

//   const getDepartmentName = (deptId: number) => {
//     const departments: { [key: number]: string } = {
//       1: "Head",
//       2: "BDE",
//       3: "HR",
//       4: "Finance",
//       5: "Core"
//     };
//     return departments[deptId] || "Unknown";
//   };

//   if (loading) return <div className="nav-placeholder h-16 bg-transparent"></div>;

//   return (
//     <>
//       {!isAuthenticated && <OneTapFirebase />}
//       <nav
//         className={`nav fixed top-0 left-0 w-full z-50 transition-all duration-300
//   ${isScrolled
//             ? "backdrop-blur-md bg-white/70 dark:var(--bg) shadow-md"
//             : "bg-transparent backdrop-blur-none"
//           }`}
//         id="nav"
//       >
//         <div className="nav-inner">
//           <a className="nav-logo" href="#">
//             <div className="logo-mk"><img src="img/logo.png" alt="" /></div>
//             <div className="logo-text"><span className="logo-gb">Softmax</span> client portal</div>
//           </a>
//           <ul className="nav-links">
//             <li><Link href="/">Home</Link></li>
//             <li><Link href="/about">About</Link></li>
//             <li><Link href="/service">Services</Link></li>
//             <li><Link href="/career">Career</Link></li>
//             <li><Link href="/contact">Contact</Link></li>
//           </ul>
//           <div className="nav-right">
//             <button className="btn-theme" onClick={handleTheme}>
//               <i className="fas fa-moon"></i>
//             </button>

//             {/* Role Switcher Dropdown - Only show on dashboard and when user has multiple roles */}
//             {isAuthenticated && availableRoles.length > 1 && pathname === '/dashboard' && (
//               <div className="relative ml-2">
//                 <button
//                   onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
//                   className="btn-role-switcher flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   <i className="fas fa-exchange-alt text-xs"></i>
//                   <span className="text-xs sm:text-sm font-medium">
//                     {activeRole ? getRoleDisplayName(activeRole) : "Switch Role"}
//                   </span>
//                   <i className={`fas fa-chevron-down text-xs transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`}></i>
//                 </button>

//                 {isRoleDropdownOpen && (
//                   <>
//                     <div
//                       className="fixed inset-0 z-40"
//                       onClick={() => setIsRoleDropdownOpen(false)}
//                     />
//                     <div className="role-switcher-dropdown">
//                       <div className="role-switcher-header">
//                         Switch Role
//                       </div>
//                       <div className="role-switcher-items">
//                         {availableRoles.map((role, index) => (
//                           <button
//                             key={index}
//                             onClick={() => handleRoleSwitch(role)}
//                             className={`role-switcher-item ${activeRole === role ? 'active' : ''}`}
//                           >
//                             <span>{getRoleDisplayName(role)}</span>
//                             {activeRole === role && (
//                               <span className="role-check">✓</span>
//                             )}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}

//             <div className="hidden md:flex items-center">
//               {isAuthenticated && user ? (
//                 <button
//                   className="btn-nav-pro flex items-center gap-1.5 sm:gap-2"
//                   onClick={() => router.push("/dashboard")}
//                 >
//                   <img
//                     src={user.photoUrl}
//                     alt="Profile"
//                     className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-blue-500"
//                   />
//                   <span className="hidden sm:inline text-xs sm:text-[.85rem] font-semibold text-amber-50 truncate max-w-[120px]">
//                     {user.name}
//                   </span>
//                 </button>
//               ) : (
//                 <button className="btn-nav-cta" onClick={() => window.triggerGoogleLogin?.()}>
//                   <i className="fas fa-user mr-1"></i>
//                   <span className="hidden sm:inline">Sign In</span>
//                 </button>
//               )}
//             </div>
//             <button
//               className={`hamburger ${isMenuOpen ? 'open' : ''}`}
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               <span></span><span></span><span></span>
//             </button>
//           </div>
//         </div>
//       </nav>
//       <div className={`mob-drawer ${isMenuOpen ? 'open' : ''}`} id="mobDrawer">
//         <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
//         <Link href="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
//         <Link href="/service" onClick={() => setIsMenuOpen(false)}>Services</Link>
//         <Link href="/career" onClick={() => setIsMenuOpen(false)}>Career</Link>
//         <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
//         <div className="mob-div"></div>
//         {isAuthenticated && user ? (
//           <>
//             {availableRoles.length > 1 && pathname === '/dashboard' && (
//               <div className="mb-2 px-4">
//                 <select
//                   onChange={(e) => {
//                     const selectedRole = availableRoles[parseInt(e.target.value)];
//                     if (selectedRole) handleRoleSwitch(selectedRole);
//                   }}
//                   className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
//                   value={activeRole ? availableRoles.indexOf(activeRole) : 0}
//                 >
//                   {availableRoles.map((role, idx) => (
//                     <option key={idx} value={idx}>
//                       {getRoleDisplayName(role)}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//             <button className="mob-cta-btn flex items-center gap-2" onClick={() => router.push("/dashboard")}>
//               <img src={user.photoUrl} className="w-10 h-10 rounded-full object-cover" alt="Profile" />
//               <span className="text-sm font-semibold">{user.name}</span>
//             </button>
//           </>
//         ) : (
//           <button className="mob-cta-btn" onClick={() => window.triggerGoogleLogin?.()}>
//             <i className="fas fa-user"></i> <span>Sign In</span>
//           </button>
//         )}
//       </div>
//     </>
//   );
// }


//@ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import OneTapFirebase from "./OneTapFirebase";
import Link from "next/link";

export default function Navbar({ currentRole, userRoles }: { currentRole?: any, userRoles?: any[] }) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [activeRole, setActiveRole] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = document.getElementById('nav') as HTMLElement,
      sp = document.getElementById('sp') as HTMLElement,
      btt = document.getElementById('btt') as HTMLElement;

    const handleScroll = () => {
      const s = window.scrollY,
        max = document.documentElement.scrollHeight - window.innerHeight;

      setIsScrolled(s > 50);
      nav?.classList.toggle('scrolled', s > 50);
      btt?.classList.toggle('show', s > 500);

      if (sp) sp.style.width = (max > 0 ? (s / max) * 100 : 0) + '%';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const bttHandler = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    btt?.addEventListener('click', bttHandler);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      btt?.removeEventListener('click', bttHandler);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedRoles = localStorage.getItem('userRoles');
        if (storedRoles) {
          const roles = JSON.parse(storedRoles);
          setAvailableRoles(roles);
          if (currentRole) setActiveRole(currentRole);
          else if (roles.length > 0) setActiveRole(roles[0]);
        }
      } catch (error) {
        console.error("Error loading user roles:", error);
      }
    };
    loadUserData();
  }, [isAuthenticated, currentRole]);

  useEffect(() => {
    if (userRoles && userRoles.length > 0) {
      setAvailableRoles(userRoles);
      if (!activeRole) setActiveRole(userRoles[0]);
    }
  }, [userRoles]);

  const handleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  const handleRoleSwitch = (role: any) => {
    setActiveRole(role);
    setIsRoleDropdownOpen(false);
    localStorage.setItem('selectedRole', JSON.stringify(role));

    const employeeData = localStorage.getItem('userEmployee');
    const event = new CustomEvent('roleChanged', {
      detail: {
        role: role,
        employee: employeeData ? JSON.parse(employeeData) : null
      }
    });
    window.dispatchEvent(event);

    if (pathname === '/dashboard') router.refresh();
  };

  const handleSignOut = async () => {
    try {
      setIsProfileDropdownOpen(false);
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
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
            <div className="logo-text"><span className="logo-gb">Softmax</span> </div>
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

            {/* Role Switcher */}
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
                    <div className="fixed inset-0 z-40" onClick={() => setIsRoleDropdownOpen(false)} />
                    <div className="role-switcher-dropdown">
                      <div className="role-switcher-header">Switch Role</div>
                      <div className="role-switcher-items">
                        {availableRoles.map((role, index) => (
                          <button
                            key={index}
                            onClick={() => handleRoleSwitch(role)}
                            className={`role-switcher-item ${activeRole === role ? 'active' : ''}`}
                          >
                            <span>{getRoleDisplayName(role)}</span>
                            {activeRole === role && <span className="role-check">✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Profile Dropdown (desktop) */}
            <div className="hidden md:flex items-center relative" ref={profileRef}>
              {isAuthenticated && user ? (
                <>
                  <button
                    className="btn-nav-pro flex items-center gap-1.5 sm:gap-2"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    <img
                      src={user.photoUrl}
                      alt="Profile"
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-blue-500"
                    />
                    <span className="hidden sm:inline text-xs sm:text-[.85rem] font-semibold text-amber-50 truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <i className={`fas fa-chevron-down text-xs transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {isProfileDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 12px)',
                        right: 0,
                        width: 260,
                        background: 'var(--card-bg, #ffffff)',
                        border: '1px solid var(--border, #e5e7eb)',
                        borderRadius: 14,
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                        padding: 8,
                        zIndex: 1000,
                        animation: 'pdIn 0.18s ease-out',
                      }}
                    >
                      {/* Header */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 10px 12px',
                        }}
                      >
                        <img
                          src={user.photoUrl}
                          alt="Profile"
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid var(--purple, #A05AFF)',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              fontSize: 13.5,
                              fontWeight: 700,
                              color: 'var(--text2, #1e2535)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              lineHeight: 1.3,
                            }}
                          >
                            {user.name}
                          </div>
                          <div
                            style={{
                              fontSize: 11.5,
                              color: 'var(--muted, #6b6a8a)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginTop: 2,
                              lineHeight: 1.3,
                            }}
                          >
                            {user.email}
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div
                        style={{
                          height: 1,
                          background: 'var(--border, #e5e7eb)',
                          margin: '2px 0 6px',
                        }}
                      />

                      {/* Dashboard */}
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          router.push('/dashboard');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 9,
                          background: 'transparent',
                          color: 'var(--text2, #1e2535)',
                          fontSize: 13,
                          fontWeight: 500,
                          textAlign: 'left',
                          cursor: 'pointer',
                          border: 'none',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--surface, rgba(160,90,255,0.08))';
                          e.currentTarget.style.color = 'var(--purple, #A05AFF)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text2, #1e2535)';
                        }}
                      >
                        <i className="fas fa-th-large" style={{ width: 16, textAlign: 'center', fontSize: 13 }}></i>
                        <span>Dashboard</span>
                      </button>

                      {/* Sign Out */}
                      <button
                        onClick={handleSignOut}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 9,
                          background: 'transparent',
                          color: '#e74c3c',
                          fontSize: 13,
                          fontWeight: 500,
                          textAlign: 'left',
                          cursor: 'pointer',
                          border: 'none',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <i className="fas fa-sign-out-alt" style={{ width: 16, textAlign: 'center', fontSize: 13 }}></i>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </>
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
            <button
              className="mob-cta-btn flex items-center gap-2"
              onClick={() => { setIsMenuOpen(false); router.push("/dashboard"); }}
            >
              <img src={user.photoUrl} className="w-10 h-10 rounded-full object-cover" alt="Profile" />
              <span className="text-sm font-semibold">{user.name}</span>
            </button>
            <button
              onClick={() => { setIsMenuOpen(false); handleSignOut(); }}
              style={{
                marginTop: '0.4rem',
                padding: '0.85rem',
                borderRadius: 12,
                background: 'transparent',
                color: '#e74c3c',
                fontSize: 14,
                fontWeight: 600,
                textAlign: 'center',
                width: '100%',
                border: '1px solid rgba(231, 76, 60, 0.35)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <button className="mob-cta-btn" onClick={() => window.triggerGoogleLogin?.()}>
            <i className="fas fa-user"></i> <span>Sign In</span>
          </button>
        )}
      </div>

      <style>{`
        @keyframes pdIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}