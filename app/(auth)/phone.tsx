import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/primitives/button/Button";
import { BottomSheet } from "@/components/patterns/bottom-sheet/BottomSheet";
import { AuthNavHeader } from "@/components/features/auth/AuthNavHeader";
import { AuthTextInput } from "@/components/features/auth/AuthTextInput";
import { Icon } from "@/design/icons/Icon";
import { typography } from "@/design/theme";
import { SIGNUP_COUNTRIES } from "@/screens/auth/countries";

function digitCount(v: string) {
  return (v.match(/\d/g) || []).length;
}

export default function PhoneScreen() {
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const valid = digitCount(phone) >= 7;

  return (
    <View style={{ flex: 1, backgroundColor: "#080A0B" }}>
      <AuthNavHeader onBack={() => router.back()} />
      <View style={{ paddingHorizontal: 20, gap: 8, marginTop: 16 }}>
        <Text style={[typography.headline, { color: "white" }]}>Enter your phone number</Text>
        <Text style={[typography.bodyLargeRegular, { color: "white" }]}>We'll send a code to your WhatsApp.</Text>
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 32, gap: 24 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => setCountryOpen(true)}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, height: 60, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.10)", paddingHorizontal: 18 }}
          >
            <Text style={[typography.bodyLargeRegular, { color: "white", fontWeight: "700" }]}>{countryCode}</Text>
            <Icon name="chevron-down" size={16} color="white" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <AuthTextInput value={phone} onChangeText={(v) => setPhone(v.replace(/[^\d()\-\s]/g, ""))} placeholder="(555) 000-0000" keyboardType="phone-pad" />
          </View>
        </View>
        <View style={{ width: "100%", opacity: valid ? 1 : 0.5 }} pointerEvents={valid ? "auto" : "none"}>
          <Button variant="primary" tone="level1" size="l" onPress={() => router.push({ pathname: "/phone-code", params: { phone: countryCode + " " + phone } })}>
            Continue
          </Button>
        </View>
      </View>

      <BottomSheet open={countryOpen} onClose={() => setCountryOpen(false)} draggable>
        <View style={{ paddingBottom: 8 }}>
          <Text style={[typography.bodyBasicBold, { color: "white", textAlign: "center", marginBottom: 8 }]}>Choose country code</Text>
          <ScrollView style={{ maxHeight: 420 }}>
            {SIGNUP_COUNTRIES.map((c) => (
              <Pressable
                key={c.iso}
                onPress={() => { setCountryCode(c.code); setCountryOpen(false); }}
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 52, paddingHorizontal: 20 }}
              >
                <Text style={[typography.bodyLargeRegular, { color: "white" }]}>{c.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <Text style={[typography.bodyLargeRegular, { color: "rgb(185,185,185)", fontWeight: "700" }]}>{c.code}</Text>
                  {c.code === countryCode ? <Icon name="tick-single" size={18} color="#31F1F0" /> : null}
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>
    </View>
  );
}
