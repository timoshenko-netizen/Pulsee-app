import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients, radii, spacing, typography } from "@/design/theme";

/*
  Ported from starter/src/components/patterns/snack/Snackbar.tsx (Figma
  "Components Pulse" -> Snacks and Info / Snackbar, 239:8246). `background`
  takes a gradients.ts key instead of a CSS var string — defaults to
  conditionSuccess, matching the web default.
*/
export type SnackbarProps = {
  message: string;
  icon?: ReactNode;
  background?: keyof typeof gradients;
  actionLabel?: string;
  onAction?: () => void;
};

export function Snackbar({ message, icon, background = "conditionSuccess", actionLabel, onAction }: SnackbarProps) {
  const g = gradients[background];
  return (
    <View style={{ padding: spacing["2xs"] }}>
      <LinearGradient
        colors={g.colors}
        start={g.start}
        end={g.end}
        locations={g.locations}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing["2xs"],
          minHeight: 56,
          borderRadius: radii.mediumObjects,
          paddingHorizontal: spacing.m,
          paddingVertical: spacing.s,
        }}
      >
        {icon}
        <Text style={[typography.bodyBasicRegular, { color: "white", flex: 1 }]}>{message}</Text>
        {actionLabel ? (
          <Pressable onPress={onAction}>
            <Text style={[typography.bodyBasicBold, { color: "white" }]}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </LinearGradient>
    </View>
  );
}
