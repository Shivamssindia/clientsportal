"use client";

import { JSX, useEffect, useState } from "react";
import axios from "axios";
import './dashboard.css';

import Navbar from "@/components/Navbar";
import Client from "@/components/dashboard/Client";
import NoRolePage from "@/components/dashboard/no-role";
import ModalClient from "@/components/ModalClient";
import { useAuth } from "@/contexts/AuthContext";
import { openModalClient, switchToSignIn } from "@/Script";

export default function DashboardPage() {
  const [roleComponent, setRoleComponent] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [mustCompleteProfile, setMustCompleteProfile] = useState(false);
  const { user, loading: authLoading } = useAuth();

  // ---------- OPEN CLIENT PROFILE FORM ----------
  const openClientForm = () => {
    setMustCompleteProfile(true);
    setTimeout(() => {
      openModalClient();
      switchToSignIn();
    }, 250);
  };

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
        openClientForm();
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

      // ✅ No roles at all → popup form
      if (roles.length === 0) {
        console.log("No roles found — opening client profile form");
        setCurrentRole(null);
        setRoleComponent(<NoRolePage />);
        openClientForm();
        return;
      }

      const initialRole = roles[0];

      // ✅ Client role check — agar CLIENT nahi hai to popup form
      const hasClientRole = roles.some(
        (r: any) => String(r?.ptype || '').toUpperCase() === "CLIENT"
      );

      if (!hasClientRole) {
        console.log("No CLIENT role — opening client profile form");
        setCurrentRole(initialRole);
        setRoleComponent(<NoRolePage />);
        openClientForm();
        return;
      }

      // ✅ CLIENT role hai — dashboard render karo
      setCurrentRole(initialRole);
      setRoleComponent(getComponentForRole(initialRole));

    } catch (error) {
      console.error("Error fetching user details", error);
      setRoleComponent(<NoRolePage />);
      openClientForm();
    } finally {
      setLoading(false);
    }
  };

  // ---------- ROLE CHANGE LISTENER ----------
  useEffect(() => {
    const handleRoleChange = (event: CustomEvent) => {
      const { role, employee } = event.detail;
      setCurrentRole(role);

      // Client-only portal logic
      if (role?.ptype === "CLIENT") {
        setRoleComponent(<Client />);
        setMustCompleteProfile(false);
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
          <>
            {roleComponent}
            {mustCompleteProfile && <ModalClient />}
          </>
        )}
      </main>
    </>
  );
}









// "use client";

// import { JSX, useEffect, useState } from "react";
// import axios from "axios";
// import './dashboard.css';

// import Navbar from "@/components/Navbar";
// import Client from "@/components/dashboard/Client";
// import NoRolePage from "@/components/dashboard/no-role";
// import ModalClient from "@/components/ModalClient";
// import { useAuth } from "@/contexts/AuthContext";
// import { openModalClient, switchToSignIn } from "@/Script";
// import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
// import "@/lib/firebase";

// export default function DashboardPage() {
//   const [roleComponent, setRoleComponent] = useState<JSX.Element | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [userRoles, setUserRoles] = useState<any[]>([]);
//   const [currentRole, setCurrentRole] = useState<any>(null);
//   const [needsLogin, setNeedsLogin] = useState(false);
//   const [mustCompleteProfile, setMustCompleteProfile] = useState(false);
//   const [clientDetails, setClientDetails] = useState<any>(null);
//   const { user, loading: authLoading } = useAuth();

//   // ---------- OPEN CLIENT PROFILE FORM ----------
//   const openClientForm = () => {
//     setMustCompleteProfile(true);
//     setTimeout(() => {
//       openModalClient();
//       switchToSignIn();
//     }, 250);
//   };

//   // ---------- HYBRID TOKEN FETCH (cookie independent) ----------
//   const getFirebaseToken = (): Promise<string | null> => {
//     return new Promise((resolve) => {
//       const auth = getAuth();
//       if (auth.currentUser) {
//         auth.currentUser
//           .getIdToken(true)
//           .then((t) => resolve(t))
//           .catch(() => resolve(null));
//         return;
//       }
//       let done = false;
//       const unsub = onAuthStateChanged(auth, (u: FirebaseUser | null) => {
//         if (done) return;
//         done = true;
//         unsub();
//         if (u) {
//           u.getIdToken(true).then((t) => resolve(t)).catch(() => resolve(null));
//         } else {
//           resolve(null);
//         }
//       });
//       setTimeout(() => {
//         if (!done) {
//           done = true;
//           try { unsub(); } catch {}
//           resolve(null);
//         }
//       }, 3000);
//     });
//   };

