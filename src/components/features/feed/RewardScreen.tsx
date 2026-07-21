import { Modal, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/design/icons/Icon";
import { Coin } from "@/design/coins/Coin";
import { Button } from "@/components/primitives/button/Button";
import { StatusBar } from "@/components/patterns/status-bar/StatusBar";
import { typography } from "@/design/theme";

/*
  Ported from PulseeFeed.dc.html's reward-claim screen (reward.fig),
  signed-in and signed-out variants — reached from the coin-balance
  tooltip's "Sign up and earn" button, or via Feed's debug menu.

  Wrapped in RN's own <Modal>, same reason as BottomSheet/
  CoinBalanceTooltip: guarantees this renders above the (tabs) layout's
  persistent TabBar regardless of where in the tree it's mounted from.
*/
export function RewardScreen({ signedIn, onClose }: { signedIn: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible transparent={false} animationType="slide" onRequestClose={onClose}>
    <View style={{ flex: 1, backgroundColor: "rgb(8,10,11)" }}>
      {Platform.OS === "web" && <StatusBar />}
      <Pressable onPress={onClose} style={{ position: "absolute", right: 16, top: insets.top + 20, width: 24, height: 24, alignItems: "center", justifyContent: "center", zIndex: 2 }}>
        <Icon name="cross" size={10} color="white" />
      </Pressable>

      <View style={{ height: 200, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 16 }}>
        <Coin name="see" size={72} />
        <Coin name="wave" size={72} />
      </View>

      <View style={{ marginHorizontal: 16, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.04)", padding: 24, gap: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={[typography.title, { color: "white" }]}>You get</Text>
          <View style={{ height: 28, paddingHorizontal: 20, borderRadius: 100, backgroundColor: "rgba(12,14,16,0.62)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 10, letterSpacing: 0.8 }}>REWARD HISTORY</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
            <Coin name="see" size={28} />
          </View>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={[typography.bodyBasicBold, { color: "white" }]}>SEE</Text>
              <Text style={[typography.bodyBasicRegular, { color: "rgb(185,185,185)" }]}>withdrawable</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[typography.title, { color: "white" }]}>2.264</Text>
              <Text style={[typography.bodyBasicRegular, { color: "#31F1F0" }]}>(≈$5.26)</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
            <Coin name="wave" size={28} />
          </View>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={[typography.bodyBasicBold, { color: "white" }]}>WAVE</Text>
              <Text style={[typography.bodyBasicRegular, { color: "rgb(185,185,185)" }]}>in-app coin</Text>
            </View>
            <Text style={[typography.title, { color: "white" }]}>100</Text>
          </View>
        </View>
      </View>

      {signedIn ? (
        <View style={{ position: "absolute", left: 20, right: 20, bottom: insets.bottom + 24 }}>
          <Button variant="primary" tone="level1" size="l" onPress={onClose}>
            Cool, got it
          </Button>
        </View>
      ) : (
        <View style={{ position: "absolute", left: 16, right: 16, bottom: insets.bottom + 24, gap: 24, alignItems: "center" }}>
          <Text style={[typography.title, { color: "white", textAlign: "center" }]}>
            Rewards is in your account — Sign up to claim it
          </Text>
          <View style={{ flexDirection: "row", gap: 44 }}>
            <Pressable onPress={onClose} style={{ alignItems: "center", gap: 4 }}>
              <View style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
                {/* Google's real mark is a multi-color logo we don't have in the DS — a plain "G" is an honest placeholder rather than borrowing an unrelated icon. */}
                <Text style={{ color: "#080A0B", fontFamily: "Montserrat", fontWeight: "800", fontSize: 22 }}>G</Text>
              </View>
              <Text style={[typography.captionRegular, { color: "white" }]}>Google</Text>
            </Pressable>
            <Pressable onPress={onClose} style={{ alignItems: "center", gap: 4 }}>
              <View style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
                <Icon name="envelope-outline" size={26} color="#080A0B" />
              </View>
              <Text style={[typography.captionRegular, { color: "white" }]}>Email</Text>
            </Pressable>
            <Pressable onPress={onClose} style={{ alignItems: "center", gap: 4 }}>
              <View style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
                <Icon name="chat-2-outline" size={26} color="#25D366" />
              </View>
              <Text style={[typography.captionRegular, { color: "white" }]}>WhatsApp</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
    </Modal>
  );
}
