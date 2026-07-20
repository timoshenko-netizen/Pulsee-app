import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { spacing, typography } from "@/design/theme";

/*
  Ported from starter/src/components/patterns/cell/Cell.tsx (Figma
  "Components Pulse" → Cell / "_Cell/Content", node 450:2686). Same
  generic-slot composition as the web version — leftSlot/rightSlot take
  our own Icon/Avatar/Switch/Button etc. rather than Cell reimplementing
  every right-slot style itself.
*/

export type CellProps = {
  leftSlot?: ReactNode;
  label: string;
  sublabel?: string;
  boldLabel?: boolean;
  value?: string;
  subvalue?: string;
  rightSlot?: ReactNode;
  onPress?: () => void;
};

export function Cell({ leftSlot, label, sublabel, boldLabel = false, value, subvalue, rightSlot, onPress }: CellProps) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={{
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        gap: 12,
        paddingLeft: leftSlot ? 0 : spacing.m,
        paddingRight: rightSlot ? 0 : spacing.m,
        paddingBlock: leftSlot ? spacing["3xs"] : spacing.xs,
        minHeight: 52,
        backgroundColor: "transparent",
      }}
    >
      {leftSlot && <View style={{ flexShrink: 0, paddingLeft: spacing.m }}>{leftSlot}</View>}

      <View style={{ flex: 1, minWidth: 0, flexDirection: "column", gap: 2 }}>
        <Text numberOfLines={1} style={[typography.bodyBasicRegular, { color: "white", fontWeight: boldLabel ? "700" : "500" }]}>
          {label}
        </Text>
        {sublabel ? (
          <Text numberOfLines={1} style={[typography.captionRegular, { color: "rgba(255,255,255,0.7)" }]}>
            {sublabel}
          </Text>
        ) : null}
      </View>

      {value ? (
        <View style={{ flexShrink: 0, flexDirection: "column", alignItems: "flex-end" }}>
          <Text style={[typography.bodyBasicRegular, { color: "white" }]}>{value}</Text>
          {subvalue ? <Text style={[typography.captionRegular, { color: "rgba(255,255,255,0.7)" }]}>{subvalue}</Text> : null}
        </View>
      ) : null}

      {rightSlot && <View style={{ flexShrink: 0, flexDirection: "row", alignItems: "center", paddingRight: spacing.m }}>{rightSlot}</View>}
    </Wrapper>
  );
}
