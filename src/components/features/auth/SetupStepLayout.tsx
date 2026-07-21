import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@/design/icons/Icon";
import { typography } from "@/design/theme";

const TOTAL_STEPS = 4;

export function SetupStepLayout({ step, onBack, children }: { step: number; onBack: () => void; children: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#080A0B" }}>
      <View style={{ flexDirection: "row", gap: 4, paddingHorizontal: 20, paddingTop: 20 }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <View key={i} style={{ flex: 1, height: 8, borderRadius: 100, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.15)" }}>
            {i < step ? (
              <LinearGradient colors={["#01D9FF", "#31F1F0"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ flex: 1 }} />
            ) : null}
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", height: 52, paddingHorizontal: 8, marginTop: 8 }}>
        <Pressable onPress={onBack} style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
          <Icon name="arrow-left" size={24} color="white" />
        </Pressable>
        <Text style={[typography.bodyLargeRegular, { color: "rgb(185,185,185)", flex: 1, textAlign: "center", marginRight: 40 }]}>
          {step + 1} of {TOTAL_STEPS}
        </Text>
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
