import { useEffect, useRef, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View, useWindowDimensions, type NativeSyntheticEvent, type NativeScrollEvent } from "react-native";
import { AccessibilityInfo } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import { Icon } from "@/design/icons/Icon";
import { Coin } from "@/design/coins/Coin";
import { Button } from "@/components/primitives/button/Button";
import { TabBar } from "@/components/patterns/tab-bar/TabBar";
import { StatusBar } from "@/components/patterns/status-bar/StatusBar";
import { BottomSheet } from "@/components/patterns/bottom-sheet/BottomSheet";
import { Snackbar } from "@/components/patterns/snack/Snackbar";
import { StatusPanel } from "@/components/patterns/status-panel/StatusPanel";
import { Cell } from "@/components/patterns/cell/Cell";
import { LiveBadge } from "@/components/features/feed/LiveBadge";
import { DonationChip } from "@/components/features/feed/DonationChip";
import { FeedLeftEarn } from "@/components/features/feed/FeedLeftEarn";
import { FeedWtf } from "@/components/features/feed/FeedWtf";
import { FeedCarouselItem } from "@/components/features/feed/FeedCarouselItem";
import { FeedUsername } from "@/components/features/feed/FeedUsername";
import { FeedRightBar } from "@/components/features/feed/FeedRightBar";
import { CommentsSheet } from "@/components/features/feed/CommentsSheet";
import { FeedSwipeHint } from "@/components/features/feed/FeedSwipeHint";
import type { IconName } from "@/design/icons/Icon";

const topBackground = require("@/components/features/feed/assets/comments-top-background.png");
const VIDEO_P1 = require("../../assets/videos/16183412_720_1280_30fps.mp4");
const VIDEO_P2 = require("../../assets/videos/15980421-hd_720_1280_30fps.mp4");
const VIDEO_P3 = require("../../assets/videos/8347677-sd_506_960_30fps.mp4");

/*
  Ported from starter/src/screens/FeedDefault.tsx (extracted from Claude
  Design "Pulse app React development" project -> PulseFeed.dc.html): a
  real swipeable (paged FlatList) multi-post feed, working like/follow/
  donate/comment/share/more actions, bottom sheets, and a snackbar. All
  interaction logic is re-implemented natively (React state), matching
  the web version's own re-implementation policy.

  Post video playback uses expo-video's useVideoPlayer/VideoView instead
  of the web's <video loop muted playsInline autoPlay>; paging uses a
  vertical FlatList with pagingEnabled instead of CSS scroll-snap.

  The web version's once-per-user "swipe hint seen" gate used
  localStorage; RN has no equivalent without adding a storage dependency,
  so a module-level flag is used instead — same graceful-degradation
  the web version already accepted for private-mode/no-storage (replays
  every load), just always-on here since it resets per app launch.
*/
let swipeHintSeenThisSession = false;

/** Dev-only: lets FeedStateOnboarding force the first-run coach-mark to replay. */
export function resetSwipeHintSeen() {
  swipeHintSeenThisSession = false;
}

type Post = {
  id: string;
  username: string;
  video?: number;
  image: string;
  avatar: string;
  musicCover: string;
  caption: string;
  liked: boolean;
  followed: boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
};

const INITIAL_POSTS: Post[] = [
  {
    id: "p1",
    username: "lunaflux",
    video: VIDEO_P1,
    image: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=800&q=80",
    avatar: "https://i.pravatar.cc/160?img=15",
    musicCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100",
    caption: "Golden hour on the rooftop — who's coming next time?",
    liked: false,
    followed: false,
    likeCount: 21600,
    commentCount: 1500,
    shareCount: 8100,
  },
  {
    id: "p2",
    username: "kaimraz",
    video: VIDEO_P2,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    avatar: "https://i.pravatar.cc/160?img=32",
    musicCover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100",
    caption: "Late-night footwork session. Turn it up.",
    liked: false,
    followed: false,
    likeCount: 94200,
    commentCount: 3200,
    shareCount: 12000,
  },
  {
    id: "p3",
    username: "noirwave",
    video: VIDEO_P3,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    avatar: "https://i.pravatar.cc/160?img=47",
    musicCover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100",
    caption: "New track drops midnight. This is the intro.",
    liked: false,
    followed: false,
    likeCount: 512000,
    commentCount: 8700,
    shareCount: 45000,
  },
];

