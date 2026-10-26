'use client';

import { useEffect, useRef } from 'react';
import { LoginService } from '@/Service/LoginService';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential,
} from 'firebase/auth';
import '@/lib/firebase';

declare global {
  interface Window {
    google?: any;
    triggerGoogleLogin?: () => void;
  }
}

export default function OneTapFirebase() {
  const { refreshUser } = useAuth();
  const initialized = useRef(false);
  const popupInFlight = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const loadScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.google) return resolve();
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Google script load failed'));
        document.body.appendChild(script);
      });

    // ==========================================
    // Core: Firebase authenticate + backend call
    // ==========================================
    const finishLogin = async (firebaseUser: any) => {
      const idToken = await firebaseUser.getIdToken();
      await LoginService(idToken);   // Backend ko Firebase token bhejein
      await refreshUser();
      window.location.href = '/dashboard';
    };

    // ==========================================
    // Popup login (user-initiated)
    // ==========================================
    const popupLogin = async (): Promise<boolean> => {
      if (popupInFlight.current) return false;
      popupInFlight.current = true;
      try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        // ✅ Firebase already authenticated — direct getIdToken()
        await finishLogin(result.user);
        return true;
      } catch (err: any) {
        if (err?.code === 'auth/popup-closed-by-user') return true;

        if (err?.code === 'auth/popup-blocked') {
          console.warn('[Popup] Blocked → redirect');
          try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            await signInWithRedirect(auth, provider);
            return true;
          } catch (redirectErr) {
            console.error('[Redirect] Failed:', redirectErr);
            return false;
          }
        }
        console.error('Popup login failed:', err);
        return false;
      } finally {
        popupInFlight.current = false;
      }
    };

    // ==========================================
    // Redirect result (popup blocked fallback)
    // ==========================================
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(getAuth());
        if (result?.user) {
          await finishLogin(result.user);
        }
      } catch (err) {
        console.warn('[Redirect] getRedirectResult failed:', err);
      }
    };

    // ==========================================
    // One Tap callback
    // ==========================================
    const handleOneTap = async (response: any) => {
      try {
        if (!response?.credential) return;

        // ✅ One Tap credential se Firebase authenticate karein
        // response.credential Google ID token hai, GoogleAuthProvider accept karta hai
        const auth = getAuth();
        const credential = GoogleAuthProvider.credential(response.credential);
        const userCred = await signInWithCredential(auth, credential);
        await finishLogin(userCred.user);
      } catch (err) {
        console.error('OneTap handler failed:', err);
      }
    };

    // ==========================================
    // Init One Tap + hybrid global trigger
    // ==========================================
    const initGoogle = async () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.warn('[OneTap] Client ID missing → popup only');
        window.triggerGoogleLogin = popupLogin as any;
        return;
      }

      try {
        await loadScript();
      } catch (err) {
        console.warn('[OneTap] Script failed → popup only', err);
        window.triggerGoogleLogin = popupLogin as any;
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleOneTap,
          auto_select: true,
          cancel_on_tap_outside: true,
        });
      } catch (err) {
        console.warn('[OneTap] Initialize failed → popup only', err);
        window.triggerGoogleLogin = popupLogin as any;
        return;
      }

      // Pehli visit par One Tap silently show karein
      const dismissed = localStorage.getItem('oneTapDismissed');
      if (!dismissed) {
        try {
          window.google.accounts.id.prompt((notification: any) => {
            if (notification.isDismissedMoment?.()) {
              localStorage.setItem('oneTapDismissed', 'true');
            }
          });
        } catch (e) {
          console.warn('[OneTap] prompt() failed:', e);
        }
      }

      // ---------- Hybrid global trigger ----------
      window.triggerGoogleLogin = () => {
        let oneTapHandled = false;

        try {
          window.google.accounts.id.prompt((notification: any) => {
            if (
              notification.isNotDisplayed?.() ||
              notification.isSkippedMoment?.() ||
              notification.isDismissedMoment?.()
            ) {
              console.log('[OneTap] Not displayed → popup fallback');
              popupLogin();
            }
          });
          oneTapHandled = true;
        } catch (err) {
          console.warn('[OneTap] prompt() threw → popup fallback', err);
          oneTapHandled = false;
        }

        if (!oneTapHandled) {
          popupLogin();
        }
      };
    };

    checkRedirectResult();
    initGoogle();

    return () => {
      try {
        window.google?.accounts.id.cancel();
      } catch {}
    };
  }, [refreshUser]);

  return null;
}



























// 'use client';

// import { useEffect, useRef } from 'react';
// import { LoginService } from '@/Service/LoginService';
// import { useAuth } from '@/contexts/AuthContext';
// import {
//   getAuth,
//   GoogleAuthProvider,
//   signInWithPopup,
//   signInWithRedirect,
//   getRedirectResult,
// } from 'firebase/auth';
// import '@/lib/firebase';