//   // ---------- HYBRID API CALL (cookie → Bearer fallback) ----------
//   const hybridGet = async (endpoint: string) => {
//     // Try cookie first
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
//         { withCredentials: true }
//       );
//       if (res?.data) return res.data;
//     } catch (e) {
//       // fall through to bearer
//     }
//     // Bearer fallback
//     const token = await getFirebaseToken();
//     if (!token) return null;
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return res.data;
//     } catch (e) {
//       return null;
//     }
//   };

//   // ---------- LOAD USER DETAILS ----------
//   const getUserDetails = async () => {
//     try {
//       if (!user) {
//         // Not logged in
//         setNeedsLogin(true);
//         setRoleComponent(<NoRolePage />);
//         setLoading(false);
//         return;
//       }

//       // Fetch /api/getmydetails (cookie → bearer)
//       const detailsData = await hybridGet('/api/getmydetails');
//       const data = detailsData?.data;

//       if (!data) {
//         // Logged in but no data → complete profile
//         setRoleComponent(<NoRolePage />);
//         openClientForm();
//         setLoading(false);
//         return;
//       }

//       const roles: any[] = data.roles || [];
//       const employee = data.employee;

//       setUserRoles(roles);
//       try {
//         localStorage.setItem('userRoles', JSON.stringify(roles));
//         localStorage.setItem('userEmployee', JSON.stringify(employee));
//       } catch {}

//       // Also fetch client details (helps us know approval status)
//       let clientInfo: any = null;
//       try {
//         const clientData = await hybridGet('/api/client/my-details');
//         clientInfo = clientData?.data || null;
//         setClientDetails(clientInfo);
//       } catch {}

//       // 🔥 CLIENT ROLE CHECK
//       const clientRoleFromRoles = roles.find((r: any) => r.ptype === "CLIENT");
//       const hasClientRole = !!clientRoleFromRoles || !!clientInfo;

//       if (!hasClientRole) {
//         // Koi bhi role ho, but client nahi → auto profile complete form
//         setCurrentRole(roles[0] || null);
//         setRoleComponent(<NoRolePage />);
//         openClientForm();
//         return;
//       }

//       // Client role mila — approval status check
//       const approval =
//         clientRoleFromRoles?.isApproved ||
//         clientRoleFromRoles?.isapproved ||
//         clientInfo?.isApproved ||
//         clientInfo?.clientStatus;

//       const isApproved =
//         approval === 'APPROVED' ||
//         approval === 'ACTIVE' ||
//         approval === true;

//       if (isApproved) {
//         setCurrentRole(clientRoleFromRoles || { ptype: 'CLIENT' });
//         setRoleComponent(<Client />);
//       } else {
//         // PENDING / REJECTED / unknown → NoRolePage, form nahi
//         setCurrentRole(clientRoleFromRoles || { ptype: 'CLIENT', isApproved: approval });
//         setRoleComponent(<NoRolePage />);
//       }

//     } catch (error) {
//       console.error("Error fetching user details", error);
//       setRoleComponent(<NoRolePage />);
//       openClientForm();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- ROLE CHANGE LISTENER ----------
//   useEffect(() => {
//     const handleRoleChange = (event: CustomEvent) => {
//       const { role } = event.detail;
//       if (role?.ptype === "CLIENT" && (role?.isApproved === "APPROVED" || role?.isapproved === "APPROVED")) {
//         setCurrentRole(role);
//         setRoleComponent(<Client />);
//         setMustCompleteProfile(false);
//       } else {
//         setCurrentRole(role);
//         setRoleComponent(<NoRolePage />);
//       }
//     };

//     window.addEventListener('roleChanged', handleRoleChange as EventListener);
//     return () => {
//       window.removeEventListener('roleChanged', handleRoleChange as EventListener);
//     };
//   }, []);

//   // ---------- AUTH GUARD ----------
//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       setNeedsLogin(true);
//       setLoading(false);
//       // auto trigger Google login after short delay
//       setTimeout(() => {
//         window.triggerGoogleLogin?.();
//       }, 500);
//       return;
//     }

