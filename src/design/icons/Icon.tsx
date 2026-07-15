import type { ViewStyle } from "react-native";
import { View } from "react-native";
import { ICON_REGISTRY, type IconName } from "./icon-registry";

export type { IconName };

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
};

/*
  RN equivalent of the web app's design/icons/Icon.tsx. Figma exports every
  icon with preserveAspectRatio="none" baked into the source (stretches
  non-square glyphs to fill whatever box they're given) — on web that's
  fixed with a string-replace on the raw SVG before injecting it via
  dangerouslySetInnerHTML. There's no raw-string stage here: Metro compiles
  each .svg into a real react-native-svg component at bundle time, so the
  override has to happen via the `preserveAspectRatio` prop at the call
  site instead — confirmed (via a headless-Chrome smoke test against a
  known non-square icon) that an explicit prop here does take precedence
  over the source's own hardcoded attribute.
*/
export function Icon({ name, size = 24, color, style }: IconProps) {
  const Glyph = ICON_REGISTRY[name];
  if (!Glyph) return null;
  return (
    <View style={[{ width: size, height: size, alignItems: "center", justifyContent: "center" }, style]}>
      <Glyph width={size} height={size} color={color} preserveAspectRatio="xMidYMid meet" />
    </View>
  );
}
