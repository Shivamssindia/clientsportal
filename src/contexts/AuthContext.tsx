//@ts-nocheck
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '@/lib/firebase';

export interface User {
  userId: number;
  uid: string;
  name: string;
  email: string;
  photoUrl: string;
  emailVerified: boolean;
  isProfileCompleted: boolean;
}

export interface Role {
  id: number;
  ptype: string;
  stype: string;
  isapproved: string;
  isApproved?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  roles: Role[];
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const getFreshFirebaseToken = (): Promise<string | null> => {
    return new Promise((resolve) => {
      const auth = getAuth();
      if (auth.currentUser) {
        auth.currentUser.getIdToken(true).then((t) => resolve(t)).catch(() => resolve(null));
        return;
      }
      let done = false;
      const unsub = onAuthStateChanged(auth, (u) => {
        if (done) return;
        done = true;
        unsub();
        if (u) u.getIdToken(true).then((t) => resolve(t)).catch(() => resolve(null));
        else resolve(null);
      });
      setTimeout(() => {
        if (!done) { done = true; try { unsub(); } catch {} resolve(null); }
      }, 3000);
    });
  };

  const refreshUser = async () => {
    try {
      // cookie first
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { withCredentials: true }
        );
        if (res.data?.authenticated) {
          setUser(res.data.user);
          setRoles(res.data.roles || []);
          setLoading(false);
          return;
        }
      } catch (cookieErr) {
        console.warn('Cookie /auth/me failed, trying Bearer:',
          cookieErr?.response?.status || cookieErr?.message);
      }

      // bearer fallback
      const idToken = await getFreshFirebaseToken();
      if (!idToken) { setUser(null); setRoles([]); setLoading(false); return; }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
        if (res.data?.authenticated) {
          setUser(res.data.user);
          setRoles(res.data.roles || []);
        } else { setUser(null); setRoles([]); }
      } catch (bearerErr) {
        console.error('Bearer /auth/me failed:', bearerErr?.response?.status);
        setUser(null); setRoles([]);
      }
    } catch (error) {
      console.error('refreshUser error:', error);
      setUser(null); setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      ).catch(() => {});
      try { await getAuth().signOut(); } catch {}
      setUser(null); setRoles([]);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  useEffect(() => {
    refreshUser();
    const unsub = onAuthStateChanged(getAuth(), (fbUser) => {
      if (fbUser) refreshUser();
    });
    return () => { try { unsub(); } catch {} };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, roles, loading, logout, isAuthenticated: !!user, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};








// //@ts-nocheck
// 'use client';

// import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import axios from 'axios';

// export interface User {
//   userId: number;
//   uid: string;
//   name: string;
//   email: string;
//   photoUrl: string;
//   emailVerified: boolean;
//   isProfileCompleted: boolean;
// }

// export interface Role {
//   id: number;
//   ptype: string;
//   stype: string;
//   isapproved: string;
//   createdAt: string;
// }

// interface AuthContextType {
//   user: User | null;
//   roles: Role[];
//   loading: boolean;
//   isAuthenticated: boolean;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [loading, setLoading] = useState(true);

//   const refreshUser = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
//         { withCredentials: true }
//       );
//       console.log('AuthProvider refreshUser response:', res);
// //started
//    let banner = `
//    ███████  ██████  ███████ ████████ ███    ███  █████  ██   ██
//    ██      ██    ██ ██         ██    ████  ████ ██   ██  ██ ██ 
//    ███████ ██    ██ █████      ██    ██ ████ ██ ███████   ███  
//         ██ ██    ██ ██         ██    ██  ██  ██ ██   ██  ██ ██ 
//    ███████  ██████  ██         ██    ██      ██ ██   ██ ██   ██

//    ==========================================================

//                  :: SOFTMAX ::      (v1.0.0)
//     `;

//     console.log(
//       `%c${banner}`,
//       "color:#00ff88; font-family: monospace; font-weight:bold;"
//     +50000000000000000000);
//     // console.log(banner);
// // end 

//       if (res.data.authenticated) {
//         setUser(res.data.user);
//         setRoles(res.data.roles || []);
//       } else {
//         setUser(null);
//         setRoles([]);
//       }
//     } catch (error) {
//       setUser(null);
//       setRoles([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
//         {},
//         { withCredentials: true }
//       );
//       setUser(null);
//       setRoles([]);
//     } catch (error) {
//       console.error('Logout error', error);
//     }
//   };

//   useEffect(() => {
//     refreshUser();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ user, roles, loading, logout, isAuthenticated: !!user, refreshUser }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// };