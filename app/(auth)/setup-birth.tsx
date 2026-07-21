import { useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/primitives/button/Button";
import { AuthTextInput } from "@/components/features/auth/AuthTextInput";
import { SetupStepLayout } from "@/components/features/auth/SetupStepLayout";
import { typography } from "@/design/theme";

function formatBirth(raw: string) {
  const v = raw.replace(/\D/g, "").slice(0, 8);
  let out = v.slice(0, 2);
  if (v.length > 2) out += " / " + v.slice(2, 4);
  if (v.length > 4) out += " / " + v.slice(4, 8);
  return out;
}

function isValidBirth(v: string) {
  const m = v.match(/(\d{2})\s*\/\s*(\d{2})\s*\/\s*(\d{4})/);
  if (!m) return false;
  const d = +m[1], mo = +m[2], y = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return false;
  const age = (Date.parse(new Date().toISOString()) - new Date(y, mo - 1, d).getTime()) / (365.25 * 864e5);
  return age >= 18 && age < 120;
}

export default function SetupBirth() {
  const [birth, setBirth] = useState("");
  const [error, setError] = useState(false);
  const valid = isValidBirth(birth);

  function next() {
    if (!valid) { setError(true); return; }
    router.push("/setup-age");
  }

  return (
    <SetupStepLayout step={0} onBack={() => router.back()}>
      <View style={{ padding: 20, gap: 24 }}>
        <View style={{ gap: 10 }}>
          <Text style={[typography.headline, { color: "white" }]}>What's your date of birth?</Text>
          <Text style={[typography.bodyBasicRegular, { color: "rgb(185,185,185)" }]}>You must be 18 or older to use Pulse. Others won't see this.</Text>
        </View>
        <AuthTextInput
          value={birth}
          onChangeText={(v) => { setBirth(formatBirth(v)); setError(false); }}
          placeholder="DD / MM / YYYY"
          keyboardType="number-pad"
          error={error}
        />
        {error ? <Text style={[typography.captionRegular, { color: "#FD0058" }]}>You must be at least 18 years old.</Text> : null}
        <View style={{ width: "100%" }}>
          <Button variant="primary" tone="level1" size="m" onPress={next}>
            Next
          </Button>
        </View>
      </View>
    </SetupStepLayout>
  );
}
