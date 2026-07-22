import { useMemo, useRef, useState } from "react";
import { Dimensions, ScrollView, Text, TextInput, View, type GestureResponderEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography } from "@/design/theme";
import { ChatHeader, useChatHeaderHeight } from "@/components/features/chats/ChatHeader";
import { ChatInput } from "@/components/features/chats/ChatInput";
import { MessageBubble } from "@/components/features/chats/MessageBubble";
import { ActionMenu, type MenuAction } from "@/components/features/chats/ActionMenu";
import { ChatToast, type ToastData } from "@/components/features/chats/ChatToast";
import { PEOPLE, avatarUri, baseThreads } from "@/components/features/chats/data";
import { isDivider, type Message, type MessageKind, type ThreadItem } from "@/components/features/chats/types";

/*
  Conversation thread (PulseeChats.dc.html). Message list, input bar,
  long-press action menu (reactions + reply/copy/edit/delete/complain),
  toasts, and blocked states. Report + paid sheets attach in the next
  milestones (complain currently no-ops the sheet open — wired then).
*/
type Blocked = "i" | "them" | null;
type MenuState = { rk: string; mine: boolean; kind: MessageKind; top: number; side: "left" | "right" } | null;

const SCREEN_H = Dimensions.get("window").height;

function hhmm() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function bubblePreview(m: Message): string {
  if (m.t === "voice") return "Voice message";
  if (m.t === "video") return "Video message";
  return m.x ?? "";
}

