import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@/design/icons/Icon";
import { colors, typography } from "@/design/theme";
import { ChatAvatar } from "./ChatAvatar";

/*
  Chats top header — a translucent gradient + blur overlay pinned above the
  scroll (matches PulseeChats.dc.html header, z5). Two variants:
    center — decorative StatusBar + a 56px row with a centered title and a
             back arrow pinned left (inbox + system threads).
    thread — back arrow + 40 squircle avatar + name / full-name subtitle.
  Uses the updated Pulsee Arrow glyph (arrow-direction-left) for back-nav.
*/
const ROW_HEIGHT = 56;

/*
  Total header height = top safe-area inset (the OS status bar lives there;
  the gradient + blur extend up behind it) + the 56px nav row. Screens use
  this to offset their scroll content. No decorative StatusBar is rendered
  here — on a real device the OS draws it; faking one would double it.
*/
export function useChatHeaderHeight() {
  const insets = useSafeAreaInsets();
  return insets.top + ROW_HEIGHT;
}

type CenterProps = { variant: "center"; title: string; onBack?: () => void };
type ThreadProps = { variant: "thread"; name: string; full?: string; avatarUri?: string; onBack?: () => void };
export type ChatHeaderProps = CenterProps | ThreadProps;

function BackButton({ onBack }: { onBack?: () => void }) {
  return (
    <Pressable onPress={onBack} hitSlop={8} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center", marginLeft: -10 }}>
      <Icon name="arrow-direction-left" size={24} color="#fff" />
    </Pressable>
  );
}

export function ChatHeader(props: ChatHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 5, paddingTop: insets.top }}>
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={["rgba(8,10,11,0.94)", "rgba(8,10,11,0.6)", "rgba(8,10,11,0)"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      {props.variant === "center" ? (
        <View style={{ height: ROW_HEIGHT, justifyContent: "center", alignItems: "center", paddingHorizontal: 12 }}>
          <View style={{ position: "absolute", left: 12, top: (ROW_HEIGHT - 44) / 2 }}>
            <BackButton onBack={props.onBack} />
          </View>
          <Text style={[typography.bodyBasicBold, { color: "#fff" }]} numberOfLines={1}>
            {props.title}
          </Text>
        </View>
      ) : (
        <View style={{ height: ROW_HEIGHT, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 12 }}>
          <BackButton onBack={props.onBack} />
          <ChatAvatar size={40} uri={props.avatarUri} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[typography.bodyBasicBold, { color: "#fff" }]} numberOfLines={1}>
              {props.name}
            </Text>
            {props.full ? (
              <Text style={[typography.captionRegular, { color: colors.text.secondary }]} numberOfLines={1}>
                {props.full}
              </Text>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
}
