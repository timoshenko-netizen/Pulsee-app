import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { AuthNavHeader } from "@/components/features/auth/AuthNavHeader";
import { OtpInput } from "@/components/features/auth/OtpInput";
import { typography } from "@/design/theme";
import { useAuthState } from "@/lib/authState";

const DEMO_CODE = "123456";
const RESEND_SECONDS = 300;

export default function PhoneCodeScreen() {
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const { signIn } = useAuthState();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [resendLeft, setResendLeft] = useState(RESEND_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    intervalRef.current = setInterval(() => setResendLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  function onChange(v: string) {
    setCode(v);
    setError(false);
    if (v.length === 6) {
      setTimeout(() => {
        if (v === DEMO_CODE) signIn().then(() => router.replace("/feed"));
        else setError(true);
      }, 120);
    }
  }

  function resend() {
    if (resendLeft > 0) return;
    setCode("");
    setError(false);
    setResendLeft(RESEND_SECONDS);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#080A0B" }}>
      <AuthNavHeader onBack={() => router.back()} />
      <View style={{ paddingHorizontal: 20, gap: 8, marginTop: 16 }}>
        <Text style={[typography.headline, { color: "white" }]}>Code sent to WhatsApp</Text>
        <Text style={[typography.bodyLargeRegular, { color: "white" }]}>We sent a code to {phone || "your number"}</Text>
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 32 }}>
        <OtpInput length={6} value={code} onChange={onChange} error={error} />
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 32, gap: 16, alignItems: "center" }}>
        <Pressable
          onPress={resend}
          disabled={resendLeft > 0}
          style={{ height: 52, paddingHorizontal: 24, borderRadius: 100, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.10)", opacity: resendLeft > 0 ? 0.5 : 1 }}
        >
          <Text style={[typography.buttonML, { color: "white" }]}>GET A NEW CODE</Text>
        </Pressable>
        {resendLeft > 0 ? (
          <Text style={[typography.bodyLargeRegular, { color: "rgb(185,185,185)" }]}>Request again in {resendLeft} sec</Text>
        ) : null}
      </View>
    </View>
  );
}
