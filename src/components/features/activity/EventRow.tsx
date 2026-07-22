import { useId } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Svg, { ClipPath, Defs, Image as SvgImage, LinearGradient as SvgGradient, Path, Stop } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Icon } from "@/design/icons/Icon";
import { colors } from "@/design/theme";
import { ActivityAvatar } from "./ActivityAvatar";
import { FollowButton } from "./FollowButton";
import { DATING, type GradSpec } from "./gradients";
import type { ActivityEvent } from "./types";

const SQUIRCLE =
  "M0.5002 0 C0.1589 0 0.0007 0.1568 0 0.503 C-0.001 0.8431 0.1568 0.9997 0.5002 1 C0.8411 1 1.0005 0.8477 1 0.503 C0.9992 0.1599 0.8376 0 0.5002 0 Z";

const SECONDARY = colors.text.secondary;

function Chevron({ size = 20, color = SECONDARY }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

/* ---- Standard event row (photo/icon avatar + rich text + trailing control) ---- */
export function StandardEventRow({ ev, unread, following, onFollow, onPress }: {
  ev: ActivityEvent;
  unread: boolean;
  following: boolean;
  onFollow: () => void;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", gap: 16, paddingVertical: 16, paddingHorizontal: 20, alignItems: "center", backgroundColor: unread ? colors.bg.secondary : "transparent" }}>
      <ActivityAvatar size={52} uri={ev.av} icon={ev.icon} />
      <Text style={{ flex: 1, minWidth: 0, fontFamily: "Montserrat", fontSize: 14, lineHeight: 18, letterSpacing: 0.14, color: "#fff" }}>
        <Text style={{ fontWeight: "700" }}>{ev.name}</Text>
        <Text style={{ fontWeight: "500" }}>{" " + (ev.text ?? "") + " "}</Text>
        {ev.time ? <Text style={{ fontWeight: "500", fontSize: 12, color: SECONDARY }}>{ev.time}</Text> : null}
      </Text>
      {ev.right === "thumb" && ev.th ? (
        <Image source={{ uri: ev.th }} style={{ width: 40, height: 52, borderRadius: 8 }} resizeMode="cover" />
      ) : null}
      {ev.right === "follow" ? <FollowButton following={following} onPress={onFollow} /> : null}
      {ev.right === "chevron" ? <Chevron /> : null}
    </Pressable>
  );
}

/* ---- Dating ring cell (gradient ring + corner badge + name pill) ---- */
function DatingAvatar({ uri, ring, blur }: { uri: string; ring: GradSpec; blur: boolean }) {
  const gid = `ring-${useId()}`;
  const outId = `sq-out-${useId()}`;
  const inId = `sq-in-${useId()}`;
  return (
    <View style={{ width: 52, height: 52 }}>
      <Svg width={52} height={52} viewBox="0 0 52 52">
        <Defs>
          <SvgGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={ring.colors[0]} />
            <Stop offset="1" stopColor={ring.colors[1]} />
          </SvgGradient>
          <ClipPath id={outId}><Path d={SQUIRCLE} transform="scale(52)" /></ClipPath>
          <ClipPath id={inId}><Path d={SQUIRCLE} transform="translate(2,2) scale(48)" /></ClipPath>
        </Defs>
        <Path d={SQUIRCLE} transform="scale(52)" fill={`url(#${gid})`} clipPath={`url(#${outId})`} />
        <SvgImage href={{ uri }} x={2} y={2} width={48} height={48} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${inId})`} />
      </Svg>
      {blur ? <BlurView intensity={22} tint="dark" style={{ position: "absolute", left: 2, top: 2, width: 48, height: 48, borderRadius: 15 }} /> : null}
    </View>
  );
}

export function DatingRow({ ev, onPress }: { ev: ActivityEvent; onPress: () => void }) {
  const cfg = DATING[ev.dtype ?? "liked"];
  const blur = ev.name === "someone";
  return (
    <Pressable onPress={onPress} style={{ flexDirection: "row", gap: 16, paddingVertical: 16, paddingHorizontal: 20, alignItems: "center", backgroundColor: cfg.cell ? undefined : "transparent" }}>
      {cfg.cell ? <LinearGradient colors={cfg.cell.colors} start={cfg.cell.start} end={cfg.cell.end} style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }} /> : null}
      <View style={{ width: 52, height: 52 }}>
        <DatingAvatar uri={ev.av as string} ring={cfg.ring} blur={blur} />
        <LinearGradient colors={cfg.ring.colors} start={cfg.ring.start} end={cfg.ring.end} style={{ position: "absolute", top: -6, left: -6, width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" }}>
          <Icon name={cfg.badgeIcon} size={12} color="#fff" />
        </LinearGradient>
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Text style={{ fontFamily: "Montserrat", fontWeight: "700", fontSize: 14, lineHeight: 18, color: "#fff" }}>{ev.name}</Text>
          <LinearGradient colors={cfg.pill.colors} start={cfg.pill.start} end={cfg.pill.end} style={{ height: 24, paddingHorizontal: 12, borderRadius: 100, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, color: "#fff" }}>{ev.pill}</Text>
          </LinearGradient>
        </View>
        <Text style={{ fontFamily: "Montserrat", fontSize: 14, lineHeight: 18, color: "#fff" }}>
          <Text style={{ fontWeight: "600" }}>on dating!</Text>
          <Text style={{ fontWeight: "500", fontSize: 12, color: "rgba(255,255,255,0.72)" }}>{" " + (ev.time ?? "")}</Text>
        </Text>
      </View>
      <Chevron size={22} color="#fff" />
    </Pressable>
  );
}

/* ---- Boost promo cell ---- */
export function BoostRow({ ev, onPress }: { ev: ActivityEvent; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ height: 84 }}>
      <LinearGradient colors={["rgba(151,59,255,0.7)", "rgba(151,59,255,0.3)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 20 }}>
        <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.surfaceFill[15], alignItems: "center", justifyContent: "center" }}>
          <Icon name="rocket-fill" size={32} color="#fff" />
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text style={{ fontFamily: "Montserrat", fontWeight: "700", fontSize: 14, lineHeight: 16, letterSpacing: 0.14, color: "#fff" }}>{ev.name}</Text>
          <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 12, lineHeight: 14, color: "rgba(255,255,255,0.85)" }}>Earn up to $10{"\n"}from extra views</Text>
        </View>
        <View style={{ width: 80, height: 28, borderRadius: 100, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontFamily: "Montserrat", fontWeight: "700", fontSize: 10, lineHeight: 12, letterSpacing: 0.1, color: colors.bg.primary }}>Boost Video</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
