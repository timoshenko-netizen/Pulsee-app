import { useId } from "react";
import { Pressable, View } from "react-native";
import Svg, { ClipPath, Defs, Image as SvgImage, Path } from "react-native-svg";
import { Icon } from "@/design/icons/Icon";

/*
  Ported from starter/src/components/features/feed/FeedAvatar.tsx (Figma
  "Components Pulse" -> Feed page -> "_Feed/Right Bar", 13457:3916), the
  avatar block embedded at the top of the action rail: a 44x44 box
  holding a 30x30 avatar photo, a slightly larger ring-stroke overlay, and
  a follow badge (solid cyan #01E3EB circle with a black plus, 16x16)
  pinned to the top-right corner. Distinct from the general-purpose
  _Feed/Avatar/Following status badge elsewhere in the system.

  The photo is clipped to the ring's actual squircle curvature (not a
  plain circle) via react-native-svg's ClipPath, so the photo edge
  matches the ring overlay's curve exactly at any size.
*/
const SQUIRCLE_CLIP_PATH = "M0.5002 0 C0.1589 0 0.0007 0.1568 0 0.503 C-0.001 0.8431 0.1568 0.9997 0.5002 1 C0.8411 1 1.0005 0.8477 1 0.503 C0.9992 0.1599 0.8376 0 0.5002 0 Z";

export type FeedAvatarProps = {
  src: string;
  size?: number;
  /** When true, the "follow" plus badge is hidden — you already follow this account. */
  followed?: boolean;
  onClick?: () => void;
};

export function FeedAvatar({ src, size = 44, followed = false, onClick }: FeedAvatarProps) {
  const avatarSize = (size * 30) / 44;
  const ringSize = (size * 45.8182) / 44;
  const clipId = `feed-avatar-clip-${useId()}`;
  const Wrapper = onClick ? Pressable : View;

  return (
    <Wrapper
      onPress={onClick}
      style={{
        width: size,
        height: size,
        shadowColor: "rgba(0,0,0,0.4)",
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2,
        shadowOpacity: 1,
      }}
    >
      <View style={{ position: "absolute", left: (size - avatarSize) / 2, top: (size - avatarSize) / 2, width: avatarSize, height: avatarSize }}>
        <Svg width={avatarSize} height={avatarSize} viewBox={`0 0 ${avatarSize} ${avatarSize}`}>
          <Defs>
            <ClipPath id={clipId}>
              <Path d={SQUIRCLE_CLIP_PATH} transform={`scale(${avatarSize})`} />
            </ClipPath>
          </Defs>
          <SvgImage href={{ uri: src }} x={0} y={0} width={avatarSize} height={avatarSize} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} />
        </Svg>
      </View>
      <View style={{ position: "absolute", left: (size - ringSize) / 2, top: (size - ringSize) / 2, width: ringSize, height: ringSize }}>
        <Icon name="feed-avatar-ring" size={ringSize} />
      </View>
      {!followed && (
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: "#01E3EB",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "rgba(0,0,0,0.4)",
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 2,
            shadowOpacity: 1,
          }}
        >
          <Icon name="feed-follow-plus" size={8} />
        </View>
      )}
    </Wrapper>
  );
}