//     getUserDetails();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, authLoading]);

//   // ---------- NOT LOGGED IN VIEW ----------
//   if (!authLoading && needsLogin) {
//     return (
//       <>
//         <Navbar currentRole={currentRole} userRoles={userRoles} />
//         <main
//           style={{
//             marginTop: "80px",
//             minHeight: "calc(100vh - 160px)",
//             padding: "20px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxSizing: "border-box",
//           }}
//         >
//           <div
//             style={{
//               textAlign: "center",
//               maxWidth: "480px",
//               padding: "2rem",
//               background: "var(--card-bg, #ffffff)",
//               border: "1px solid var(--border, #e5e7eb)",
//               borderRadius: "20px",
//               boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
//             }}
//           >
//             <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
//             <h2
//               style={{
//                 fontFamily: "var(--font-h, sans-serif)",
//                 fontSize: "1.5rem",
//                 fontWeight: 800,
//                 marginBottom: "0.5rem",
//               }}
//             >
//               Login Required
//             </h2>
//             <p
//               style={{
//                 color: "var(--muted, #6b7280)",
//                 fontSize: "0.9rem",
//                 lineHeight: 1.6,
//                 marginBottom: "1.5rem",
//               }}
//             >
//               Please sign in with Google to access your SoftMax Client Portal.
//             </p>
//             <button
//               className="btn-prim"
//               onClick={() => window.triggerGoogleLogin?.()}
//               style={{ width: "100%", justifyContent: "center" }}
//             >
//               <i className="fas fa-sign-in-alt"></i> Sign in with Google
//             </button>
//           </div>
//         </main>
//       </>
//     );
//   }

//   // ---------- DASHBOARD VIEW ----------
//   return (
//     <>
//       <Navbar currentRole={currentRole} userRoles={userRoles} />

//       <main
//         style={{
//           marginTop: "80px",
//           minHeight: "calc(100vh - 160px)",
//           padding: "20px",
//           width: "100%",
//           boxSizing: "border-box",
//         }}
//       >
//         {loading || authLoading ? (
//           <p className="loader">
//             <img
//               src="https://cdn.pixabay.com/animation/2025/05/05/15/47/15-47-41-779_512.gif"
//               alt=""
//             />
//           </p>
//         ) : (
//           <>
//             {roleComponent}

//             {/* Profile completion modal — only mounts when needed */}
//             {mustCompleteProfile && <ModalClient />}
//           </>
//         )}
//       </main>
//     </>
//   );
// }












// // "use client";

// // import { JSX, useEffect, useState } from "react";
// // import axios from "axios";
// // import './dashboard.css';

// // import Navbar from "@/components/Navbar";
// // import Footer from "@/components/Footer";
// // import Client from "@/components/dashboard/Client";
// // import Consultent from "@/components/dashboard/Consultent";
// // import Manager from "@/components/dashboard/Manager";
// // import Dhead from "@/components/dashboard/Dhead";
// // import Dbde from "@/components/dashboard/Dbde";
// // import Dhr from "@/components/dashboard/Dhr";
// // import Dfinance from "@/components/dashboard/Dfinance";
// // import Dcore from "@/components/dashboard/Dcore";
// // import NoRolePage from "@/components/dashboard/no-role";
// // import { useAuth } from "@/contexts/AuthContext";

// // export default function DashboardPage() {
// //   const [roleComponent, setRoleComponent] = useState<JSX.Element | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [userRoles, setUserRoles] = useState<any[]>([]);
// //   const [currentRole, setCurrentRole] = useState<any>(null);
// //   const { user } = useAuth();

// //   const getDirectorComponent = (departmentId: number) => {
// //     switch (departmentId) {
// //       case 1: return <Dhead />;      // HEAD department director
// //       case 2: return <Dhr />;         // Human Resource director
// //       case 3: return <Dbde />;        // Business Development director
// //       case 4: return <Dfinance />;    // Finance director
// //       case 5: return <Dcore />;       // CSE director
// //       default: return <Dcore />;      // 5+ department ke liye Core director
// //     }
// //   };

// //   const getComponentForRole = (role: any, employee: any) => {
// //     // Agar role null ya undefined hai toh NoRolePage
// //     if (!role || !role.ptype) {
// //       return <NoRolePage />;
// //     }

