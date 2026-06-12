import { supabase } from "./supabase";

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
      queryParams: { access_type: "offline", prompt: "select_account" },
    },
  });
  if (error) return { user: null, error: error.message };
  return { user: data, error: null };
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message || null };
}

export function onAuthStateChange(callback) {
  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
  return () => listener.subscription.unsubscribe();
}

export function getCurrentUser() {
  return supabase.auth.getUser();
}