export default function ChatsThread() {
  const insets = useSafeAreaInsets();
  const headerHeight = useChatHeaderHeight();
  const { id, blocked: blockedParam } = useLocalSearchParams<{ id: string; blocked?: string }>();
  const key = id ?? "";
  const person = PEOPLE[key] ?? { name: key, full: "" };

  const inputRef = useRef<TextInput>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draft, setDraft] = useState("");
  const [extra, setExtra] = useState<Message[]>([]);
  const [reactions, setReactions] = useState<Record<string, string>>({});
  const [playing, setPlaying] = useState<Record<string, boolean>>({});
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [deleted, setDeleted] = useState<Record<string, boolean>>({});
  const [replyTo, setReplyTo] = useState<{ name: string; text: string } | null>(null);
  const [editing, setEditing] = useState<{ rk: string } | null>(null);
  const [menu, setMenu] = useState<MenuState>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [blocked, setBlocked] = useState<Blocked>(blockedParam === "i" || blockedParam === "them" ? blockedParam : null);

  const items = useMemo<ThreadItem[]>(() => [...(baseThreads()[key] ?? []), ...extra], [key, extra]);
  const msgs = useMemo<Message[]>(() => items.filter((i) => !isDivider(i)) as Message[], [items]);

  function flash(msg: string, icon: ToastData["icon"], tint: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, icon, tint });
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  function focusInput() {
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  function openMenu(rk: string, m: Message, e: GestureResponderEvent) {
    const pageY = e.nativeEvent.pageY;
    const top = Math.max(headerHeight + 8, Math.min(pageY - 40, SCREEN_H - 340));
    setMenu({ rk, mine: m.s === "me", kind: m.t, top, side: m.s === "me" ? "right" : "left" });
  }

  function mkOf(rk: string): Message | undefined {
    const mi = Number(rk.split("#")[1]);
    return msgs[mi];
  }

  function pickReaction(emoji: string) {
    if (menu) setReactions((r) => ({ ...r, [menu.rk]: emoji }));
    setMenu(null);
  }

  function onAction(action: MenuAction) {
    if (!menu) return;
    const { rk } = menu;
    const m = mkOf(rk);
    setMenu(null);
    if (!m) return;
    switch (action) {
      case "reply":
        setReplyTo({ name: m.s === "me" ? "You" : person.name, text: bubblePreview(m) });
        setEditing(null);
        focusInput();
        break;
      case "copy":
        flash("Copied to clipboard", "copy", "#31F1F0");
        break;
      case "edit":
        setDraft(edited[rk] ?? m.x ?? "");
        setEditing({ rk });
        setReplyTo(null);
        focusInput();
        break;
      case "delete":
        setDeleted((d) => ({ ...d, [rk]: true }));
        flash("Message deleted", "delete", colors.text.negative);
        break;
      case "complain":
        // Report sheet wires in the next milestone.
        break;
    }
  }

  function send() {
    const text = draft.trim();
    if (!text) return;
    if (editing) {
      setEdited((e) => ({ ...e, [editing.rk]: text }));
      setEditing(null);
      setDraft("");
      flash("Message edited", "edit", "#31F1F0");
      return;
    }
    const msg: Message = { s: "me", t: "text", x: text, tm: hhmm(), r: false };
    if (replyTo) msg.reply = replyTo;
    setExtra((prev) => [...prev, msg]);
    setDraft("");
    setReplyTo(null);
  }

  const canType = blocked === null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: headerHeight + 8, paddingBottom: 24, paddingHorizontal: 8, gap: 10, flexGrow: 1 }}
      >
        {blocked ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 6 }}>
            <Text style={[typography.bodyBasicBold, { color: "#fff", textAlign: "center" }]}>
              {blocked === "i" ? "Oops, You've blocked this user" : "Oops, You've been blocked"}
            </Text>
            <Text style={{ fontFamily: "Montserrat", fontWeight: "400", fontSize: 12, lineHeight: 14, color: "#fff", textAlign: "center" }}>
              But we both know that won't last long 😏
            </Text>
            {blocked === "i" ? (
              <LinearGradient
                colors={["rgba(255,255,255,0.7)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.9)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ borderRadius: 100, padding: 1, marginTop: 12 }}
              >
                <Text
                  onPress={() => { setBlocked(null); flash("User unblocked", "block", "#31F1F0"); }}
                  style={{
                    height: 44,
                    lineHeight: 44,
                    paddingHorizontal: 28,
                    borderRadius: 100,
                    backgroundColor: colors.button.secondaryBg,
                    color: "#fff",
                    fontFamily: "Montserrat",
                    fontWeight: "700",
                    fontSize: 12,
                    letterSpacing: 0.72,
                    textTransform: "uppercase",
                    textAlign: "center",
                    overflow: "hidden",
                  }}
                >
                  Unblock
                </Text>
              </LinearGradient>
            ) : null}
          </View>
        ) : (
          (() => {
            let mi = -1;
            return items.map((item, i) => {
              if (isDivider(item)) {
                return (
                  <Text key={`d${i}`} style={[typography.tinyRegular, { color: colors.text.secondary, textAlign: "center" }]}>
                    {item.d}
                  </Text>
                );
              }
              mi += 1;
              const rk = `${key}#${mi}`;
              if (deleted[rk]) return null;
              const base = msgs[mi];
              const msg: Message = edited[rk] != null ? { ...base, x: edited[rk] } : base;
              return (
                <MessageBubble
                  key={rk}
                  message={msg}
                  reaction={reactions[rk]}
                  playing={!!playing[rk]}
                  onTogglePlay={() => setPlaying((p) => ({ ...p, [rk]: !p[rk] }))}
                  onLongPress={(e) => openMenu(rk, msg, e)}
                />
              );
            });
          })()
        )}
      </ScrollView>

      {canType ? (
        <ChatInput
          ref={inputRef}
          value={draft}
          onChangeText={setDraft}
          onSend={send}
          replyTo={replyTo}
          onCancelReply={() => { setReplyTo(null); setEditing(null); }}
          bottomInset={insets.bottom + 12}
        />
      ) : null}

      <ChatHeader variant="thread" name={person.name} full={person.full} avatarUri={key ? avatarUri(key) : undefined} onBack={() => router.back()} />

      <ActionMenu
        open={menu !== null}
        mine={menu?.mine ?? false}
        kind={menu?.kind ?? "text"}
        currentReaction={menu ? reactions[menu.rk] : undefined}
        top={menu?.top ?? 0}
        side={menu?.side ?? "left"}
        onPickReaction={pickReaction}
        onAction={onAction}
        onClose={() => setMenu(null)}
      />
      <ChatToast toast={toast} />
    </View>
  );
}
