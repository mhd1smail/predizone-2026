/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getUserProfile } from "../lib/db";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingAuthUser, setPendingAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getUserProfile(session.user.id).then((profile) => {
          if (profile) {
            setCurrentUser(profile);
          } else {
            setPendingAuthUser(session.user);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          setCurrentUser(profile);
          setPendingAuthUser(null);
        } else {
          setPendingAuthUser(session.user);
        }
      } else {
        setCurrentUser(null);
        setPendingAuthUser(null);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    pendingAuthUser,
    loading,
    isAdmin: currentUser?.isAdmin === true,
    setCurrentUser,
    setPendingAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContext");
  }
  return context;
}