import { useFonts } from "expo-font";

/*
  Montserrat (the web app's --font-heading), loaded from the single
  variable-font TTF Google Fonts now ships (assets/fonts/) rather than
  separate static per-weight files, which that repo no longer provides
  at this path. Registered once under the family name "Montserrat" —
  RN's `fontWeight` style resolves against the variable font's own
  weight axis on both platforms, so typography.ts's per-style
  fontWeight ("500"/"700"/etc.) still picks the right weight without
  needing five separately-registered family names.
*/
export function useAppFonts() {
  return useFonts({
    Montserrat: require("../../../assets/fonts/Montserrat-Variable.ttf"),
  });
}