// declare global {
//   interface Window {
//     google?: any;
//     triggerGoogleLogin?: () => void;
//   }
// }

// export default function OneTapFirebase() {
//   const { refreshUser } = useAuth();
//   const initialized = useRef(false);

//   useEffect(() => {
//     if (initialized.current) return;
//     initialized.current = true;

//     const loadScript = () =>
//       new Promise<void>((resolve, reject) => {
//         if (window.google) return resolve();
//         const script = document.createElement('script');
//         script.src = 'https://accounts.google.com/gsi/client';
//         script.async = true;
//         script.onload = () => resolve();
//         script.onerror = () => reject(new Error('Failed to load Google Identity script'));
//         document.body.appendChild(script);
//       });

//     // ---------- Redirect result check (survives popup-block) ----------
//     const checkRedirectResult = async () => {
//       try {
//         const result = await getRedirectResult(getAuth());
//         if (result?.user) {
//           const idToken = await result.user.getIdToken();
//           await LoginService(idToken);
//           await refreshUser();
//           window.location.href = '/dashboard';
//         }
//       } catch (err) {
//         console.warn('[Redirect] getRedirectResult failed:', err);
//       }
//     };

//     // ---------- Popup login (user-initiated only) ----------
//     const popupLogin = async (): Promise<boolean> => {
//       try {
//         const auth = getAuth();
//         const provider = new GoogleAuthProvider();
//         provider.setCustomParameters({ prompt: 'select_account' });
//         const result = await signInWithPopup(auth, provider);
//         const idToken = await result.user.getIdToken();
//         await LoginService(idToken);
//         await refreshUser();
//         window.location.href = '/dashboard';
//         return true;
//       } catch (err: any) {
//         // User closed popup — silent
//         if (err?.code === 'auth/popup-closed-by-user') return true;
//         // Popup blocked — use redirect as final fallback
//         if (err?.code === 'auth/popup-blocked') {
//           console.warn('[Popup] Blocked → using redirect flow');
//           try {
//             const auth = getAuth();
//             const provider = new GoogleAuthProvider();
//             provider.setCustomParameters({ prompt: 'select_account' });
//             await signInWithRedirect(auth, provider);
//             return true;
//           } catch (redirectErr) {
//             console.error('[Redirect] Failed:', redirectErr);
//             return false;
//           }
//         }
//         console.error('Popup login failed:', err);
//         return false;
//       }
//     };

//     // ---------- OneTap callback ----------
//     const handleOneTap = async (response: any) => {
//       try {
//         if (!response?.credential) {
//           // No credential → let user click button to trigger popup manually
//           return;
//         }
//         await LoginService(response.credential);
//         await refreshUser();
//         localStorage.removeItem('oneTapDismissed');
//         window.location.href = '/dashboard';
//       } catch (err) {
//         console.error('OneTap handler failed:', err);
//         // Do NOT auto-popup here — popup would be blocked (not user-initiated)
//       }
//     };

//     // ---------- Init OneTap ----------
//     const initGoogle = async () => {
//       const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

//       if (!clientId) {
//         console.warn(
//           '[OneTap] NEXT_PUBLIC_GOOGLE_CLIENT_ID missing. Popup/redirect only.'
//         );
//         window.triggerGoogleLogin = popupLogin as any;
//         return;
//       }

//       try {
//         await loadScript();
//       } catch (err) {
//         console.warn('[OneTap] Script failed. Popup/redirect only.', err);
//         window.triggerGoogleLogin = popupLogin as any;
//         return;
//       }

//       try {
//         window.google.accounts.id.initialize({
//           client_id: clientId,
//           callback: handleOneTap,
//           auto_select: true,
//           cancel_on_tap_outside: true,
//         });
//       } catch (err) {
//         console.warn('[OneTap] initialize failed. Popup/redirect only.', err);
//         window.triggerGoogleLogin = popupLogin as any;
//         return;
//       }

//       // Show OneTap only once
//       const dismissed = localStorage.getItem('oneTapDismissed');
//       if (!dismissed) {
//         try {
//           window.google.accounts.id.prompt((notification: any) => {
//             if (notification.isDismissedMoment()) {
//               localStorage.setItem('oneTapDismissed', 'true');
//             }
//             if (
//               notification.isNotDisplayed?.() ||
//               notification.isSkippedMoment?.()
//             ) {
//               console.warn(
//                 '[OneTap] Not displayed (FedCM/cookies?) — popup fallback available on click'
//               );
//             }
//           });
//         } catch (e) {
//           console.warn('[OneTap] prompt() failed:', e);
//         }
//       }

//       // ✅ Global trigger — NO setTimeout, NO auto popup
//       // OneTap tries silently; if it doesn't show, user clicks again → popup
//       window.triggerGoogleLogin = () => {
//         try {
//           // OneTap prompt doesn't trigger popup — safe to call
//           window.google.accounts.id.prompt();
//         } catch {
//           // If OneTap API unavailable, try popup directly (still user-initiated)
//           popupLogin();
//         }
//       };
//     };

