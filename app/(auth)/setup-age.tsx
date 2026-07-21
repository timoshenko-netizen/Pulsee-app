import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { SetupStepLayout } from "@/components/features/auth/SetupStepLayout";
import { typography } from "@/design/theme";

const AGE_OPTIONS = ["12–18", "19–24", "25–34", "35–45", "45+"];

export default function SetupAge() {
  const [ageGroup, setAgeGroup] = useState<string | null>(null);

  return (
    <SetupStepLayout step={1} onBack={() => router.back()}>
      <View style={{ paddingTop: 20, gap: 20 }}>
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          <Text style={[typography.headline, { color: "white" }]}>Select your age group</Text>
          <Text style={[typography.bodyBasicRegular, { color: "rgb(185,185,185)" }]}>Other users won't see this information.</Text>
        </View>
        <View>
          {AGE_OPTIONS.map((a) => {
            const selected = ageGroup === a;
            return (
              <Pressable
                key={a}
                onPress={() => setAgeGroup(a)}
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 52, paddingHorizontal: 20 }}
              >
                <Text style={[typography.bodyLargeRegular, { color: "white" }]}>{a}</Text>
                <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: selected ? "#FD4B03" : "rgba(255,255,255,0.70)", alignItems: "center", justifyContent: "center" }}>
                  {selected ? <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#FD4B03" }} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ position: "absolute", left: 16, right: 16, bottom: 32 }}>
        <Pressable
          onPress={() => { if (ageGroup) router.push("/setup-gender"); }}
          style={{ height: 52, borderRadius: 100, alignItems: "center", justifyContent: "center", backgroundColor: "white", opacity: ageGroup ? 1 : 0.5 }}
        >
          <Text style={{ color: "#080A0B", fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, letterSpacing: 0.24, textTransform: "uppercase" }}>Next</Text>
        </Pressable>
      </View>
    </SetupStepLayout>
  );
}
