import { useEffect, useRef, useState } from "react";
import { FlatList, Image, Pressable, Text, TextInput, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@/design/icons/Icon";
import { naturalGlyphSize } from "@/design/icons/naturalSize";
import type { IconName } from "@/design/icons/icon-registry";
import { typography } from "@/design/theme";

const topBackground = require("./assets/comments-top-background.png");

/*
  Ported from starter/src/components/features/feed/CommentsSheet.tsx
  (extracted from Claude Design "Pulse app React development" project ->
  Comments.js, built from Figma "Comments.fig"). Self-contained: comment
  data is NOT fed from the parent post — each post gets its own seeded
  20-comment list keyed by `postKey`, matching the source exactly.

  Interaction ported with Gesture.Pan(): swipe-left on a row reveals
  Reply/Report (everyone's comments) plus Edit/Delete (your own,
  "mine"), drag-down on the sheet header dismisses past a 140px
  threshold, and the composer's Send button enables only once text is
  non-empty.
*/
const ACCENT_ORANGE_START = "#FD4B03";
const ACCENT_ORANGE_END = "#FF9800";
const LIKED_COLOR = "#FD0058";
const EMOJIS = ["\u{1F389}", "\u{1F91F}", "\u{1F618}", "❤️", "\u{1F525}", "\u{1F60D}", "\u{1F4AF}", "\u{1F622}"];

function CommentLikeGlyph({ liked, size = 20 }: { liked: boolean; size?: number }) {
  const name: IconName = liked ? "feed-like-tapped" : "feed-like";
  const { width, height } = naturalGlyphSize(name, size);
  return <Icon name={name} size={Math.max(width, height)} color={liked ? LIKED_COLOR : "white"} />;
}

type Comment = { id: string; user: string; avatar: string; time: string; likes: number; text: string; liked: boolean; mine: boolean };

const SEED: { u: string; a: number; t: string; l: number; x: string }[] = [
  { u: "lunaflux", a: 15, t: "2d", l: 214, x: "This view is unreal \u{1F525} take me next time" },
  { u: "kaimraz", a: 32, t: "2d", l: 88, x: "the light here is perfect \u{1F60D}" },
  { u: "noirwave", a: 47, t: "1d", l: 51, x: "Save me a spot \u{1F64F}" },
  { u: "mila.k", a: 5, t: "1d", l: 1200, x: "ok but the color grade \u{1F440}✨" },
  { u: "dexonair", a: 60, t: "1d", l: 9, x: "tutorial when?? \u{1F62D}" },
  { u: "sol_ryu", a: 12, t: "23h", l: 340, x: "goosebumps fr \u{1F976}\u{1F525}" },
  { u: "avapaints", a: 24, t: "22h", l: 17, x: "the transition at 0:12 \u{1F62E}" },
  { u: "juno.wav", a: 8, t: "20h", l: 76, x: "adding this to my playlist rn \u{1F3A7}" },
  { u: "theo.mp4", a: 51, t: "18h", l: 402, x: "how is this only 8 seconds \u{1F4AF}" },
  { u: "riverbend", a: 3, t: "16h", l: 5, x: "pure vibes ✨\u{1F30A}" },
  { u: "nova_lee", a: 41, t: "14h", l: 61, x: "sending this to everyone i know ❤️" },
  { u: "kobe.exe", a: 33, t: "12h", l: 28, x: "certified banger \u{1F3C6}" },
  { u: "mareen", a: 9, t: "10h", l: 133, x: "why am i crying at a video \u{1F622}" },
  { u: "phoenixd", a: 18, t: "9h", l: 44, x: "the drop \u{1F50A}\u{1F525}\u{1F525}" },
  { u: "ines.b", a: 27, t: "7h", l: 12, x: "aesthetic overload \u{1F60D}✨" },
  { u: "grayson", a: 56, t: "6h", l: 8, x: "instant follow \u{1F91D}" },
  { u: "wildkat", a: 20, t: "5h", l: 210, x: "10/10 no notes \u{1F4AF}" },
  { u: "orin.fm", a: 45, t: "3h", l: 3, x: "on repeat since morning \u{1F501}" },
  { u: "petra_v", a: 14, t: "2h", l: 67, x: "the energy is immaculate \u{1F91F}" },
  { u: "z.aki", a: 38, t: "1h", l: 1, x: "first \u{1F947} love this" },
];

function seedComments(): Comment[] {
  return SEED.map((c, i) => ({ id: "s" + i, user: c.u, avatar: "https://i.pravatar.cc/80?img=" + c.a, time: c.t, likes: c.l, text: c.x, liked: false, mine: false }));
}

function formatLikes(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

function ActionCell({ bg, icon, onPress }: { bg: string; icon: IconName; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ width: 44, alignSelf: "stretch", backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={24} color="white" />
    </Pressable>
  );
}

function CommentRow({ c, onLike, onDelete, onEdit, onReply, onFlash }: {
  c: Comment;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (c: Comment) => void;
  onReply: (c: Comment) => void;
  onFlash: (message: string) => void;
}) {
  const actionsWidth = c.mine ? 176 : 88;
  const dx = useSharedValue(0);
  const base = useSharedValue(0);
  const [revealWidth, setRevealWidth] = useState(0);

  function syncReveal(v: number) {
    setRevealWidth(Math.max(0, Math.round(-v)));
  }

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onStart(() => { base.value = dx.value; })
    .onUpdate((e) => {
      dx.value = Math.max(-actionsWidth, Math.min(0, base.value + e.translationX));
      runOnJS(syncReveal)(dx.value);
    })
    .onEnd(() => {
      const next = dx.value < -actionsWidth / 2 ? -actionsWidth : 0;
      dx.value = withTiming(next, { duration: 250 });
      runOnJS(syncReveal)(next);
    });

  const rowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: dx.value }] }));

  function closeThen(fn: () => void) {
    dx.value = withTiming(0, { duration: 250 });
    setRevealWidth(0);
    fn();
  }

  return (
    <View style={{ overflow: "hidden" }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "rgb(8,10,11)" }, rowStyle]}>
          <Image source={{ uri: c.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", gap: 6 }}>
              <Text style={[typography.bodyBasicBold, { color: "white" }]}>{c.user}</Text>
              <Text style={[typography.bodyBasicRegular, { color: "white" }]}>{c.text}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
              <Text style={[typography.captionRegular, { color: "rgba(255,255,255,0.5)" }]}>{c.time}</Text>
              <Text style={[typography.captionRegular, { color: "rgba(255,255,255,0.5)" }]}>{formatLikes(c.likes)} likes</Text>
              <Text style={[typography.captionRegular, { color: "rgba(255,255,255,0.5)" }]}>Reply</Text>
            </View>
          </View>
          <Pressable onPress={() => onLike(c.id)} style={{ paddingTop: 2 }}>
            <CommentLikeGlyph liked={c.liked} />
          </Pressable>
        </Animated.View>
      </GestureDetector>
      {revealWidth > 0 && (
        <View style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: revealWidth, overflow: "hidden" }}>
          <View style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: actionsWidth, flexDirection: "row" }}>
            <ActionCell bg="rgb(0,204,155)" icon="arrowshape-right-outline" onPress={() => closeThen(() => onReply(c))} />
            <ActionCell bg="rgb(250,124,7)" icon="exclamation-bubble-outline" onPress={() => closeThen(() => onFlash("Comment reported"))} />
            {c.mine && (
              <>
                <ActionCell bg="rgb(113,86,251)" icon="pencil-outline" onPress={() => closeThen(() => onEdit(c))} />
                <ActionCell bg="rgb(230,21,21)" icon="bin-outline" onPress={() => onDelete(c.id)} />
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

export function CommentsSheet({ open, postKey, onClose }: { open: boolean; postKey: string; onClose: () => void }) {
  const [store, setStore] = useState<Record<string, Comment[]>>({});
  const [text, setText] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const dragY = useSharedValue(0);
  const sheetTranslate = useSharedValue(400);

  useEffect(() => {
    if (open) {
      dragY.value = 0;
      sheetTranslate.value = withTiming(0, { duration: 280 });
    } else {
      sheetTranslate.value = 400;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const grabGesture = Gesture.Pan()
    .onUpdate((e) => { dragY.value = Math.max(0, e.translationY); })
    .onEnd(() => {
      if (dragY.value > 140) {
        runOnJS(onClose)();
      } else {
        dragY.value = withTiming(0, { duration: 220 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslate.value + dragY.value }],
  }));

  if (!open) return null;
  const list = store[postKey] || seedComments();
  function setList(next: Comment[]) {
    setStore((s) => ({ ...s, [postKey]: next }));
  }

  function doFlash(message: string) {
    setFlash(message);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 1800);
  }
  function like(id: string) {
    setList(list.map((c) => (c.id === id ? { ...c, liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) } : c)));
  }
  function del(id: string) {
    setList(list.filter((c) => c.id !== id));
  }
  function edit(c: Comment) {
    setEditId(c.id);
    setText(c.text);
    inputRef.current?.focus();
  }
  function reply(c: Comment) {
    setEditId(null);
    setText("@" + c.user + " ");
    inputRef.current?.focus();
  }
  function send() {
    const v = text.trim();
    if (!v) return;
    if (editId) {
      setList(list.map((c) => (c.id === editId ? { ...c, text: v } : c)));
      setEditId(null);
    } else {
      setList([{ id: "me" + Date.now(), user: "you", avatar: "https://i.pravatar.cc/80?img=12", time: "now", likes: 0, text: v, liked: false, mine: true }, ...list]);
    }
    setText("");
  }

  const canSend = text.trim().length > 0;

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "flex-end" }}>
      <Pressable onPress={onClose} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)" }} />
      <Animated.View
        style={[
          { height: "84%", backgroundColor: "rgb(8,10,11)", borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: "hidden" },
          sheetStyle,
        ]}
      >
        <Image source={topBackground} style={{ position: "absolute", top: 0, left: 0, right: 0, height: 160 }} />

        <GestureDetector gesture={grabGesture}>
          <View style={{ alignItems: "center", gap: 8, paddingVertical: 10 }}>
            <View style={{ height: 4, width: 52, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.22)" }} />
            <Text style={[typography.bodyBasicBold, { color: "white" }]}>{list.length} comments</Text>
          </View>
        </GestureDetector>

        <FlatList
          data={list}
          keyExtractor={(c) => c.id}
          style={{ flex: 1 }}
          renderItem={({ item }) => (
            <CommentRow c={item} onLike={like} onDelete={del} onEdit={edit} onReply={reply} onFlash={doFlash} />
          )}
        />

        {flash ? (
          <View
            style={{
              position: "absolute",
              zIndex: 2,
              left: 16,
              right: 16,
              bottom: 150,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)",
              backgroundColor: "rgba(8,10,11,0.96)",
              paddingHorizontal: 14,
              paddingVertical: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 13, fontFamily: "Montserrat" }}>{flash}</Text>
          </View>
        ) : null}

        <View style={{ backgroundColor: "rgb(8,10,11)" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}>
            {EMOJIS.map((em, i) => (
              <Pressable key={i} onPress={() => setText((t) => t + em)}>
                <Text style={{ fontSize: 20, lineHeight: 20 }}>{em}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 12 }}>
            {editId ? <Text style={{ color: ACCENT_ORANGE_START, fontSize: 12, fontWeight: "600", fontFamily: "Montserrat" }}>Editing</Text> : null}
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              onSubmitEditing={send}
              placeholder="Add comment"
              placeholderTextColor="rgba(255,255,255,0.4)"
              returnKeyType="send"
              style={{ flex: 1, minWidth: 0, color: "white", fontSize: 14, fontWeight: "500", fontFamily: "Montserrat" }}
            />
            <Pressable onPress={canSend ? send : undefined} style={{ opacity: canSend ? 1 : 0.4 }} pointerEvents={canSend ? "auto" : "none"}>
              <LinearGradient
                colors={[ACCENT_ORANGE_START, ACCENT_ORANGE_END]}
                start={{ x: 0.1464, y: 0.1464 }}
                end={{ x: 0.8536, y: 0.8536 }}
                style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" }}
              >
                <Icon name="arrow-up" size={16} color="white" />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
