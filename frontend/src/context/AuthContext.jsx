import {
  getIdToken,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Get Firebase ID token
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      setUser(result.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  useEffect(() => {
    let refreshTokenInterval;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await getIdToken(firebaseUser, true);
        setUser(firebaseUser);
        setToken(idToken);

        // Set interval to refresh token every 30 minutes
        refreshTokenInterval = setInterval(async () => {
          const newIdToken = await getIdToken(firebaseUser, true);
          setToken(newIdToken);
        }, 30 * 60 * 1000); // 30 minutes
      } else {
        setUser(null);
        setToken(null);
        if (refreshTokenInterval) {
          clearInterval(refreshTokenInterval);
        }
      }
      setLoading(false);
    });

    return () => {
      if (refreshTokenInterval) {
        clearInterval(refreshTokenInterval);
      }
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    token, // 🔑 expose token here
    loading,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
