import { Modal, Pressable, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Icon, type IconName } from "@/design/icons/Icon";
import { colors, typography } from "@/design/theme";
import { REACTION_EMOJIS } from "./data";
import type { MessageKind } from "./types";

/*
  Long-press / right-click action menu (PulseeChats.dc.html): a scrim +
  a 224-wide frosted popup positioned near the pressed bubble. Top row =
  5 reaction emojis (current one highlighted); below a hairline, the
  action rows, which differ by author × message kind:
    text mine  → Reply · Copy · Edit · Delete(pink)
    text other → Reply · Copy · Complain
    media mine → Delete(pink) · media other → Complain
*/
export type MenuAction = "reply" | "copy" | "edit" | "delete" | "complain";

type ActionSpec = { action: MenuAction; label: string; icon: IconName; destructive?: boolean };

function actionsFor(mine: boolean, kind: MessageKind): ActionSpec[] {
  if (kind !== "text") {
    return mine
      ? [{ action: "delete", label: "Delete message", icon: "delete", destructive: true }]
      : [{ action: "complain", label: "Complain", icon: "complain" }];
  }
  const base: ActionSpec[] = [
    { action: "reply", label: "Reply", icon: "reply" },
    { action: "copy", label: "Copy message", icon: "copy" },
  ];
  return mine
    ? [...base, { action: "edit", label: "Edit message", icon: "edit" }, { action: "delete", label: "Delete message", icon: "delete", destructive: true }]
    : [...base, { action: "complain", label: "Complain", icon: "complain" }];
}

export type ActionMenuProps = {
  open: boolean;
  mine: boolean;
  kind: MessageKind;
  currentReaction?: string;
  top: number;
  side: "left" | "right";
  onPickReaction: (emoji: string) => void;
  onAction: (action: MenuAction) => void;
  onClose: () => void;
};

export function ActionMenu({ open, mine, kind, currentReaction, top, side, onPickReaction, onAction, onClose }: ActionMenuProps) {
  if (!open) return null;
  const actions = actionsFor(mine, kind);

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.72)" }} onPress={onClose}>
        <View style={{ position: "absolute", top, [side]: 20, width: 224, borderRadius: 24, overflow: "hidden" }}>
          <BlurView intensity={40} tint="dark" style={{ backgroundColor: "rgba(33,35,35,0.72)" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
              {REACTION_EMOJIS.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => onPickReaction(emoji)}
                  style={{ width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: currentReaction === emoji ? "rgba(255,255,255,0.18)" : "transparent" }}
                >
                  <Text style={{ fontSize: 20 }}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ height: 0.5, backgroundColor: "rgba(255,255,255,0.1)" }} />
            {actions.map((a, i) => (
              <Pressable
                key={a.action}
                onPress={() => onAction(a.action)}
                style={{ flexDirection: "row", alignItems: "center", gap: 16, height: 44, paddingHorizontal: 16, borderBottomWidth: i < actions.length - 1 ? 0.5 : 0, borderBottomColor: "rgba(255,255,255,0.1)" }}
              >
                <Icon name={a.icon} size={20} color={a.destructive ? colors.text.negative : "#fff"} />
                <Text style={[typography.bodyBasicRegular, { color: a.destructive ? colors.text.negative : "#fff" }]}>{a.label}</Text>
              </Pressable>
            ))}
          </BlurView>
        </View>
      </Pressable>
    </Modal>
  );
}
