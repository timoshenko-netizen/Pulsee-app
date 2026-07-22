import { Image, Text, View } from "react-native";
import { BottomSheet } from "@/components/patterns/bottom-sheet/BottomSheet";
import { Button } from "@/components/primitives/button/Button";
import { Coin } from "@/design/coins/Coin";
import { Illustration, type IllustrationName } from "@/design/illustrations/Illustration";
import { colors, typography } from "@/design/theme";

/*
  Paid-chat flow sheet (PulseeChats.dc.html). Drag-to-dismiss; a decorative
  top-bg strip, a per-state 3D illustration, title/body, an optional
  balance/cost pill (See coin), and buttons. Progression: limits/notokens →
  (confirm) → processing (~1.4s) → success. Copy matches the prototype.
*/
export type PaidState = "limits" | "notokens" | "progress" | "success" | "error";

const TOP_BG = require("./assets/paid-sheet-top-bg.png");

type Pill = { label: string; value: string } | null;
type Config = {
  illo: IllustrationName;
  title: string;
  body: string;
  pill: Pill;
  primary: { label: string; kind: "confirm" | "topup" | "close" } | null;
  secondary: boolean;
};

function configFor(state: PaidState, cost: number): Config {
  switch (state) {
    case "limits":
      return {
        illo: "paid-limits",
        title: "You've hit your free-chat limit 👀",
        body: `You've already started chats with 3 new people today. Opening a new conversation costs ${cost} tokens.`,
        pill: { label: "Your balance", value: "50.61" },
        primary: { label: `Send for ${cost} tokens`, kind: "confirm" },
        secondary: true,
      };
    case "notokens":
      return {
        illo: "paid-notokens",
        title: "Not enough tokens ⚠️",
        body: `You need ${cost} tokens to open a new conversation. Top up your balance.`,
        pill: { label: "Your balance", value: "0.00" },
        primary: { label: "Top up balance", kind: "topup" },
        secondary: true,
      };
    case "progress":
      return { illo: "paid-progress", title: "Processing payment", body: "Just a moment…", pill: { label: "Cost", value: String(cost) }, primary: null, secondary: false };
    case "success":
      return {
        illo: "paid-success",
        title: "Message sent",
        body: `${cost} tokens charged. Your message is on its way.`,
        pill: { label: "Balance remaining", value: (50.61 - cost).toFixed(2) },
        primary: { label: "Continue", kind: "close" },
        secondary: false,
      };
    case "error":
      return { illo: "paid-error", title: "Couldn't send", body: "Something went wrong. No tokens were charged. Please try again.", pill: null, primary: { label: "Try again", kind: "confirm" }, secondary: true };
  }
}

export type PaidSheetProps = {
  state: PaidState | null;
  cost: number;
  onConfirm: () => void;
  onTopUp: () => void;
  onClose: () => void;
};

export function PaidSheet({ state, cost, onConfirm, onTopUp, onClose }: PaidSheetProps) {
  if (!state) return null;
  const cfg = configFor(state, cost);
  const runPrimary = () => {
    if (!cfg.primary) return;
    if (cfg.primary.kind === "confirm") onConfirm();
    else if (cfg.primary.kind === "topup") onTopUp();
    else onClose();
  };

  return (
    <BottomSheet
      open={state !== null}
      onClose={onClose}
      draggable
      topRadius={40}
      dismissThreshold={120}
      topOverlay={<Image source={TOP_BG} style={{ width: "100%", height: 160 }} resizeMode="cover" />}
    >
      <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 24, alignItems: "center" }}>
        <Illustration name={cfg.illo} width={208} height={150} />
        <View style={{ gap: 8, alignItems: "center" }}>
          <Text style={[typography.title, { color: "#fff", textAlign: "center" }]}>{cfg.title}</Text>
          <Text style={{ fontFamily: "Montserrat", fontWeight: "400", fontSize: 14, lineHeight: 20, color: "#fff", textAlign: "center" }}>{cfg.body}</Text>
        </View>

        {cfg.pill ? (
          <View style={{ width: "100%", height: 52, borderRadius: 20, backgroundColor: colors.surfaceFill[10], flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }}>
            <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 14, color: colors.text.secondary }}>{cfg.pill.label}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ fontFamily: "Montserrat", fontWeight: "700", fontSize: 16, color: "#fff" }}>{cfg.pill.value}</Text>
              <Coin name="see" size={20} />
            </View>
          </View>
        ) : null}

        {cfg.primary ? (
          <View style={{ width: "100%", gap: 10 }}>
            <Button variant="primary" tone="white" size="l" onPress={runPrimary}>{cfg.primary.label}</Button>
            {cfg.secondary ? (
              <Button variant="secondary" size="l" onPress={onClose}>Cancel</Button>
            ) : null}
          </View>
        ) : null}
      </View>
    </BottomSheet>
  );
}
