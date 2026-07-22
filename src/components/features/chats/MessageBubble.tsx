import { ImageBackground, Pressable, Text, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { colors } from "@/design/theme";
import { ReadTicks } from "./ReadTicks";
import { WAVEFORM_BARS } from "./data";
import type { Message } from "./types";

/*
  A single chat message bubble (PulseeChats.dc.html). Renders text / voice
  / video, an optional reaction badge pinned to the bottom corner, and an
  optional reply-quote block on top of a sent bubble. Long-press (420ms) or
  right-click opens the action menu (handled by the parent via onLongPress).
*/
const VIDEO_THUMB = require("./assets/video-msg.jpg");

const MINE_BG = "rgb(0,143,168)";

type RadiusStyle = { borderTopLeftRadius: number; borderTopRightRadius: number; borderBottomRightRadius: number; borderBottomLeftRadius: number };

function bubbleRadius(mine: boolean): RadiusStyle {
  return mine
    ? { borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomRightRadius: 0, borderBottomLeftRadius: 12 }
    : { borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomRightRadius: 12, borderBottomLeftRadius: 0 };
}

function PlayPause({ paused, variant }: { paused: boolean; variant: "voice" | "video" }) {
  const c = "#fff";
  if (variant === "voice") {
    return paused ? (
      <Svg width={12} height={14} viewBox="0 0 12 14" fill={c}><Path d="M0 1.2v11.6c0 .9 1 1.5 1.8 1L11 8.1c.7-.5.7-1.6 0-2L1.8.2C1 -.3 0 .3 0 1.2Z" /></Svg>
    ) : (
      <Svg width={12} height={14} viewBox="0 0 12 14" fill={c}><Rect x={1} y={1} width={3.4} height={12} rx={1} /><Rect x={7.6} y={1} width={3.4} height={12} rx={1} /></Svg>
    );
  }
  return paused ? (
    <Svg width={18} height={20} viewBox="0 0 18 20" fill={c}><Path d="M0 2v16c0 1.3 1.4 2.1 2.5 1.4L15.6 11c1-.7 1-2.2 0-2.9L2.5.6C1.4-.1 0 .7 0 2Z" /></Svg>
  ) : (
    <Svg width={18} height={20} viewBox="0 0 18 20" fill={c}><Rect x={2} y={1} width={5} height={18} rx={1.5} /><Rect x={11} y={1} width={5} height={18} rx={1.5} /></Svg>
  );
}

function ReplyQuote({ name, text }: { name: string; text: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "stretch", marginBottom: 2 }}>
      <View style={{ width: 3, borderRadius: 2, backgroundColor: colors.text.negative }} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontFamily: "Montserrat", fontWeight: "700", fontSize: 13, lineHeight: 16, color: colors.text.negative }} numberOfLines={1}>{name}</Text>
        <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 13, lineHeight: 16, color: colors.text.secondary }} numberOfLines={1}>{text}</Text>
      </View>
    </View>
  );
}

export type MessageBubbleProps = {
  message: Message;
  /** current reaction emoji on this message, if any */
  reaction?: string;
  playing?: boolean;
  onTogglePlay?: () => void;
  onLongPress?: () => void;
};

export function MessageBubble({ message, reaction, playing = false, onTogglePlay, onLongPress }: MessageBubbleProps) {
  const mine = message.s === "me";
  const metaColor = mine ? "rgba(255,255,255,0.75)" : colors.text.secondary;
  const radius = bubbleRadius(mine);
  const bg = mine ? MINE_BG : colors.bg.secondary;

  const Meta = (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2, transform: [{ translateY: 2 }] }}>
      <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 10, lineHeight: 12, color: metaColor }}>{message.tm}</Text>
      {mine && message.r === true ? <ReadTicks read="double" context="bubble" /> : null}
      {mine && message.r === false ? <ReadTicks read="single" context="bubble" /> : null}
    </View>
  );

  let inner: React.ReactNode;
  if (message.t === "text") {
    inner = (
      <View style={[radius, { backgroundColor: bg, paddingTop: 10, paddingRight: 12, paddingBottom: 8, paddingLeft: 16, gap: 4 }]}>
        {message.reply ? <ReplyQuote name={message.reply.name} text={message.reply.text} /> : null}
        <View style={{ flexDirection: "row", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
          <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 14, lineHeight: 18, letterSpacing: 0.14, color: "#fff" }}>{message.x}</Text>
          {Meta}
        </View>
      </View>
    );
  } else if (message.t === "voice") {
    inner = (
      <View style={[radius, { backgroundColor: bg, paddingVertical: 12, paddingHorizontal: 14, flexDirection: "row", gap: 10, alignItems: "center" }]}>
        <Pressable onPress={onTogglePlay} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }}>
          <PlayPause paused={!playing} variant="voice" />
        </Pressable>
        <View style={{ flexDirection: "row", gap: 2, height: 24, alignItems: "center" }}>
          {WAVEFORM_BARS.map((h, i) => (
            <View key={i} style={{ width: 2.5, height: h, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.85)" }} />
          ))}
        </View>
        <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 10, color: metaColor, alignSelf: "flex-end" }}>{message.tm}</Text>
      </View>
    );
  } else {
    inner = (
      <ImageBackground source={VIDEO_THUMB} style={{ width: 140, height: 224 }} imageStyle={radius}>
        <Pressable onPress={onTogglePlay} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" }}>
            <PlayPause paused={!playing} variant="video" />
          </View>
        </Pressable>
        <View style={{ position: "absolute", right: 8, bottom: 8, height: 20, paddingLeft: 8, paddingRight: 6, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.72)", flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 10, color: "#fff" }}>{message.tm}</Text>
          {mine && message.r === true ? <ReadTicks read="double" context="bubble" /> : null}
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={{ flexDirection: "row", justifyContent: mine ? "flex-end" : "flex-start" }}>
      <Pressable
        onLongPress={onLongPress}
        delayLongPress={420}
        style={{ maxWidth: 300, position: "relative" }}
      >
        {inner}
        {reaction ? (
          <View
            style={{
              position: "absolute",
              bottom: -10,
              ...(mine ? { left: -4 } : { right: -4 }),
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: colors.bg.secondary,
              borderWidth: 2,
              borderColor: colors.bg.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 13 }}>{reaction}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}
