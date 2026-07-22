import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@/design/icons/Icon";
import { colors, typography } from "@/design/theme";
import { ChatAvatar } from "./ChatAvatar";
import { ReadTicks } from "./ReadTicks";
import type { InboxMeta } from "./types";

/*
  A single inbox list row (52 squircle avatar + name + 2-line preview +
  trailing meta). Two flavors:
    - conversation row: photo avatar (+ online dot), name, preview
      (with "Draft: " prefix when a draft exists), and a right column of
      time + unread badge / read ticks.
    - pinned row (Reactions / Messages from Pulsee): glyph avatar, title,
      preview, and a chevron instead of meta.
*/
const NAME = [typography.bodyBasicBold, { color: "#fff" }];
const PREVIEW = { fontFamily: "Montserrat", fontWeight: "500" as const, fontSize: 12, lineHeight: 16, letterSpacing: 0.06, color: colors.text.secondary };
const TIME = [typography.captionRegular, { color: colors.text.secondary }];

function Row({ avatar, name, preview, previewNode, right, onPress }: {
  avatar: React.ReactNode;
  name: string;
  preview?: string;
  previewNode?: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", gap: 16, minHeight: 52, paddingHorizontal: 20, paddingVertical: 4 }}>
      <View style={{ flexShrink: 0 }}>{avatar}</View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text style={NAME} numberOfLines={1}>{name}</Text>
        {previewNode ?? (
          <Text style={PREVIEW} numberOfLines={2}>{preview}</Text>
        )}
      </View>
      {right ? <View style={{ flexShrink: 0 }}>{right}</View> : null}
    </Pressable>
  );
}

export function ConversationRow({ name, uri, meta, onPress }: { name: string; uri: string; meta: InboxMeta; onPress?: () => void }) {
  const preview = (
    <Text style={PREVIEW} numberOfLines={2}>
      {meta.draft ? <Text style={{ color: colors.text.negative }}>Draft: </Text> : null}
      {meta.preview}
    </Text>
  );

  const right = (
    <View style={{ alignItems: "flex-end", justifyContent: "center", gap: 4, alignSelf: "stretch" }}>
      <Text style={[...TIME, { fontSize: 12, lineHeight: 14 }]}>{meta.time}</Text>
      {meta.badge ? (
        <LinearGradient
          colors={["#02E1FF", "#01FFC2"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={{ minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 100, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontFamily: "Montserrat", fontWeight: "700", fontSize: 11, color: "#080A0B" }}>{meta.badge}</Text>
        </LinearGradient>
      ) : meta.read ? (
        <ReadTicks read={meta.read} context="inbox" />
      ) : null}
    </View>
  );

  return <Row avatar={<ChatAvatar size={52} uri={uri} online={meta.online} />} name={name} previewNode={preview} right={right} onPress={onPress} />;
}

export function PinnedRow({ icon, title, preview, onPress }: { icon: "heart-outline" | "flash-outline"; title: string; preview: string; onPress?: () => void }) {
  return (
    <Row
      avatar={<ChatAvatar size={52} icon={icon} />}
      name={title}
      preview={preview}
      right={
        <View style={{ alignItems: "center", justifyContent: "center", alignSelf: "stretch" }}>
          <Icon name="chevron-right" size={20} color="#fff" />
        </View>
      }
      onPress={onPress}
    />
  );
}
