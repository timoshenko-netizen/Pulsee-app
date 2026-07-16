import { Pressable, Text, View } from "react-native";
import { Icon } from "@/design/icons/Icon";
import { naturalGlyphSize } from "@/design/icons/naturalSize";
import { typography } from "@/design/theme";
import { FeedAvatar } from "./FeedAvatar";
import { MusicBadge } from "./MusicBadge";

/*
  Ported from starter/src/components/features/feed/FeedRightBar.tsx (Figma
  "Components Pulse" -> Feed page -> "Feed Navigation", 3440:419). "Like"
  has real Tapped=Off/On shape pairs since it's the one action our app
  actually toggles; Comment/Share/More stay single-shape plain actions.
  Only "Default" and "No Music" styles are implemented.
*/
function RailIcon({ name, count, size = 32, color = "white", onClick }: { name: "feed-like" | "feed-like-tapped" | "feed-comment" | "feed-share"; count: string; size?: number; color?: string; onClick?: () => void }) {
  const { width, height } = naturalGlyphSize(name, size);
  return (
    <Pressable onPress={onClick} style={{ alignItems: "center", shadowColor: "rgba(0,0,0,0.4)", shadowOffset: { width: 0, height: 0 }, shadowRadius: 2, shadowOpacity: 1 }}>
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Icon name={name} size={Math.max(width, height)} color={color} />
      </View>
      <Text style={[typography.captionBold, { color: "white", textShadowColor: "rgba(0,0,0,0.4)", textShadowRadius: 2 }]}>{count}</Text>
    </Pressable>
  );
}

export type FeedRightBarProps = {
  avatarSrc: string;
  followed?: boolean;
  onFollow?: () => void;
  likeCount: string;
  liked?: boolean;
  likeColor?: string;
  onLike?: () => void;
  commentCount: string;
  onComment?: () => void;
  shareCount: string;
  onShare?: () => void;
  onMore?: () => void;
  musicCoverSrc?: string;
  style?: "Default" | "No Music";
};

export function FeedRightBar({
  avatarSrc, followed, onFollow,
  likeCount, liked = false, likeColor = "white", onLike,
  commentCount, onComment,
  shareCount, onShare,
  onMore,
  musicCoverSrc, style = "Default",
}: FeedRightBarProps) {
  const moreSize = naturalGlyphSize("feed-more", 32);
  return (
    <View style={{ width: 40, alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
      <FeedAvatar src={avatarSrc} followed={followed} onClick={onFollow} />
      <RailIcon name={liked ? "feed-like-tapped" : "feed-like"} count={likeCount} color={likeColor} onClick={onLike} />
      <RailIcon name="feed-comment" count={commentCount} onClick={onComment} />
      <RailIcon name="feed-share" count={shareCount} onClick={onShare} />
      <Pressable onPress={onMore} style={{ shadowColor: "rgba(0,0,0,0.4)", shadowOffset: { width: 0, height: 0 }, shadowRadius: 2, shadowOpacity: 1 }}>
        <View style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}>
          <Icon name="feed-more" size={Math.max(moreSize.width, moreSize.height)} color="white" />
        </View>
      </Pressable>
      {style === "Default" && musicCoverSrc && <MusicBadge coverSrc={musicCoverSrc} />}
    </View>
  );
}