// //     if (role.ptype === "CLIENT") {
// //       return <Client />;
// //     }
// //     else if (role.ptype === "CONSULTANT") {
// //       // return <Consultent />;
// //       return <NoRolePage />;
// //     }
// //     else if (role.ptype === "EMP") {
// //       const stype = role.stype?.toUpperCase();
      
// //       // MANAGER: hamesha Manager page (kisi bhi department ke liye)
// //       if (stype === "MANAGER") {
// //         // return <Manager />;
// //         return <NoRolePage />;
// //       }
// //       // DIRECTOR: department dekhna hoga
// //       else if (stype === "DIRECTOR") {
// //         // return getDirectorComponent(employee?.departmentId);
// //         return <NoRolePage />;
// //       }
// //       // Other EMP types: default Core component
// //       else {
// //         // return <Dcore />;
// //         return <NoRolePage />;
// //       }
// //     }
// //     return <NoRolePage />;
// //   };

// //   const getUserDetails = async () => {
// //     try {
// //       const res = await axios.get(
// //         `${process.env.NEXT_PUBLIC_API_URL}/api/getmydetails`,
// //         { withCredentials: true }
// //       );

// //       console.log("User details response:", res.data);

// //       const data = res?.data?.data;

// //       if (!data) {
// //         console.error("Invalid response");
// //         setRoleComponent(<NoRolePage />);
// //         setLoading(false);
// //         return;
// //       }

// //       const roles = data.roles || [];
// //       const employee = data.employee;
      
// //       setUserRoles(roles);
      
// //       localStorage.setItem('userRoles', JSON.stringify(roles));
// //       localStorage.setItem('userEmployee', JSON.stringify(employee));

// //       // ✅ IMPORTANT: Agar roles empty hai toh NoRolePage set karo
// //       if (roles.length === 0) {
// //         console.log("No roles found, showing NoRolePage");
// //         setCurrentRole(null);
// //         setRoleComponent(<NoRolePage />);
// //       } else {
// //         const initialRole = roles[0];
// //         setCurrentRole(initialRole);
// //         setRoleComponent(getComponentForRole(initialRole, employee));
// //       }

// //     } catch (error) {
// //       console.error("Error fetching user details", error);
// //       setRoleComponent(<NoRolePage />);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     const handleRoleChange = (event: CustomEvent) => {
// //       const { role, employee } = event.detail;
// //       setCurrentRole(role);
      
// //       const empData = employee || JSON.parse(localStorage.getItem('userEmployee') || '{}');
// //       setRoleComponent(getComponentForRole(role, empData));
// //     };

// //     window.addEventListener('roleChanged', handleRoleChange as EventListener);
// //     return () => {
// //       window.removeEventListener('roleChanged', handleRoleChange as EventListener);
// //     };
// //   }, []);

// //   useEffect(() => {
// //     getUserDetails();
// //   }, []);
  
// //   console.log("Current Role:", currentRole);
// //   console.log("User Roles:", userRoles);
  
// //   return (
// //     <>
// //       <Navbar currentRole={currentRole} userRoles={userRoles} />
      
// //       <main
// //         style={{
// //           marginTop: "80px",
// //           minHeight: "calc(100vh - 160px)",
// //           padding: "20px",
// //           width: "100%",
// //           boxSizing: "border-box"
// //         }}
// //       >
// //         {loading ? (
// //           <p className="loader"><img src="https://cdn.pixabay.com/animation/2025/05/05/15/47/15-47-41-779_512.gif" alt="" /></p>
// //         ) : (
// //           <>
// //             {roleComponent}
// //           </>
// //         )}
// //       </main>
// //     </>
// //   );
// // }






// // // "use client";

// // // import { JSX, useEffect, useState } from "react";
// // // import axios from "axios";
// // // import './dashboard.css';

// // // import Navbar from "@/components/Navbar";
// // // import Footer from "@/components/Footer";
// // // import Client from "@/components/dashboard/Client";
// // // import Consultent from "@/components/dashboard/Consultent";
// // // import Manager from "@/components/dashboard/Manager";
// // // import Dhead from "@/components/dashboard/Dhead";
// // // import Dbde from "@/components/dashboard/Dbde";
// // // import Dhr from "@/components/dashboard/Dhr";
// // // import Dfinance from "@/components/dashboard/Dfinance";
// // // import Dcore from "@/components/dashboard/Dcore";
// // // import NoRolePage from "@/components/dashboard/no-role";
// // // import { useAuth } from "@/contexts/AuthContext";

