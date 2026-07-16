import { useId } from "react";
import { View } from "react-native";
import Svg, { Defs, G, LinearGradient, Path, Stop } from "react-native-svg";

/*
  Ported from starter's Avatar primitive (src/components/primitives/
  avatar/Avatar.tsx) — the verified-account badge: an 8-point cyan-
  gradient starburst with a black checkmark, pinned to an avatar's
  bottom-right corner. Reused as-is by FeedUsername's verified checkmark.
*/
export function BadgeIcon({ size }: { size: number }) {
  const gid = `avatar-badge-gradient-${useId()}`;
  return (
    <View style={{ position: "absolute", right: 0, bottom: 0, width: size, height: size }}>
      <Svg viewBox="0 0 8 8" width={size} height={size}>
        <Defs>
          <LinearGradient id={gid} x1="8" y1="8" x2="0" y2="0" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#01D9FF" offset="0" />
            <Stop stopColor="#31F1F0" offset="1" />
          </LinearGradient>
        </Defs>
        <Path
          d="M3.66161 0.132389C3.85358 -0.0441297 4.14642 -0.0441297 4.33839 0.132389L5.00514 0.745455C5.10278 0.835235 5.23127 0.88263 5.36301 0.877462L6.26261 0.84217C6.52163 0.832009 6.74595 1.02277 6.78105 1.28305L6.90297 2.18703C6.92083 2.31941 6.9892 2.43942 7.09339 2.52128L7.80491 3.08028C8.00977 3.24123 8.06062 3.53349 7.92243 3.75575L7.44247 4.52766C7.37219 4.6407 7.34844 4.77717 7.37634 4.90776L7.56685 5.79948C7.6217 6.05624 7.47529 6.31325 7.22846 6.39348L6.3712 6.67214C6.24566 6.71295 6.14092 6.80202 6.07946 6.92023L5.65982 7.72743C5.539 7.95985 5.26382 8.06135 5.02385 7.96202L4.19042 7.61704C4.06837 7.56652 3.93163 7.56652 3.80958 7.61704L2.97615 7.96202C2.73618 8.06135 2.461 7.95985 2.34018 7.72743L1.92054 6.92023C1.85908 6.80202 1.75434 6.71295 1.6288 6.67214L0.771542 6.39348C0.524714 6.31325 0.378298 6.05624 0.43315 5.79948L0.623657 4.90776C0.651556 4.77717 0.627812 4.6407 0.557525 4.52766L0.0775693 3.75575C-0.0606235 3.53349 -0.00977369 3.24123 0.195091 3.08028L0.906607 2.52128C1.0108 2.43942 1.07917 2.31941 1.09703 2.18703L1.21895 1.28305C1.25405 1.02277 1.47837 0.832009 1.73739 0.84217L2.63699 0.877462C2.76873 0.88263 2.89722 0.835235 2.99486 0.745454L3.66161 0.132389Z"
          fill={`url(#${gid})`}
        />
        <G transform="translate(1.667 1.667)">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.83194 1.32084C3.90787 1.39678 3.90787 1.51989 3.83194 1.59583L2.08194 3.34583C2.006 3.42176 1.88289 3.42176 1.80695 3.34583L0.834729 2.3736C0.758794 2.29767 0.758794 2.17455 0.834729 2.09862C0.910664 2.02268 1.03378 2.02268 1.10972 2.09862L1.94444 2.93335L3.55695 1.32084C3.63289 1.2449 3.756 1.2449 3.83194 1.32084Z"
            fill="black"
          />
        </G>
      </Svg>
    </View>
  );
}
