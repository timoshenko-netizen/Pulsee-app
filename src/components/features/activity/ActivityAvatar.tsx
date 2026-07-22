import { useId } from "react";
import { View } from "react-native";
import Svg, { ClipPath, Defs, Image as SvgImage, Path } from "react-native-svg";
import { Icon, type IconName } from "@/design/icons/Icon";
import { colors } from "@/design/theme";

/*
  52 squircle avatar for Activity event cells — a photo clipped to the
  shared superellipse, or a centered placeholder glyph on a surface fill
  when there's no photo. Same curvature as FeedAvatar / ChatAvatar.
*/
const SQUIRCLE =
  "M0.5002 0 C0.1589 0 0.0007 0.1568 0 0.503 C-0.001 0.8431 0.1568 0.9997 0.5002 1 C0.8411 1 1.0005 0.8477 1 0.503 C0.9992 0.1599 0.8376 0 0.5002 0 Z";

export function ActivityAvatar({ size = 52, uri, icon }: { size?: number; uri?: string | null; icon?: IconName }) {
  const clipId = `act-avatar-${useId()}`;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <ClipPath id={clipId}>
            <Path d={SQUIRCLE} transform={`scale(${size})`} />
          </ClipPath>
        </Defs>
        {uri ? (
          <SvgImage href={{ uri }} x={0} y={0} width={size} height={size} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} />
        ) : (
          <Path d={SQUIRCLE} transform={`scale(${size})`} fill={colors.surfaceFill[10]} />
        )}
      </Svg>
      {!uri ? (
        <View style={{ position: "absolute", left: 0, top: 0, width: size, height: size, alignItems: "center", justifyContent: "center" }} pointerEvents="none">
          <Icon name={icon ?? "human2-outline"} size={26} color="#fff" />
        </View>
      ) : null}
    </View>
  );
}
