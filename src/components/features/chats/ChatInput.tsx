import { forwardRef } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Icon } from "@/design/icons/Icon";
import { colors } from "@/design/theme";

/*
  Conversation input bar (PulseeChats.dc.html): a 48-tall pill with a
  32-circle send button that flips to white-with-black-up-arrow once
  there's text. When replying, a reply-preview cell (raspberry accent)
  sits above the pill. Editing prefills the field but shows no cell
  (matches the prototype). Enter sends.
*/
export type ChatInputProps = {
  value: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
  replyTo?: { name: string; text: string } | null;
  onCancelReply?: () => void;
  bottomInset?: number;
};

export const ChatInput = forwardRef<TextInput, ChatInputProps>(function ChatInput(
  { value, onChangeText, onSend, replyTo, onCancelReply, bottomInset = 20 },
  ref
) {
  const hasText = value.trim().length > 0;

  return (
    <View style={{ paddingTop: 8, paddingHorizontal: 16, paddingBottom: bottomInset, backgroundColor: colors.bg.primary }}>
      {replyTo ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, minHeight: 34, marginBottom: 8 }}>
          <View style={{ width: 3, alignSelf: "stretch", borderRadius: 2, backgroundColor: colors.text.negative }} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontFamily: "Montserrat", fontWeight: "700", fontSize: 13, lineHeight: 16, color: colors.text.negative }} numberOfLines={1}>
              Reply to {replyTo.name}
            </Text>
            <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 13, lineHeight: 16, color: colors.text.secondary }} numberOfLines={1}>
              {replyTo.text}
            </Text>
          </View>
          <Pressable onPress={onCancelReply} hitSlop={8} style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center" }}>
            <Icon name="cross" size={18} color={colors.text.secondary} />
          </Pressable>
        </View>
      ) : null}

      <View
        style={{
          minHeight: 48,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surfaceFill[10],
          borderWidth: 1,
          borderColor: colors.strokeWhite[15],
          borderRadius: 100,
          paddingLeft: 16,
          paddingRight: 8,
        }}
      >
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSend}
          blurOnSubmit={false}
          placeholder="Message…"
          placeholderTextColor={colors.text.secondary}
          selectionColor="#FD4B03"
          cursorColor="#FD4B03"
          style={{ flex: 1, color: "#fff", fontFamily: "Montserrat", fontSize: 14, paddingVertical: 10, paddingRight: 8 }}
        />
        <Pressable
          onPress={onSend}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: hasText ? "#fff" : colors.surfaceFill[20],
          }}
        >
          <Icon name="arrow-direction-up" size={20} color={hasText ? "#080A0B" : colors.text.secondary} />
        </Pressable>
      </View>
    </View>
  );
});
