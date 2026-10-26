import axios from 'axios';
import { getAuth } from 'firebase/auth';
import '@/lib/firebase';

/**
 * Backend mein Firebase ID token bhejein
 * Cookie ya Bearer mode automatically try karega
 */
export const LoginService = async (firebaseIdToken: string) => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  // Mode 1: Cookie
  try {
    const response = await axios.post(
      `${API_BASE}/api/auth/signin`,
      { token: firebaseIdToken },
      { withCredentials: true }
    );
    console.log('LoginService (cookie) success:', response.data);
    return { ...response.data, mode: 'cookie' as const };
  } catch (cookieError: any) {
    console.warn(
      'Cookie login failed, trying bearer:',
      cookieError?.response?.status || cookieError?.message
    );
  }

  // Mode 2: Bearer
  try {
    const response = await axios.post(
      `${API_BASE}/api/auth/signin-bearer`,
      { token: firebaseIdToken },
      { headers: { Authorization: `Bearer ${firebaseIdToken}` } }
    );
    console.log('LoginService (bearer) success:', response.data);
    return { ...response.data, mode: 'bearer' as const };
  } catch (bearerError: any) {
    // Mode 3: Bearer fallback (same endpoint)
    try {
      const response = await axios.post(
        `${API_BASE}/api/auth/signin`,
        { token: firebaseIdToken },
        { headers: { Authorization: `Bearer ${firebaseIdToken}` } }
      );
      console.log('LoginService (bearer-on-signin) success:', response.data);
      return { ...response.data, mode: 'bearer' as const };
    } catch (finalError: any) {
      console.error(
        'LoginService failed (all modes):',
        finalError.response?.data || finalError.message
      );
      throw finalError;
    }
  }
};













// import axios from 'axios';
// import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
// import '@/lib/firebase';

// export const LoginService = async (googleToken: string) => {
//   const auth = getAuth();
//   const credential = GoogleAuthProvider.credential(googleToken);
//   const userCred = await signInWithCredential(auth, credential);
//   const idToken = await userCred.user.getIdToken();

//   // STEP 1: cookie-based
//   try {
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
//       { token: idToken },
//       { withCredentials: true }
//     );
//     console.log('LoginService (cookie) response:', response.data);
//     return { ...response.data, mode: 'cookie' as const };
//   } catch (cookieError: any) {
//     console.warn(
//       'Cookie login failed, trying bearer fallback:',
//       cookieError?.response?.status || cookieError?.message
//     );
//   }

//   // STEP 2: bearer fallback (cookie-independent)
//   try {
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin-bearer`,
//       { token: idToken },
//       { headers: { Authorization: `Bearer ${idToken}` } }
//     );
//     console.log('LoginService (bearer) response:', response.data);
//     return { ...response.data, mode: 'bearer' as const };
//   } catch (bearerError: any) {
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
//         { token: idToken },
//         { headers: { Authorization: `Bearer ${idToken}` } }
//       );
//       console.log('LoginService (bearer-on-signin) response:', response.data);
//       return { ...response.data, mode: 'bearer' as const };
//     } catch (finalError: any) {
//       console.error(
//         'LoginService failed (all modes):',
//         finalError.response?.data || finalError.message
//       );
//       throw finalError;
//     }
//   }
// };






// import axios from 'axios';
// import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
// import '@/lib/firebase';

// export const LoginService = async (googleToken: string) => {
//   try {
//     const auth = getAuth();
//     const credential = GoogleAuthProvider.credential(googleToken);
//     const userCred = await signInWithCredential(auth, credential);
//     const idToken = await userCred.user.getIdToken();

//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
//       { token: idToken },
//       { withCredentials: true }
//     );
//     console.log('LoginService response:', response.data);
//     return response.data;
//   } catch (error: any) {
//     console.error('LoginService error:', error.response?.data || error.message);
//     throw error;
//   }
// };