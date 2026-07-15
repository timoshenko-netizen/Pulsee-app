import type { TextStyle } from "react-native";

/*
  Ported from typography.css (Figma "Typography Pulse"). CSS letter-spacing
  values there are already pre-converted from Figma's percentage-of-font-
  size representation to raw px — carried over as-is here, RN's
  `letterSpacing` TextStyle prop takes the same raw-number-as-px unit CSS
  does. `fontWeight` must be a *string* in RN ("700", not 700).

  fontFamily here is the loaded font's registered name (see theme/fonts.ts
  + useFonts in App.tsx) — "Montserrat" for the heading family throughout;
  the web app's secondary "SF Body" system-font stack has no RN equivalent
  (no -apple-system keyword), so those few `type-sf-body-*` styles fall
  back to the platform default (fontFamily: undefined) rather than
  guessing at a real system font name.
*/
const heading = "Montserrat";

function style(weight: TextStyle["fontWeight"], fontSize: number, lineHeight: number, letterSpacing: number, fontFamily: string | undefined = heading): TextStyle {
  return { fontFamily, fontSize, fontWeight: weight, lineHeight, letterSpacing };
}

export const typography = {
  headline: style("700", 24, 28, 0.24),
  title: style("700", 20, 24, 0.2),

  bodyLargeBold: style("700", 16, 24, 0.16),
  bodyLargeTight: style("700", 16, 20, 0.16),
  bodyLargeRegular: style("500", 16, 24, 0.16),

  bodyBasicBold: style("700", 14, 16, 0.14),
  bodyBasicRegular: style("500", 14, 16, 0.14),

  bodyParagraphBold: style("700", 14, 20, 0.28),
  bodyParagraphRegular: style("500", 14, 20, 0.14),

  captionBold: style("700", 12, 14, 0.12),
  captionRegular: style("500", 12, 14, 0.06),
  captionExtra: style("500", 12, 14, 0.06),

  tinyBold: style("700", 10, 12, 0.1),
  tinyRegular: style("500", 10, 12, 0.05),

  buttonML: style("700", 12, 16, 0.72),
  buttonSBold: style("700", 10, 12, 0.8),
  buttonSRegular: style("500", 10, 12, 0.8),

  otherEnlarged: style("800", 30, 32, 1.2),
  otherPromotion: style("800", 36, 40, 0.36),
  otherTabbar: style("500", 12, 12, 0.12),

  // No RN equivalent for the web's -apple-system stack — platform default.
  sfBodyParagraph: style("400", 16, 24, -0.28, undefined),
  sfBodyRegular: style("400", 16, 20, -0.28, undefined),
  sfBodyBold: style("600", 16, 20, -0.36, undefined),
} as const satisfies Record<string, TextStyle>;
