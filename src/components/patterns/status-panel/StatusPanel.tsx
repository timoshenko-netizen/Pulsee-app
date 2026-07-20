import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { Button } from "@/components/primitives/button/Button";
import { spacing, typography } from "@/design/theme";

/*
  Ported from starter/src/components/patterns/status-panel/StatusPanel.tsx
  (Figma "Components Pulse" → Status, node 2794:9550).
*/

export type StatusPanelProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  large?: boolean;
};

export function StatusPanel({ icon, title, description, actionLabel, onAction, large = false }: StatusPanelProps) {
  return (
    <View style={{ alignItems: "center", gap: spacing.m, width: large ? 328 : 240 }}>
      <View style={{ alignItems: "center", gap: spacing["2xs"] }}>
        {icon && <View style={{ width: 40, height: 40 }}>{icon}</View>}
        <View style={{ alignItems: "center", gap: spacing["4xs"] }}>
          <Text style={[large ? typography.title : typography.bodyBasicBold, { color: "white", textAlign: "center" }]}>{title}</Text>
          {description ? <Text style={[typography.captionRegular, { color: "rgba(255,255,255,0.7)", textAlign: "center" }]}>{description}</Text> : null}
        </View>
      </View>
      {actionLabel ? (
        <Button variant="secondary" size="m" onPress={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}