//     // Run on mount
//     checkRedirectResult();
//     initGoogle();

//     return () => {
//       try {
//         window.google?.accounts.id.cancel();
//       } catch {}
//     };
//   }, [refreshUser]);

//   return null;
// }







// 'use client';

// import { useEffect, useRef } from 'react';
// import { LoginService } from '@/Service/LoginService';
// import { useAuth } from '@/contexts/AuthContext';

// declare global {
//   interface Window {
//     google?: any;
//     triggerGoogleLogin?: () => void;
//   }
// }

// export default function OneTapFirebase() {
//   const { refreshUser } = useAuth();
//   const initialized = useRef(false);

//   useEffect(() => {
//     if (initialized.current) return;
//     initialized.current = true;

//     const loadScript = () =>
//       new Promise<void>((resolve, reject) => {
//         if (window.google) return resolve();
//         const script = document.createElement('script');
//         script.src = 'https://accounts.google.com/gsi/client';
//         script.async = true;
//         script.onload = () => resolve();
//         script.onerror = () => reject(new Error('Failed to load Google Identity script'));
//         document.body.appendChild(script);
//       });

//     const initGoogle = async () => {
//       const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

//       if (!clientId) {
//         console.error(
//           '[OneTap] NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing. ' +
//           'Add it to .env.local and restart the dev server.'
//         );
//         return;
//       }

//       try {
//         await loadScript();
//       } catch (err) {
//         console.error('[OneTap] Google script failed to load', err);
//         return;
//       }

//       window.google.accounts.id.initialize({
//         client_id: clientId,
//         callback: handleOneTap,
//         auto_select: true,
//         cancel_on_tap_outside: true,
//       });

//       const dismissed = localStorage.getItem('oneTapDismissed');
//       if (!dismissed) {
//         window.google.accounts.id.prompt((notification: any) => {
//           if (notification.isDismissedMoment()) {
//             localStorage.setItem('oneTapDismissed', 'true');
//           }
//         });
//       }

//       window.triggerGoogleLogin = () => {
//         window.google.accounts.id.prompt();
//       };
//     };

//     const handleOneTap = async (response: any) => {
//       try {
//         if (!response?.credential) return;
//         await LoginService(response.credential);
//         await refreshUser();
//         localStorage.removeItem('oneTapDismissed');
//         window.location.href = '/';
//       } catch (err) {
//         console.error('OneTap error', err);
//       }
//     };

//     initGoogle();

//     return () => {
//       window.google?.accounts.id.cancel();
//     };
//   }, [refreshUser]);

//   return null;
// }









// // 'use client';

// // import { useEffect, useRef } from 'react';
// // import { LoginService } from '@/Service/LoginService';
// // import { useAuth } from '@/contexts/AuthContext';

// // declare global {
// //   interface Window {
// //     google?: any;
// //     triggerGoogleLogin?: () => void;
// //   }
// // }

// // export default function OneTapFirebase() {
// //   const { refreshUser } = useAuth();
// //   const initialized = useRef(false);

// //   useEffect(() => {
// //     if (initialized.current) return;
// //     initialized.current = true;

// //     const loadScript = () =>
// //       new Promise<void>((resolve) => {
// //         if (window.google) return resolve();
// //         const script = document.createElement('script');
// //         script.src = 'https://accounts.google.com/gsi/client';
// //         script.async = true;
// //         script.onload = () => resolve();
// //         document.body.appendChild(script);
// //       });

// //     const initGoogle = async () => {
// //       await loadScript();

// //       window.google.accounts.id.initialize({
// //         client_id: '108929175956-h5vf5gogaipvg2fvlg0snu1om881gudt.apps.googleusercontent.com',
// //         callback: handleOneTap,
// //         auto_select: true,
// //         cancel_on_tap_outside: true,
// //       });

// //       const dismissed = localStorage.getItem('oneTapDismissed');
// //       if (!dismissed) {
// //         window.google.accounts.id.prompt((notification: any) => {
// //           if (notification.isDismissedMoment()) {
// //             localStorage.setItem('oneTapDismissed', 'true');
// //           }
// //         });
// //       }

// //       window.triggerGoogleLogin = () => {
// //         window.google.accounts.id.prompt();
// //       };
// //     };

// //     const handleOneTap = async (response: any) => {
// //       try {
// //         if (!response?.credential) return;
// //         await LoginService(response.credential);
// //         await refreshUser(); // ✅ Reload user from backend
// //         localStorage.removeItem('oneTapDismissed');
// //         window.location.href = '/';
// //       } catch (err) {
// //         console.error('OneTap error', err);
// //       }
// //     };

// //     initGoogle();

// //     return () => {
// //       window.google?.accounts.id.cancel();
// //     };
// //   }, [refreshUser]);

// //   return null;
// // }