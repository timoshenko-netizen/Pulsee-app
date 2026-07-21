import { useRef } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { colors } from "@/design/theme";

/*
  Ported from PulseeSignup.dc.html's OTP cell row (email code / WhatsApp
  code share the same markup+behavior in the source). A single hidden
  TextInput captures the real keystrokes/keyboard; the visible cells are
  just a rendering of its current value, matching the source's own
  "invisible input + visible cell row" trick.
*/
export function OtpInput({ length, value, onChange, error }: { length: number; value: string; onChange: (v: string) => void; error?: boolean }) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(v) => onChange(v.replace(/\D/g, "").slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
      />
      <Pressable onPress={() => inputRef.current?.focus()}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {Array.from({ length }).map((_, i) => {
            const char = value[i] || "";
            const isNext = i === value.length && !error;
            return (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: char ? colors.surfaceFill[10] : colors.surfaceFill[5],
                  borderWidth: 1,
                  borderColor: error ? colors.text.negative : isNext ? colors.text.interactive2 : colors.surfaceFill[5],
                }}
              >
                {char ? <Text style={{ color: error ? colors.text.negative : "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 20 }}>{char}</Text> : null}
              </View>
            );
          })}
        </View>
      </Pressable>
      {error ? <Text style={{ color: colors.text.negative, fontFamily: "Montserrat", fontWeight: "500", fontSize: 12, marginTop: 12 }}>Wrong code. Try again.</Text> : null}
    </View>
  );
}
