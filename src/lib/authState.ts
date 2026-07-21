import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*
  There's no real backend behind this prototype, so "signed in" is just
  a local flag — matches the design handoff's own login flow, which
  ends by navigating to the feed with no server round-trip either.
  Persisted so the app doesn't drop back to onboarding every launch
  once a user has actually gone through it once.
*/
const AUTH_KEY = "pulse.auth.signedIn.v1";

export function useAuthState() {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY)
      .then((v) => setIsSignedIn(v === "1"))
      .catch(() => setIsSignedIn(false))
      .then(() => setLoading(false));
  }, []);

  async function signIn() {
    setIsSignedIn(true);
    try {
      await AsyncStorage.setItem(AUTH_KEY, "1");
    } catch {
      // storage unavailable — session-only sign-in, resets next launch.
    }
  }

  async function signOut() {
    setIsSignedIn(false);
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
    } catch {
      // storage unavailable — nothing to clear.
    }
  }

  return { loading, isSignedIn, signIn, signOut };
}
