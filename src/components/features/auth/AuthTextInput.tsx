import { useState } from "react";
import { TextInput, type TextInputProps } from "react-native";
import { colors } from "@/design/theme";

/*
  Ported from PulseeSignup.dc.html's `.su-input` — pill input, translucent
  white fill, orange border on focus (the source uses a gradient border
  via padding-box/border-box; a flat orange border reads the same at
  this stroke width and avoids another LinearGradient-as-border wrapper
  for a one-pixel difference).
*/
export function AuthTextInput({ error, style, ...props }: TextInputProps & { error?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      placeholderTextColor="rgba(255,255,255,0.4)"
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      style={[
        {
          height: 60,
          borderRadius: 100,
          backgroundColor: colors.surfaceFill[10],
          borderWidth: 1,
          borderColor: error ? colors.text.negative : focused ? colors.text.interactive2 : "transparent",
          paddingHorizontal: 20,
          color: "white",
          fontFamily: "Montserrat",
          fontWeight: "500",
          fontSize: 16,
        },
        style,
      ]}
      {...props}
    />
  );
}
