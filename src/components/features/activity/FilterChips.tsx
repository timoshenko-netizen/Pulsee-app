import { Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/design/theme";
import { FILTER_CHIPS } from "./data";
import { ACT } from "./gradients";
import type { Filter } from "./types";

/*
  Activity filter chips (All / Likes / Comments / Donations). Active chip =
  #080A0B fill + chip-selected gradient-stroke border (LinearGradient wrap +
  inset fill) + white 700. Inactive = surface fill + white 600.
*/
export function FilterChips({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
      {FILTER_CHIPS.map(({ key, label }) => {
        const active = value === key;
        const chip = (
          <Pressable
            onPress={() => onChange(key)}
            style={{ height: 36, paddingHorizontal: 20, borderRadius: 100, alignItems: "center", justifyContent: "center", backgroundColor: active ? colors.chip.selectedBg : colors.surfaceFill[10] }}
          >
            <Text style={{ fontFamily: "Montserrat", fontWeight: active ? "700" : "600", fontSize: 13, letterSpacing: 0.13, color: "#fff" }}>{label}</Text>
          </Pressable>
        );
        return active ? (
          <LinearGradient key={key} colors={ACT.chipStroke.colors} start={ACT.chipStroke.start} end={ACT.chipStroke.end} locations={ACT.chipStroke.locations} style={{ borderRadius: 100, padding: 1 }}>
            {chip}
          </LinearGradient>
        ) : (
          <View key={key}>{chip}</View>
        );
      })}
    </ScrollView>
  );
}
