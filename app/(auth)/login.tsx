import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@/design/icons/Icon";
import { Snackbar } from "@/components/patterns/snack/Snackbar";
import { typography } from "@/design/theme";
import { useAuthState } from "@/lib/authState";

/*
  Ported from PulseeSignup.dc.html's login screen. Consent must be
  checked before either method proceeds — a real validation, kept as
  specified. The close (X) skips straight to the feed, matching the
  source's own `<a href="PulseeFeed.dc.html">` — there's no backend
  here to distinguish "signed up" from "skipped", so reaching the feed
  by either path marks the session signed-in the same way.
*/
export default function Login() {
  const insets = useSafeAreaInsets();
  const [consent, setConsent] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);
  const { signIn } = useAuthState();

  function requireConsent(): boolean {
    if (!consent) {
      setSnack("Please agree to the Terms to continue.\nTick the box below to proceed.");
      return false;
    }
    return true;
  }

  function skipToFeed() {
    signIn().then(() => router.replace("/feed"));
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#080A0B" }}>
      <View style={{ flex: 1 }}>
        <LinearGradient colors={["#2a2320", "#080A0B"]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={{ flex: 1 }} />
        <LinearGradient
          colors={["rgba(8,10,11,0)", "#080A0B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200 }}
        />
      </View>

      <Pressable onPress={skipToFeed} style={{ position: "absolute", right: 16, top: insets.top + 8, width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
        <Icon name="cross" size={12} color="white" />
      </Pressable>

      <View style={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 24, gap: 24, alignItems: "center" }}>
        <Text style={[typography.bodyBasicBold, { color: "white", textAlign: "center" }]}>Log in or sign up to continue</Text>

        <View style={{ flexDirection: "row", gap: 44, justifyContent: "center" }}>
          <Pressable
            onPress={() => { if (requireConsent()) router.push("/email"); }}
            style={{ alignItems: "center", gap: 4, width: 52 }}
          >
            <View style={{ width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.70)" }}>
              <Icon name="envelope-outline" size={26} color="white" />
            </View>
            <Text style={[typography.captionRegular, { color: "white" }]}>Email</Text>
          </Pressable>

          <Pressable
            onPress={() => { if (requireConsent()) router.push("/phone"); }}
            style={{ alignItems: "center", gap: 4, width: 52 }}
          >
            <View style={{ width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.70)" }}>
              <Icon name="chat-2-outline" size={26} color="#25D366" />
            </View>
            <Text style={[typography.captionRegular, { color: "white" }]}>WhatsApp</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => setConsent((c) => !c)} style={{ flexDirection: "row", gap: 10, alignItems: "center", alignSelf: "stretch" }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              borderWidth: consent ? 0 : 1.6,
              borderColor: "rgba(255,255,255,0.7)",
              backgroundColor: consent ? "#FD4B03" : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {consent ? <Icon name="tick-single" size={14} color="white" /> : null}
          </View>
          <Text style={[typography.captionBold, { color: "white", flex: 1 }]}>
            I agree to the User Agreement, Terms of Use, and Privacy Policy.
          </Text>
        </Pressable>
      </View>

      {snack ? (
        <View style={{ position: "absolute", left: 16, right: 16, bottom: 24 }}>
          <Snackbar message={snack} background="conditionNegative" />
        </View>
      ) : null}
    </View>
  );
}
