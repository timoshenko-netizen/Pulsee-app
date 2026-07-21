import { useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/primitives/button/Button";
import { AuthNavHeader } from "@/components/features/auth/AuthNavHeader";
import { AuthTextInput } from "@/components/features/auth/AuthTextInput";
import { typography } from "@/design/theme";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function EmailScreen() {
  const [email, setEmail] = useState("");
  const valid = isValidEmail(email);

  return (
    <View style={{ flex: 1, backgroundColor: "#080A0B" }}>
      <AuthNavHeader onBack={() => router.back()} />
      <View style={{ paddingHorizontal: 20, gap: 8, marginTop: 16 }}>
        <Text style={[typography.headline, { color: "white" }]}>Enter your email</Text>
        <Text style={[typography.bodyLargeRegular, { color: "white" }]}>To sign up or log in to your account.</Text>
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 32, gap: 24 }}>
        <AuthTextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
        <View style={{ width: "100%", opacity: valid ? 1 : 0.5 }} pointerEvents={valid ? "auto" : "none"}>
          <Button variant="primary" tone="level1" size="l" onPress={() => router.push({ pathname: "/email-code", params: { email } })}>
            Continue
          </Button>
        </View>
      </View>
    </View>
  );
}