const CAROUSEL_TABS = [
  { key: "For you", label: "For you", icon: false },
  { key: "Discovery", label: "Discovery", icon: false },
  { key: "Dating", label: "Dating", icon: true },
];

const DONATION_AMOUNTS = [0.1, 0.25, 0.5, 1, 5, 10, 25];

function formatCount(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

type Sheet = { type: "donate"; index: number; amount: number } | { type: "comments"; index: number } | { type: "more"; index: number } | null;
type FeedState = "default" | "empty" | "error";

export type FeedDefaultProps = {
  /** Seeds the Empty/Error state for dev previews — the screen is still fully interactive afterward (Refresh/Try again work normally). Defaults to the real "default" state. */
  initialFeedState?: FeedState;
};

function FeedPostMedia({ post, height }: { post: Post; height: number }) {
  const player = useVideoPlayer(post.video ?? null, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  return (
    <View style={{ width: "100%", height, backgroundColor: "#101314", overflow: "hidden" }}>
      <Image source={{ uri: post.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      {post.video && <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />}
    </View>
  );
}

export default function FeedDefault({ initialFeedState = "default" }: FeedDefaultProps) {
  const { height: windowHeight } = useWindowDimensions();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFeedTab, setActiveFeedTab] = useState("For you");
  const [tab, setTab] = useState("feed");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [snack, setSnack] = useState<string | null>(null);
  const [feedState, setFeedState] = useState<FeedState>(initialFeedState);
  const [swipeHintVisible, setSwipeHintVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const snackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const sheetRef = useRef<Sheet>(null);
  useEffect(() => { sheetRef.current = sheet; }, [sheet]);
  const feedStateRef = useRef<FeedState>("default");
  useEffect(() => { feedStateRef.current = feedState; }, [feedState]);

  function flash(message: string) {
    setSnack(message);
    clearTimeout(snackTimer.current);
    snackTimer.current = setTimeout(() => setSnack(null), 2600);
  }
  useEffect(() => () => clearTimeout(snackTimer.current), []);

  function updatePost(i: number, patch: Partial<Post> | ((p: Post) => Partial<Post>)) {
    setPosts((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...(typeof patch === "function" ? patch(p) : patch) } : p)));
  }

  function toggleLike(i: number) {
    updatePost(i, (p) => ({ liked: !p.liked, likeCount: p.likeCount + (p.liked ? -1 : 1) }));
  }
  function toggleFollow(i: number) {
    const p = posts[i];
    updatePost(i, { followed: !p.followed });
    if (!p.followed) flash("Following @" + p.username);
  }

  function onMomentumScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.max(0, Math.min(posts.length - 1, Math.round(e.nativeEvent.contentOffset.y / windowHeight)));
    setCurrentIndex((prev) => (prev === idx ? prev : idx));
  }

  const active = posts[currentIndex];
  const sheetPost = sheet ? posts[sheet.index] : null;
  const donateAmount = sheet?.type === "donate" ? sheet.amount : 0;

  function confirmDonate() {
    if (sheet?.type !== "donate" || !sheetPost) return;
    flash("Sent " + sheet.amount + " See to @" + sheetPost.username);
    setSheet(null);
  }
  const moreActions: { icon: IconName; label: string; color: string; onClick: () => void }[] = [
    { icon: "crossed-circle", label: "Not interested", color: "#ffffff", onClick: () => { setSheet(null); flash("We'll show fewer like this"); } },
    { icon: "exclamation-bubble-outline", label: "Report", color: "#ffffff", onClick: () => { setSheet(null); flash("Report submitted"); } },
    { icon: "human-outline", label: "Block", color: "#ffffff", onClick: () => { setSheet(null); flash("User blocked"); } },
    { icon: "heart-outline", label: "Liked by", color: "#ffffff", onClick: () => { setSheet(null); flash("42 people liked this"); } },
  ];

  // ---- First-run swipe-up coach-mark (FeedSwipeHint host wiring) ----
  const swipeShownRef = useRef(false);
  const swipeSuppressedRef = useRef(false);
  const swipeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const swipeCapRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function teardownSwipeHint() {
    clearTimeout(swipeTimerRef.current);
    clearTimeout(swipeCapRef.current);
    if (swipeShownRef.current) {
      swipeHintSeenThisSession = true;
      swipeShownRef.current = false;
      setSwipeHintVisible(false);
    }
  }
  function onRealInteraction() {
    if (swipeShownRef.current) {
      teardownSwipeHint();
    } else {
      swipeSuppressedRef.current = true;
      clearTimeout(swipeTimerRef.current);
    }
  }
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReducedMotion).catch(() => {});
    if (swipeHintSeenThisSession) return;
    swipeTimerRef.current = setTimeout(() => {
      if (swipeSuppressedRef.current) return;
      if (sheetRef.current || feedStateRef.current !== "default") return;
      swipeShownRef.current = true;
      setSwipeHintVisible(true);
      const done = reducedMotion ? 2600 : 1800 * 3 + 250;
      swipeCapRef.current = setTimeout(() => teardownSwipeHint(), done);
    }, 1500);
    return () => {
      clearTimeout(swipeTimerRef.current);
      clearTimeout(swipeCapRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#101314" }}>
      {feedState === "default" && (
        <>
          <FlatList
            data={posts}
            keyExtractor={(p) => p.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={onRealInteraction}
            onMomentumScrollEnd={onMomentumScrollEnd}
            renderItem={({ item }) => <FeedPostMedia post={item} height={windowHeight} />}
            style={StyleSheet.absoluteFill}
          />

          {swipeHintVisible && (
            <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: "49%", zIndex: 40, alignItems: "center" }}>
              <FeedSwipeHint label="" travel={56} reducedMotion={reducedMotion} />
              <Text style={{ marginTop: 12, color: "white", fontSize: 13, fontWeight: "700", textShadowColor: "rgba(0,0,0,0.6)", textShadowRadius: 6 }}>
                Swipe up for more
              </Text>
            </View>
          )}
        </>
      )}

      {feedState !== "default" && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, backgroundColor: "rgb(33,35,35)" }}>
          <StatusPanel
            icon={<Icon name="exclamation-bubble-outline" size={40} color="white" />}
            title={feedState === "error" ? "Something went wrong" : "Your feed is empty"}
            description={feedState === "error" ? "We couldn't load your feed. Please try again." : undefined}
            actionLabel={feedState === "error" ? "Try again" : "Refresh"}
            onAction={() => setFeedState("default")}
          />
        </View>
      )}

      {/* Top chrome overlay — status bar / carousel tabs / search stay up regardless of feed state */}
      <View pointerEvents="box-none" style={{ position: "absolute", left: 0, top: 0, width: "100%", zIndex: 10 }}>
        <LinearGradient colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ width: "100%", gap: 8 }}>
          <StatusBar />
          <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
            <View style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
              <LiveBadge size={24} />
            </View>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 }}>
              {CAROUSEL_TABS.map((t) => (
                <FeedCarouselItem key={t.key} label={t.label} icon={t.icon} selected={activeFeedTab === t.key} onClick={() => setActiveFeedTab(t.key)} />
              ))}
            </View>
            <View style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
              <Icon name="magnifying-glass" size={24} color="white" />
            </View>
          </View>
          {feedState === "default" && (
            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
              <FeedLeftEarn />
              <FeedWtf />
            </View>
          )}
        </LinearGradient>
      </View>

      {feedState === "default" && (
        <View pointerEvents="box-none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 10 }}>
          <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.55)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ width: "100%", gap: 14, paddingBottom: 118 }}>
            <View style={{ width: "100%", flexDirection: "row", alignItems: "flex-end", gap: 16, paddingLeft: 16, paddingRight: 10 }}>
              <View style={{ flex: 1, minWidth: 0, gap: 8, alignItems: "flex-start" }}>
                <FeedUsername username={active.username} />
                <Text numberOfLines={1} style={{ width: "100%", color: "white", fontSize: 13, textShadowColor: "rgba(0,0,0,0.4)", textShadowRadius: 2 }}>
                  {active.caption}
                </Text>
              </View>

              <FeedRightBar
                avatarSrc={active.avatar}
                followed={active.followed}
                onFollow={() => toggleFollow(currentIndex)}
                likeCount={formatCount(active.likeCount)}
                liked={active.liked}
                likeColor={active.liked ? "#FD0058" : "white"}
                onLike={() => toggleLike(currentIndex)}
                commentCount={formatCount(active.commentCount)}
                onComment={() => setSheet({ type: "comments", index: currentIndex })}
                shareCount={formatCount(active.shareCount)}
                onShare={() => flash("Link copied to clipboard")}
                onMore={() => setSheet({ type: "more", index: currentIndex })}
                musicCoverSrc={active.musicCover}
              />
            </View>

            <FlatList
              data={DONATION_AMOUNTS}
              keyExtractor={(v) => String(v)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingLeft: 16, paddingRight: 60 }}
              renderItem={({ item: v, index: k }) => (
                <DonationChip
                  label={k === 0 ? "Donate " + v : String(v)}
                  bordered={k === 0}
                  onClick={() => setSheet({ type: "donate", index: currentIndex, amount: v })}
                />
              )}
            />
          </LinearGradient>
        </View>
      )}

      {snack && (
        <View style={{ position: "absolute", left: 16, right: 16, bottom: 112, zIndex: 40 }}>
          <Snackbar message={snack} />
        </View>
      )}

      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 30 }}>
        <TabBar active={tab} onChange={setTab} labels={{ feed: "Watch", earn: "Balance" }} />
      </View>

      {/* Donate confirm sheet — amount already chosen via the chip that opened it; this is confirm-only */}
      <BottomSheet
        open={sheet?.type === "donate"}
        onClose={() => setSheet(null)}
        topOverlay={<Image source={topBackground} style={{ width: "100%", height: "100%" }} resizeMode="cover" />}
        draggable
      >
        {sheetPost && (
          <View style={{ paddingHorizontal: 20, paddingVertical: 24, alignItems: "center", gap: 24 }}>
            <View style={{ alignItems: "center", gap: 20, width: 248 }}>
              <View style={{ width: 120, height: 120, alignItems: "center", justifyContent: "center" }}>
                <Coin name="see" size={72.6} />
              </View>
              <View style={{ alignItems: "center", gap: 10, width: 248 }}>
                <Text style={{ color: "white", fontSize: 20, fontWeight: "700", textAlign: "center" }}>
                  Donate {donateAmount} SEE?
                </Text>
                <Text style={{ color: "white", fontSize: 14, textAlign: "center", width: 248 }}>
                  This amount will be deducted from your internal wallet.
                </Text>
              </View>
            </View>
            <View style={{ width: 248 }}>
              <Button variant="primary" tone="level1" size="l" onPress={confirmDonate}>
                Send donation
              </Button>
            </View>
          </View>
        )}
      </BottomSheet>

      {/* Comments sheet — self-contained (own drag-to-dismiss, own seeded comment store per post) */}
      <CommentsSheet open={sheet?.type === "comments"} postKey={sheetPost?.id ?? "default"} onClose={() => setSheet(null)} />

      {/* More actions sheet — rows built from the shared Cell pattern */}
      <BottomSheet
        open={sheet?.type === "more"}
        onClose={() => setSheet(null)}
        topOverlay={<Image source={topBackground} style={{ width: "100%", height: "100%" }} resizeMode="cover" />}
        draggable
      >
        <View style={{ paddingHorizontal: 8, paddingTop: 4, paddingBottom: 8 }}>
          {moreActions.map((a) => (
            <Cell key={a.label} leftSlot={<Icon name={a.icon} size={24} color={a.color} />} label={a.label} onPress={a.onClick} />
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}
