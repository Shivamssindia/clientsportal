// import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
// import { auth } from "./firebase";

// // ✅ Type for Firebase user data
// export interface FirebaseUserData {
//   uid: string;
//   name: string | null;
//   email: string | null;
//   photoUrl: string | null;
//   emailVerified: boolean;
// }

// export const signInWithGoogle = async (): Promise<FirebaseUserData> => {
//   try {
//     const provider = new GoogleAuthProvider();

//     const result = await signInWithPopup(auth, provider);
//     const user: User = result.user;

//     const firebaseUser: FirebaseUserData = {
//       uid: user.uid,
//       name: user.displayName,
//       email: user.email,
//       photoUrl: user.photoURL,
//       emailVerified: user.emailVerified,
//     };

//     // ✅ Console Firebase response
//     console.log("🔥 Firebase User:", firebaseUser);

//     return firebaseUser;
//   } catch (error) {
//     console.error("❌ Google Sign-In Error:", error);
//     throw error;
//   }
// };

// src\lib\googleAuth.ts
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth } from "./firebase";

// ✅ Backend compatible type
export interface FirebaseUserData {
  token: string;          // 🔥 MOST IMPORTANT
  name: string;
  email: string;
  photoUrl: string;
}

export const signInWithGoogle = async (): Promise<FirebaseUserData> => {
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);
    const user: User = result.user;

    // 🔥 ID TOKEN (ye hi backend me jayega)
    const token = await user.getIdToken();

    const firebaseUser: FirebaseUserData = {
      token: token,
      name: user.displayName || "",
      email: user.email || "",
      photoUrl: user.photoURL || "",
    };

    // ✅ Debug logs
    console.log("🔥 Firebase User:", firebaseUser);
    console.log("🔥 Firebase Token:", token);

    return firebaseUser;

  } catch (error) {
    console.error("❌ Google Sign-In Error:", error);
    throw error;
  }
};