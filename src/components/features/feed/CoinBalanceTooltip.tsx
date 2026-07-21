import { Modal, Pressable, Text, View } from "react-native";
import { Coin } from "@/design/coins/Coin";
import { Button } from "@/components/primitives/button/Button";
import { typography } from "@/design/theme";

/*
  Ported from PulseeFeed.dc.html's coin-balance tooltip (TOOLTIP.fig) —
  tapping FeedLeftEarn opens this card showing the See/Wave balances
  with a small pointer triangle back to the pill. "Sign up and earn"
  opens the reward-claim screen (signed-out variant) rather than just
  dismissing — the source wired it as a no-op, but that reads as an
  oversight given the label; wiring real navigation here instead.

  Wrapped in RN's own <Modal>, same reason as BottomSheet: the persistent
  TabBar now lives in the (tabs) layout, a sibling above whatever Feed
  renders internally, so a plain absolute-positioned overlay from inside
  Feed would render UNDER it regardless of its own z-index. Modal always
  renders in its own top-level layer, escaping that sibling stacking order.
*/
export function CoinBalanceTooltip({ onClose, onSignUp }: { onClose: () => void; onSignUp: () => void }) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
    <View style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, zIndex: 46 }}>
      <Pressable onPress={onClose} style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.72)" }} />

      <View style={{ position: "absolute", left: 8, top: 74, width: 312 }}>
        <View style={{ width: 124, height: 20, alignItems: "center", paddingHorizontal: 32 }}>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 14,
              borderRightWidth: 14,
              borderBottomWidth: 14,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "rgb(33,35,35)",
            }}
          />
        </View>
        <View style={{ borderRadius: 24, backgroundColor: "rgb(33,35,35)", gap: 24, padding: 24 }}>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center", padding: 4 }}>
                <Coin name="see" size={24} />
              </View>
              <View>
                <Text style={[typography.title, { color: "white" }]}>2,0 SEE</Text>
                <Text style={[typography.captionRegular, { color: "white" }]}>$5,04</Text>
              </View>
            </View>
            <Text style={[typography.bodyBasicRegular, { color: "white" }]}>
              Watch the feed and make profit by earning withdrawable SEE.
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />

          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center", padding: 4 }}>
                  <Coin name="wave" size={24} />
                </View>
                <View>
                  <Text style={[typography.title, { color: "white" }]}>100 WAVE</Text>
                  <Text style={[typography.captionRegular, { color: "white" }]}>non withdrawable</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4, paddingVertical: 4 }}>
                <Text style={[typography.bodyBasicRegular, { color: "#31F1F0" }]}>Last</Text>
                <Text style={[typography.bodyBasicBold, { color: "#31F1F0" }]}>+ 100 WAVE</Text>
              </View>
            </View>
            <Text style={[typography.bodyBasicRegular, { color: "white" }]}>
              Tasks, invites, activity — it all turns into WAVE. It's in-app currency.
            </Text>
          </View>

          <Button variant="primary" tone="level1" size="l" onPress={onSignUp}>
            Sign up and earn
          </Button>
        </View>
      </View>
    </View>
    </Modal>
  );
}
