import { View, Text } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import { Icon } from "@/design/icons/Icon";
import { Button } from "@/components/primitives/button/Button";
import { typography } from "@/design/theme";

/*
  Ported from PulseeSignup.dc.html's onboarding screen (first launch).
  Hero background is the real plitki.mp4 clip from the design handoff
  (assets/videos/plitki.mp4), looping and muted, matching the source
  exactly.
*/
const PLITKI_CLIP = require("../../assets/videos/plitki.mp4");

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const player = useVideoPlayer(PLITKI_CLIP, (p) => { p.loop = true; p.muted = true; p.play(); });
  return (
    <View style={{ flex: 1, backgroundColor: "#080A0B" }}>
      <View style={{ flex: 1 }}>
        <VideoView player={player} style={{ flex: 1 }} contentFit="cover" nativeControls={false} />
        <LinearGradient
          colors={["rgba(8,10,11,0.55)", "rgba(8,10,11,0.15)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: "absolute", left: 0, top: 0, right: 0, height: "55%" }}
        />
        <LinearGradient
          colors={["rgba(8,10,11,0)", "#080A0B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 220 }}
        />
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: insets.bottom + 24, gap: 16 }}>
        <View
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            height: 32,
            paddingHorizontal: 14,
            borderRadius: 100,
            backgroundColor: "rgba(255,255,255,0.15)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.35)",
          }}
        >
          <Icon name="arrow-rise-up" size={16} color="#31F1F0" />
          <Text style={{ color: "#31F1F0", fontFamily: "Montserrat", fontWeight: "800", fontSize: 14, letterSpacing: 0.28 }}>TRAIN AI</Text>
        </View>

        <Text style={[typography.otherPromotion, { color: "white" }]}>
          You watch.{"\n"}AI learns.{"\n"}You earn.
        </Text>
        <Text style={[typography.bodyLargeRegular, { color: "white" }]}>
          Earn up to $20 in your first 3 days — just by watching videos.
        </Text>

        <View style={{ width: "100%" }}>
          <Button variant="primary" tone="level1" size="l" onPress={() => router.push("/login")}>
            Start earning
          </Button>
        </View>

        <Text style={[typography.captionRegular, { color: "rgb(185,185,185)", textAlign: "center" }]}>
          By continuing, you agree to the User Agreement, Terms of Use, and Privacy Policy.
        </Text>
      </View>
    </View>
  );
}
