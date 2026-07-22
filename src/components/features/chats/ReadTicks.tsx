import Svg, { Path } from "react-native-svg";
import { colors } from "@/design/theme";

/*
  Read receipts. `double` = check-check (delivered+read), `single` = one
  check. Exact stroke paths lifted from PulseeChats.dc.html. Two contexts
  with different footprints + default tints:
    inbox  — double 18x12 (#31F1F0), single 14x12 (secondary)
    bubble — double 16x11 (#fff),    single 12x11 (rgba(255,255,255,.7))
  Only ever rendered on own ("me") messages.
*/
export type ReadTicksProps = {
  read: "double" | "single";
  context?: "inbox" | "bubble";
  color?: string;
};

const SIZES = {
  inbox: { double: { w: 18, h: 12 }, single: { w: 14, h: 12 } },
  bubble: { double: { w: 16, h: 11 }, single: { w: 12, h: 11 } },
} as const;

const DEFAULT_COLOR = {
  inbox: { double: "#31F1F0", single: colors.text.secondary },
  bubble: { double: "#ffffff", single: "rgba(255,255,255,0.7)" },
} as const;

export function ReadTicks({ read, context = "bubble", color }: ReadTicksProps) {
  const { w, h } = SIZES[context][read];
  const stroke = color ?? DEFAULT_COLOR[context][read];
  const viewBox = read === "double" ? "0 0 18 12" : "0 0 14 12";

  return (
    <Svg width={w} height={h} viewBox={viewBox} fill="none" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      {read === "double" ? (
        <>
          <Path d="M1 6.2l3.4 3.4L11 2.4" />
          <Path d="M7 9.6l.8.8L15.4 2.4" />
        </>
      ) : (
        <Path d="M1 6.2l3.6 3.6L12.4 2" />
      )}
    </Svg>
  );
}