// // // export default function DashboardPage() {
// // //   const [roleComponent, setRoleComponent] = useState<JSX.Element | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [userRoles, setUserRoles] = useState<any[]>([]);
// // //   const [currentRole, setCurrentRole] = useState<any>(null);
// // //   const { user } = useAuth();

// // //   const getDirectorComponent = (departmentId: number) => {
// // //     switch (departmentId) {
// // //       case 1: return <Dhead />;      // HEAD department director
// // //       case 2: return <Dhr />;         // Human Resource director
// // //       case 3: return <Dbde />;        // Business Development director
// // //       case 4: return <Dfinance />;    // Finance director
// // //       case 5: return <Dcore />;       // CSE director
// // //       default: return <Dcore />;      // 5+ department ke liye Core director
// // //     }
// // //   };

// // //   const getComponentForRole = (role: any, employee: any) => {
// // //     if (role.ptype === "CLIENT") {
// // //       return <Client />;
// // //     }
// // //     else if (role.ptype === "CONSULTANT") {
// // //       return <Consultent />;
// // //     }
// // //     else if (role.ptype === "EMP") {
// // //       const stype = role.stype?.toUpperCase();
      
// // //       // MANAGER: hamesha Manager page (kisi bhi department ke liye)
// // //       if (stype === "MANAGER") {
// // //         return <Manager />;
// // //       }
// // //       // DIRECTOR: department dekhna hoga
// // //       else if (stype === "DIRECTOR") {
// // //         return getDirectorComponent(employee?.departmentId);
// // //       }
// // //       // Other EMP types: default Core component
// // //       else {
// // //         return <Dcore />;
// // //       }
// // //     }
// // //     return <NoRolePage />;
// // //   };

// // //   const getUserDetails = async () => {
// // //     try {
// // //       const res = await axios.get(
// // //         `${process.env.NEXT_PUBLIC_API_URL}/api/getmydetails`,
// // //         { withCredentials: true }
// // //       );

// // //       console.log("User details response:", res.data);

// // //       const data = res?.data?.data;

// // //       if (!data) {
// // //         console.error("Invalid response");
// // //         return;
// // //       }

// // //       const roles = data.roles || [];
// // //       const employee = data.employee;
      
// // //       setUserRoles(roles);
      
// // //       localStorage.setItem('userRoles', JSON.stringify(roles));
// // //       localStorage.setItem('userEmployee', JSON.stringify(employee));

// // //       if (roles.length > 0) {
// // //         const initialRole = roles[0];
// // //         setCurrentRole(initialRole);
// // //         setRoleComponent(getComponentForRole(initialRole, employee));
// // //       }

// // //     } catch (error) {
// // //       console.error("Error fetching user details", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     const handleRoleChange = (event: CustomEvent) => {
// // //       const { role, employee } = event.detail;
// // //       setCurrentRole(role);
      
// // //       const empData = employee || JSON.parse(localStorage.getItem('userEmployee') || '{}');
// // //       setRoleComponent(getComponentForRole(role, empData));
// // //     };

// // //     window.addEventListener('roleChanged', handleRoleChange as EventListener);
// // //     return () => {
// // //       window.removeEventListener('roleChanged', handleRoleChange as EventListener);
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     getUserDetails();
// // //   }, []);
  
// // //   console.log("Current Role:", currentRole);
// // //   console.log("User Roles:", userRoles);
  
// // //   return (
// // //     <>
// // //       <Navbar currentRole={currentRole} userRoles={userRoles} />
      
// // //       <main
// // //         style={{
// // //           marginTop: "80px",
// // //           minHeight: "calc(100vh - 160px)",
// // //           padding: "20px",
// // //           width: "100%",
// // //           boxSizing: "border-box"
// // //         }}
// // //       >
// // //         {loading ? (
// // //           <p className="loader"><img src="https://cdn.pixabay.com/animation/2025/05/05/15/47/15-47-41-779_512.gif" alt="" /></p>
// // //         ) : (
// // //           <>
// // //             {roleComponent}
// // //           </>
// // //         )}
// // //       </main>
// // //     </>
// // //   );
// // // }