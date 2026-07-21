import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Icon } from "@/design/icons/Icon";
import { SetupStepLayout } from "@/components/features/auth/SetupStepLayout";
import { typography } from "@/design/theme";
import { useAuthState } from "@/lib/authState";

export default function SetupContacts() {
  const { signIn } = useAuthState();

  function finish() {
    signIn().then(() => router.replace("/feed"));
  }

  return (
    <SetupStepLayout step={3} onBack={() => router.back()}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 32 }}>
        <View style={{ width: 200, height: 180, alignItems: "center", justifyContent: "center" }}>
          <Icon name="persons-outline" size={72} color="rgba(255,255,255,0.4)" />
        </View>
        <View style={{ gap: 16, alignItems: "center" }}>
          <Text style={[typography.headline, { color: "white", textAlign: "center" }]}>Sync your contacts</Text>
          <Text style={[typography.bodyLargeRegular, { color: "white", textAlign: "center" }]}>Find and have fun on Pulse with your friends.</Text>
        </View>
      </View>

      <View style={{ position: "absolute", left: 16, right: 16, bottom: 32, gap: 10 }}>
        <Pressable onPress={finish} style={{ height: 52, borderRadius: 100, alignItems: "center", justifyContent: "center", backgroundColor: "white" }}>
          <Text style={{ color: "#080A0B", fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, letterSpacing: 0.24, textTransform: "uppercase" }}>Sync now</Text>
        </Pressable>
        <Pressable onPress={finish} style={{ height: 52, borderRadius: 100, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, letterSpacing: 0.24, textTransform: "uppercase" }}>Later</Text>
        </Pressable>
      </View>
    </SetupStepLayout>
  );
}
