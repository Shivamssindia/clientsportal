import axios from 'axios';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import '@/lib/firebase';

export const LoginService = async (googleToken: string) => {
  const auth = getAuth();
  const credential = GoogleAuthProvider.credential(googleToken);
  const userCred = await signInWithCredential(auth, credential);
  const idToken = await userCred.user.getIdToken();

  // STEP 1: cookie-based
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
      { token: idToken },
      { withCredentials: true }
    );
    console.log('LoginService (cookie) response:', response.data);
    return { ...response.data, mode: 'cookie' as const };
  } catch (cookieError: any) {
    console.warn(
      'Cookie login failed, trying bearer fallback:',
      cookieError?.response?.status || cookieError?.message
    );
  }

  // STEP 2: bearer fallback (cookie-independent)
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin-bearer`,
      { token: idToken },
      { headers: { Authorization: `Bearer ${idToken}` } }
    );
    console.log('LoginService (bearer) response:', response.data);
    return { ...response.data, mode: 'bearer' as const };
  } catch (bearerError: any) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
        { token: idToken },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      console.log('LoginService (bearer-on-signin) response:', response.data);
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