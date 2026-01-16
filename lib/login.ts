"use client";

import { signInWithPopup, Auth, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

export const googleLogin = async () => {
  try {
    if (!auth || !provider) {
      console.error("Firebase not configured. Please add your Firebase credentials.");
      alert("Firebase authentication is not configured. Please add your Firebase credentials to .env.local");
      return null;
    }
    const result = await signInWithPopup(auth as Auth, provider as GoogleAuthProvider);
    return result.user;
  } catch (error) {
    console.error("Google login failed:", error);
    return null;
  }
};