import { Redirect } from "expo-router";
import { useAuthState } from "@/lib/authState";

export default function Index() {
  const { loading, isSignedIn } = useAuthState();
  if (loading) return null;
  return <Redirect href={isSignedIn ? "/feed" : "/onboarding"} />;
}
