import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { colors, gradients, radii, spacing } from "@/design/theme";
import type { ButtonProps, ButtonSize, ButtonTone, ButtonVariant } from "./Button.types";

/*
  Ported from starter/src/components/primitives/button/Button.tsx (Figma
  "Components Pulse" → Button component-set, node 167:182). Same variant
  lookup structure as the web version; the actual paint layer per variant
  differs since RN has no CSS gradients, backdrop-filter, or padding-box/
  border-box border tricks:
  - primary/level2, primary/level3: <LinearGradient> as the fill instead
    of a CSS background gradient.
  - glass: <BlurView> (backdrop blur) for the frosted fill, with a
    gradient "stroke" built from an outer <LinearGradient> (the border
    color) and an inset inner layer (the actual fill) — RN's equivalent
    of the web's padding-box/border-box double-background technique,
    since RN can't paint a literal gradient border directly.
*/

const SIZE_STYLES: Record<ButtonSize, { paddingInline: number; paddingBlock: number; gap: number; fontSize: number; lineHeight: number; letterSpacing: number; uppercase: boolean }> = {
  l: { paddingInline: spacing.m, paddingBlock: spacing.l, gap: spacing["2xs"], fontSize: 12, lineHeight: 16, letterSpacing: 0.72, uppercase: true },
  m: { paddingInline: spacing.m, paddingBlock: spacing.s, gap: spacing["2xs"], fontSize: 12, lineHeight: 16, letterSpacing: 0.72, uppercase: true },
  s: { paddingInline: spacing.m, paddingBlock: spacing.xs, gap: spacing["2xs"], fontSize: 10, lineHeight: 12, letterSpacing: 0.8, uppercase: true },
  xs: { paddingInline: spacing.m, paddingBlock: spacing["3xs"], gap: 0, fontSize: 10, lineHeight: 12, letterSpacing: 0.1, uppercase: false },
};

type Paint = { kind: "solid"; background: string } | { kind: "gradient"; gradient: keyof typeof gradients } | { kind: "glass" };

type VariantStyle = { paint: Paint; color: string; border?: { width: number; color: string } };

const VARIANT_STYLES: Record<string, VariantStyle> = {
  "primary:level1": { paint: { kind: "solid", background: colors.button.primaryLevel1Bg }, color: colors.button.primaryLevel1Action },
  "primary:level2": { paint: { kind: "gradient", gradient: "buttonPrimaryLevel2" }, color: "#FFFFFF" },
  "primary:level3": { paint: { kind: "gradient", gradient: "buttonPrimaryLevel3" }, color: "#FFFFFF" },
  "primary:white": { paint: { kind: "solid", background: colors.button.primaryWhiteBg }, color: colors.button.primaryWhiteAction },
  secondary: { paint: { kind: "solid", background: colors.button.secondaryBg }, color: colors.button.secondaryContent, border: { width: 1, color: colors.button.secondaryStroke } },
  tertiary: { paint: { kind: "solid", background: "transparent" }, color: colors.button.tertiaryContent },
  "additional:default": { paint: { kind: "solid", background: colors.button.additionalDefaultBg }, color: colors.button.additionalDefaultContent },
  "additional:bright": { paint: { kind: "solid", background: colors.button.additionalBrightBg }, color: colors.button.additionalBrightContent },
  glass: { paint: { kind: "glass" }, color: colors.button.glassContent },
  negative: { paint: { kind: "solid", background: colors.button.negativeBg }, color: colors.button.negativeContent },
};

function resolveVariantKey(variant: ButtonVariant, tone?: ButtonTone) {
  if (variant === "primary") return `primary:${tone ?? "level1"}`;
  if (variant === "additional") return `additional:${tone ?? "default"}`;
  return variant;
}

export function Button({ variant = "primary", size = "l", tone, leftIcon, rightIcon, loading = false, disabled = false, onPress, children }: ButtonProps) {
  const variantStyle = VARIANT_STYLES[resolveVariantKey(variant, tone)] ?? VARIANT_STYLES["primary:level1"];
  const sizeStyle = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  const textStyle: TextStyle = {
    color: variantStyle.color,
    fontFamily: "Montserrat",
    fontWeight: "700",
    fontSize: sizeStyle.fontSize,
    lineHeight: sizeStyle.lineHeight,
    letterSpacing: sizeStyle.letterSpacing,
    textTransform: sizeStyle.uppercase ? "uppercase" : "none",
  };

  const shapeStyle: ViewStyle = {
    borderRadius: radii.button,
    paddingInline: sizeStyle.paddingInline,
    paddingBlock: sizeStyle.paddingBlock,
    ...(variantStyle.border ? { borderWidth: variantStyle.border.width, borderColor: variantStyle.border.color } : null),
  };

  const content = loading ? (
    <ActivityIndicator color={variantStyle.color} size="small" />
  ) : (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: sizeStyle.gap }}>
      {leftIcon}
      <Text style={textStyle}>{children}</Text>
      {rightIcon}
    </View>
  );

  return (
    <Pressable onPress={onPress} disabled={isDisabled} style={({ pressed }) => [{ opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1, borderRadius: radii.button }, styles.overflowHidden]}>
      {variantStyle.paint.kind === "solid" && (
        <View style={[shapeStyle, { backgroundColor: variantStyle.paint.background, alignItems: "center", justifyContent: "center" }]}>{content}</View>
      )}
      {variantStyle.paint.kind === "gradient" && (
        <LinearGradient
          colors={gradients[variantStyle.paint.gradient].colors}
          start={gradients[variantStyle.paint.gradient].start}
          end={gradients[variantStyle.paint.gradient].end}
          locations={gradients[variantStyle.paint.gradient].locations}
          style={[shapeStyle, { alignItems: "center", justifyContent: "center" }]}
        >
          {content}
        </LinearGradient>
      )}
      {variantStyle.paint.kind === "glass" && (
        <LinearGradient
          colors={gradients.buttonGlassStroke.colors}
          start={gradients.buttonGlassStroke.start}
          end={gradients.buttonGlassStroke.end}
          locations={gradients.buttonGlassStroke.locations}
          style={{ borderRadius: radii.button, padding: 0.5 }}
        >
          <BlurView intensity={40} tint="dark" style={[shapeStyle, { backgroundColor: colors.button.glassBg, borderWidth: 0, alignItems: "center", justifyContent: "center", overflow: "hidden" }]}>
            {content}
          </BlurView>
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overflowHidden: { overflow: "hidden" },
});
