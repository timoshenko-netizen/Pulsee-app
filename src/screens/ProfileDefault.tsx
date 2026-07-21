import { useState } from "react";
import { Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/design/icons/Icon";
import { Button } from "@/components/primitives/button/Button";
import { Cell } from "@/components/patterns/cell/Cell";
import { BottomSheet } from "@/components/patterns/bottom-sheet/BottomSheet";
import { StatusBar } from "@/components/patterns/status-bar/StatusBar";
import { Snackbar } from "@/components/patterns/snack/Snackbar";
import { DevMenu } from "@/screens/dev/DevMenu";
import { soon } from "@/lib/soon";
import { typography } from "@/design/theme";

/*
  Ported from PulseeProfile.dc.html's main profile view. Simplified from
  the source in one deliberate way: the source's content panel drags up
  over the header with a badge shrink+glide FLIP animation on drag —
  a bespoke gesture micro-interaction that's a lot of effort for a
  panel that reads identically at rest either way. This renders it
  static (resting position only) rather than half-porting the gesture;
  flagging it here rather than silently dropping it.

  "Other user" is only reachable via the debug menu for now — nothing
  else in the app yet links to a stranger's profile (no user list, no
  tappable @mentions elsewhere).
*/

type MineMode = "filled" | "empty";
type OtherMode = "videos" | "empty" | "blocked";

const VIDEOS = [
  { img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80", views: "2.5M", boosted: false, stack: false, music: true },
  { img: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&q=80", views: "8.1M", boosted: true, stack: true, music: false },
  { img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80", views: "6.3M", boosted: true, stack: false, music: true },
  { img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80", views: "1.2M", boosted: true, stack: true, music: false },
  { img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80", views: "980k", boosted: false, stack: false, music: true },
  { img: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&q=80", views: "3.4M", boosted: false, stack: true, music: true },
];

const SMALL_BANNERS: { title: string; sub: string }[] = [
  { title: "How to Earn", sub: "A detailed guide" },
  { title: "Exchange", sub: "See for Wave" },
  { title: "Up to $15", sub: "per friend" },
  { title: "Rewards", sub: "for tasks" },
  { title: "Free", sub: "video promotion" },
  { title: "Withdraw", sub: "to a card or wallet" },
];

const HOTS: { icon: "chat-2-fill" | "list-fill" | "heart-fill" | "hearts" | "wallet-fill"; label: string; targetFlow: string }[] = [
  { icon: "chat-2-fill", label: "Chats", targetFlow: "chats" },
  { icon: "list-fill", label: "My tasks", targetFlow: "tasks" },
  { icon: "heart-fill", label: "Activity", targetFlow: "activity" },
  { icon: "hearts", label: "Dating", targetFlow: "dating" },
  { icon: "wallet-fill", label: "Wallet", targetFlow: "wallet" },
];

export default function ProfileDefault() {
  const insets = useSafeAreaInsets();
  const [who, setWho] = useState<"mine" | "other">("mine");
  const [mineMode, setMineMode] = useState<MineMode>("filled");
  const [otherMode, setOtherMode] = useState<OtherMode>("videos");
  const [following, setFollowing] = useState(false);
  const [moreSheet, setMoreSheet] = useState(false);
  const [badgeSheet, setBadgeSheet] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);

  function flash(msg: string) {
    setSnack(msg);
    setTimeout(() => setSnack(null), 2200);
  }

  const isMine = who === "mine";
  const showGrid = isMine && mineMode === "filled";
  const showEmpty = isMine && mineMode === "empty";

  return (
    <View style={{ flex: 1, backgroundColor: "#080A0B" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 118 + insets.bottom }}>
        {Platform.OS === "web" && <StatusBar />}

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16 }}>
          {isMine ? (
            <View style={{ flexDirection: "row", alignItems: "center", height: 44, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 4 }}>
              <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "800", fontSize: 13, letterSpacing: 1, paddingLeft: 12 }}>ALPHA</Text>
              <View style={{ height: 36, paddingHorizontal: 14, borderRadius: 100, backgroundColor: showGrid ? "#080A0B" : "white", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: showGrid ? "white" : "#080A0B", fontFamily: "Montserrat", fontWeight: "800", fontSize: 12, letterSpacing: 0.5 }}>{showGrid ? "ON" : "OFF"}</Text>
              </View>
            </View>
          ) : (
            <View />
          )}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable onPress={() => soon("Wallet", "wallet")} style={{ width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)" }}>
              <Icon name="arrowshape-right-dollar-outline" size={20} color="white" />
            </Pressable>
            <Pressable
              onPress={() => { if (!isMine) setMoreSheet(true); else soon("Settings", "settings"); }}
              style={{ width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Icon name="horizontal-3-lines" size={14} color="white" />
            </Pressable>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 2, paddingHorizontal: 20, paddingTop: 16 }}>
          <Pressable onPress={() => { if (isMine) router.push("/profile-edit"); }} style={{ width: 90, height: 90, borderRadius: 24, overflow: "hidden", backgroundColor: "#212323" }}>
            {showEmpty ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Icon name="human2-outline" size={36} color="rgb(185,185,185)" />
              </View>
            ) : (
              <Image source={{ uri: isMine ? "https://i.pravatar.cc/240?img=5" : "https://i.pravatar.cc/240?img=60" }} style={{ width: "100%", height: "100%" }} />
            )}
          </Pressable>
          <View style={{ gap: 2, paddingTop: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={[typography.bodyBasicBold, { color: "white" }]}>{isMine ? "konstantin" : "Marcus Vale"}</Text>
              <Pressable onPress={() => { if (isMine) setBadgeSheet(true); }}>
                <Icon name="tick-figure-fill" size={20} color={showGrid || !isMine ? "#31F1F0" : "rgb(185,185,185)"} />
              </Pressable>
            </View>
            <Text style={[typography.bodyBasicRegular, { color: "white" }]}>{isMine ? "@Konstantin.dzu" : "@marcus.vale"}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 20, paddingTop: 6 }}>
          <Text style={[typography.bodyBasicRegular, { color: "rgb(185,185,185)" }]}>
            Gender: <Text style={{ color: "white", fontWeight: "700" }}>Non-binary</Text>
          </Text>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: "rgb(90,90,90)" }} />
          <Text style={[typography.bodyBasicRegular, { color: "rgb(185,185,185)" }]}>
            Location: <Text style={{ color: "white", fontWeight: "700" }}>London</Text>
          </Text>
        </View>

        <View style={{ marginTop: 16, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: "rgba(255,255,255,0.06)", paddingTop: 10 }}>
          <View style={{ alignItems: "center", paddingVertical: 6 }}>
            <View style={{ width: 64, height: 3, borderRadius: 100, backgroundColor: "rgb(185,185,185)" }} />
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={[typography.bodyBasicBold, { color: "white" }]}>{isMine ? "19.2M" : "4.2M"}</Text>
              <Text style={[typography.captionRegular, { color: "rgb(185,185,185)", textTransform: "uppercase" }]}>Likes</Text>
            </View>
            <Pressable onPress={() => router.push({ pathname: "/profile-followers", params: { tab: "followers" } })} style={{ flex: 1, alignItems: "center" }}>
              <Text style={[typography.bodyBasicBold, { color: "white" }]}>{isMine ? "19.2M" : "892k"}</Text>
              <Text style={[typography.captionRegular, { color: "rgb(185,185,185)", textTransform: "uppercase" }]}>Followers</Text>
            </Pressable>
            <Pressable onPress={() => router.push({ pathname: "/profile-followers", params: { tab: "following" } })} style={{ flex: 1, alignItems: "center" }}>
              <Text style={[typography.bodyBasicBold, { color: "white" }]}>{isMine ? "11.4M" : "214"}</Text>
              <Text style={[typography.captionRegular, { color: "rgb(185,185,185)", textTransform: "uppercase" }]}>Following</Text>
            </Pressable>
          </View>

          {isMine ? (
            <>
              {showGrid ? (
                <View style={{ paddingHorizontal: 20, paddingTop: 10, gap: 2 }}>
                  <Text numberOfLines={1} style={[typography.bodyBasicRegular, { color: "white", textAlign: "center" }]}>I'm someone who values ambition an…</Text>
                  <Text numberOfLines={1} style={[typography.bodyBasicRegular, { color: "#FD4B03", textAlign: "center" }]}>instagram.com/luna.pixelwave/</Text>
                </View>
              ) : (
                <Text style={[typography.bodyBasicRegular, { color: "rgb(185,185,185)", textAlign: "center", paddingHorizontal: 20, paddingTop: 10 }]}>
                  Share a little about yourself
                </Text>
              )}

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 4, paddingHorizontal: 20, paddingTop: 10 }}>
                {HOTS.map((h) => (
                  <Pressable key={h.label} onPress={() => soon(h.label, h.targetFlow)} style={{ width: 77, height: 64, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <Icon name={h.icon} size={22} color="white" />
                    <Text style={[typography.captionRegular, { color: "white" }]}>{h.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
                <Pressable onPress={() => router.push("/profile-edit")} style={{ height: 40, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.06)", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#FD4B03", fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, letterSpacing: 0.72, textTransform: "uppercase" }}>Edit my profile</Text>
                </Pressable>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingTop: 10 }}>
                {SMALL_BANNERS.map((b) => (
                  <Pressable key={b.title} onPress={() => soon("Open " + b.title, "banner-" + b.title.toLowerCase().replace(/\s+/g, "-"))} style={{ width: 150, height: 82, borderRadius: 24, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.10)", padding: 16, justifyContent: "flex-start" }}>
                    <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 16, lineHeight: 20 }}>{b.title}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Montserrat", fontWeight: "500", fontSize: 13, lineHeight: 16 }}>{b.sub}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              {showGrid ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                  {VIDEOS.map((v, i) => (
                    <Pressable key={i} onPress={() => (v.boosted ? soon("Make video viral", "video-boost-editing") : soon("Play video", "video-player"))} style={{ width: "33.3%", aspectRatio: 2 / 3, padding: 0.75 }}>
                      <View style={{ flex: 1, borderRadius: 8, overflow: "hidden", backgroundColor: "#101314" }}>
                        <Image source={{ uri: v.img }} style={{ width: "100%", height: "100%" }} />
                        {v.boosted ? (
                          <View style={{ position: "absolute", left: 0, top: 0, height: 18, flexDirection: "row", alignItems: "center", gap: 2, paddingLeft: 4, paddingRight: 8, borderBottomRightRadius: 16, backgroundColor: "#FD4B03" }}>
                            <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 10 }}>Boosted</Text>
                            <Icon name="star-fill" size={12} color="white" />
                          </View>
                        ) : null}
                        {v.stack ? (
                          <View style={{ position: "absolute", right: 4, top: 4 }}>
                            <Icon name="stack-fill" size={18} color="white" />
                          </View>
                        ) : null}
                        <View style={{ position: "absolute", left: 4, right: 4, bottom: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                            <Icon name="triangle-fill" size={14} color="white" />
                            <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "500", fontSize: 12 }}>{v.views}</Text>
                          </View>
                          {v.music ? <Icon name="note-star" size={18} color="white" /> : null}
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={{ margin: 16, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.10)", padding: 20, alignItems: "center", gap: 20 }}>
                  <Icon name="gift-outline" size={72} color="rgba(255,255,255,0.4)" />
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ height: 32, paddingHorizontal: 12, borderRadius: 100, backgroundColor: "rgba(49,241,240,0.5)", alignItems: "center", justifyContent: "center" }}>
                      <Text style={[typography.title, { color: "white" }]}>Free</Text>
                    </View>
                    <Text style={[typography.bodyLargeRegular, { color: "rgb(185,185,185)" }]}>instead of $10.0</Text>
                  </View>
                  <Text style={[typography.title, { color: "white", textAlign: "center" }]}>Upload your first video and get promotion</Text>
                  <View style={{ width: "100%" }}>
                    <Button variant="primary" tone="level1" size="l" onPress={() => flash("Camera isn't available yet")}>
                      Upload video
                    </Button>
                  </View>
                </View>
              )}
            </>
          ) : (
            <>
              {otherMode !== "blocked" ? (
                <View style={{ paddingHorizontal: 20, paddingTop: 10, gap: 2 }}>
                  <Text numberOfLines={1} style={[typography.bodyBasicRegular, { color: "white", textAlign: "center" }]}>Filmmaker &amp; storyteller based in London</Text>
                  <Text numberOfLines={1} style={[typography.bodyBasicRegular, { color: "#FD4B03", textAlign: "center" }]}>instagram.com/marcus.vale</Text>
                </View>
              ) : null}

              {otherMode !== "blocked" ? (
                <View style={{ flexDirection: "row", gap: 14, paddingHorizontal: 20, paddingTop: 14 }}>
                  <Pressable
                    onPress={() => { setFollowing((f) => !f); flash(following ? "Unfollowed" : "Following Marcus"); }}
                    style={{ flex: 1, height: 40, borderRadius: 100, alignItems: "center", justifyContent: "center", backgroundColor: following ? "rgba(255,255,255,0.15)" : "white" }}
                  >
                    <Text style={{ color: following ? "#FD4B03" : "#080A0B", fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, letterSpacing: 0.72, textTransform: "uppercase" }}>
                      {following ? "Unfollow" : "Follow"}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => soon("Message", "messages")}
                    style={{ flex: 1, height: 40, borderRadius: 100, alignItems: "center", justifyContent: "center", backgroundColor: following ? "white" : "rgba(255,255,255,0.15)" }}
                  >
                    <Text style={{ color: following ? "#080A0B" : "#FD4B03", fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, letterSpacing: 0.72, textTransform: "uppercase" }}>Message</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
                  <Pressable
                    onPress={() => { setOtherMode("videos"); flash("User unblocked"); }}
                    style={{ height: 48, borderRadius: 100, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 14, letterSpacing: 0.72, textTransform: "uppercase" }}>Unblock</Text>
                  </Pressable>
                </View>
              )}

              {otherMode === "empty" ? (
                <View style={{ alignItems: "center", paddingTop: 90, gap: 4 }}>
                  <Text style={[typography.bodyBasicBold, { color: "white" }]}>It's quiet here… for now</Text>
                  <Text style={[typography.captionRegular, { color: "rgb(185,185,185)" }]}>Still warming up — stay tuned!</Text>
                </View>
              ) : (
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                  {VIDEOS.map((v, i) => (
                    <Pressable key={i} onPress={() => { if (otherMode !== "blocked") soon("Play video", "video-player"); }} style={{ width: "33.3%", aspectRatio: 2 / 3, padding: 0.75 }}>
                      <View style={{ flex: 1, borderRadius: 8, overflow: "hidden", backgroundColor: otherMode === "blocked" ? "#212323" : "#101314" }}>
                        {otherMode !== "blocked" && <Image source={{ uri: v.img }} style={{ width: "100%", height: "100%" }} />}
                        <View style={{ position: "absolute", left: 4, bottom: 6, flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <Icon name="triangle-fill" size={14} color="white" />
                          <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "500", fontSize: 12 }}>{v.views}</Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <View style={{ position: "absolute", top: insets.top + 6, right: 10 }}>
        <DevMenu
          sectionLabel="Profile"
          entries={[
            { label: "My profile — filled", onSelect: () => { setWho("mine"); setMineMode("filled"); } },
            { label: "My profile — empty", onSelect: () => { setWho("mine"); setMineMode("empty"); } },
            { label: "Other — with videos", onSelect: () => { setWho("other"); setOtherMode("videos"); } },
            { label: "Other — empty", onSelect: () => { setWho("other"); setOtherMode("empty"); } },
            { label: "Other — blocked", onSelect: () => { setWho("other"); setOtherMode("blocked"); } },
          ]}
        />
      </View>

      {snack ? (
        <View style={{ position: "absolute", left: 16, right: 16, bottom: 96 + insets.bottom }}>
          <Snackbar message={snack} />
        </View>
      ) : null}

      <BottomSheet open={moreSheet} onClose={() => setMoreSheet(false)} draggable>
        <View style={{ paddingHorizontal: 8, paddingBottom: 8 }}>
          <Cell leftSlot={<Icon name="exclamation-bubble-outline" size={24} color="white" />} label="Report" onPress={() => { setMoreSheet(false); flash("Report submitted"); }} />
          <Cell leftSlot={<Icon name="cross-circle-outline" size={24} color="white" />} label="Block" onPress={() => { setMoreSheet(false); setOtherMode("blocked"); flash("User blocked"); }} />
          <Cell leftSlot={<Icon name="arrowshape-right-outline" size={24} color="white" />} label="Share profile" onPress={() => { setMoreSheet(false); soon("Share profile", "share-sheet"); }} />
        </View>
      </BottomSheet>

      <BottomSheet open={badgeSheet} onClose={() => setBadgeSheet(false)} draggable>
        <View style={{ paddingHorizontal: 16, paddingBottom: 8, alignItems: "center", gap: 20 }}>
          <Icon name="tick-figure-fill" size={68} color={showGrid ? "#31F1F0" : "rgb(185,185,185)"} />
          <View style={{ gap: 10, alignItems: "center", width: 300 }}>
            <Text style={[typography.headline, { color: "white", textAlign: "center" }]}>
              {showGrid ? "The checkmark hits different, isn't it?" : "Verified badge\nmakes you real"}
            </Text>
            <Text style={[typography.bodyParagraphRegular, { color: "white", textAlign: "center" }]}>
              {showGrid
                ? "Wear it. Post with it. Make them jealous. Valid until Sep 27, 2025."
                : "Show you're the real deal when posting and messaging others."}
            </Text>
          </View>
          <View style={{ width: "100%" }}>
            <Button variant="primary" tone="level1" size="l" onPress={() => setBadgeSheet(false)}>
              {showGrid ? "Got it, cool" : "Become verified"}
            </Button>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}
