import { useId } from "react";
import { View, type ViewStyle } from "react-native";
import Svg, { ClipPath, Defs, Image as SvgImage, Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, type IconName } from "@/design/icons/Icon";
import { colors } from "@/design/theme";

/*
  Squircle avatar for Chats (inbox rows 52, thread header 40). Reuses the
  same normalized superellipse clip path as FeedAvatar so the curvature
  matches the rest of the app. Two modes: a photo (clipped to the
  squircle) or a centered glyph on a #212323 squircle (the pinned
  "Reactions" / "Messages from Pulsee" rows). Optional online dot: a 12px
  ring of canvas color around an 8px orange→mint gradient dot.
*/
const SQUIRCLE_CLIP_PATH =
  "M0.5002 0 C0.1589 0 0.0007 0.1568 0 0.503 C-0.001 0.8431 0.1568 0.9997 0.5002 1 C0.8411 1 1.0005 0.8477 1 0.503 C0.9992 0.1599 0.8376 0 0.5002 0 Z";

export type ChatAvatarProps = {
  size?: number;
  /** Photo URL — clipped to the squircle. */
  uri?: string;
  /** Glyph mode (pinned cells) — rendered centered on a surface-colored squircle. */
  icon?: IconName;
  iconColor?: string;
  online?: boolean;
  style?: ViewStyle;
};

export function ChatAvatar({ size = 52, uri, icon, iconColor = "#fff", online = false, style }: ChatAvatarProps) {
  const clipId = `chat-avatar-clip-${useId()}`;
  const dot = size >= 52 ? 12 : 10;
  const inner = (dot * 8) / 12;

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <ClipPath id={clipId}>
            <Path d={SQUIRCLE_CLIP_PATH} transform={`scale(${size})`} />
          </ClipPath>
        </Defs>
        {uri ? (
          <SvgImage href={{ uri }} x={0} y={0} width={size} height={size} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} />
        ) : (
          <Path d={SQUIRCLE_CLIP_PATH} transform={`scale(${size})`} fill={colors.bg.secondary} />
        )}
      </Svg>

      {icon ? (
        <View style={{ position: "absolute", left: 0, top: 0, width: size, height: size, alignItems: "center", justifyContent: "center" }} pointerEvents="none">
          <Icon name={icon} size={24} color={iconColor} />
        </View>
      ) : null}

      {online ? (
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            backgroundColor: colors.bg.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LinearGradient
            colors={["#FD4B03", "#31F1F0"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ width: inner, height: inner, borderRadius: inner / 2 }}
          />
        </View>
      ) : null}
    </View>
  );
}
