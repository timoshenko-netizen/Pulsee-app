import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Coin } from "@/design/coins/Coin";
import { typography } from "@/design/theme";

/*
  Ported from starter/src/components/features/feed/FeedLeftEarn.tsx
  (Figma "Components Pulse" -> Feed page -> "_Feed/Left" Earn kind,
  13457:4193), with the animated behavior added during the interactive-
  prototype pass in Claude Design (feed-kit.js -> FeedLeftEarn): each
  coin's progress ring fills over `period` ms; on each completed lap the
  balance ticks up by `inc` and the balance + "+delta" flash in together
  (pill expands with symmetric inner padding), hold ~2s, then collapse
  away — coins-only (just the ring, no numbers) is the resting default
  state, not the balance permanently shown with only the delta toggling.
*/
const CIRCUMFERENCE = 2 * Math.PI * 14;

function fmtNum(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1).replace(".", ",");
}

function EarnRow({ coin, start, inc, period, onInfoChange }: { coin: "see" | "wave"; start: number; inc: number; period: number; onInfoChange?: (show: boolean) => void }) {
  const [balance, setBalance] = useState(start);
  const [showInfo, setShowInfoState] = useState(false);
  const arcRef = useRef<Circle>(null);

  function setShowInfo(show: boolean) {
    setShowInfoState(show);
    onInfoChange?.(show);
  }

  useEffect(() => {
    let mounted = true;
    let raf = 0;
    let hideTimer: ReturnType<typeof setTimeout>;
    let t0 = Date.now();

    function tick() {
      if (!mounted) return;
      const now = Date.now();
      let p = (now - t0) / period;
      if (p >= 1) {
        t0 = now;
        p = 0;
        setBalance((b) => Math.round((b + inc) * 10) / 10);
        setShowInfo(true);
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => { if (mounted) setShowInfo(false); }, 2000);
      }
      arcRef.current?.setNativeProps({ strokeDashoffset: CIRCUMFERENCE * (1 - p) });
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { mounted = false; cancelAnimationFrame(raf); clearTimeout(hideTimer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, inc]);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ width: 30, height: 30, flexShrink: 0 }}>
        <Svg width={30} height={30} viewBox="0 0 30 30" fill="none" style={{ position: "absolute", left: 0, top: 0, transform: [{ rotate: "-90deg" }] }}>
          <Circle cx={15} cy={15} r={14} stroke="white" strokeWidth={2} opacity={0.3} />
          <Circle ref={arcRef} cx={15} cy={15} r={14} stroke="#FD4B03" strokeWidth={2} strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE} />
        </Svg>
        <View style={{ position: "absolute", left: 3, top: 3, width: 24, height: 24, overflow: "hidden", borderRadius: 12 }}>
          <Coin name={coin} size={24} />
        </View>
      </View>
      {/* Coins-only is the resting state — balance + delta only exist while a
          lap has just completed, revealed together (not the balance shown
          permanently with just the delta toggling). */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          gap: showInfo ? 4 : 0,
          overflow: "hidden",
          maxWidth: showInfo ? 96 : 0,
          opacity: showInfo ? 1 : 0,
          paddingLeft: showInfo ? 4 : 0,
        }}
      >
        <Text style={[typography.captionBold, { color: "white", textShadowColor: "rgba(0,0,0,0.3)", textShadowRadius: 2 }]}>{fmtNum(balance)}</Text>
        <Text style={[typography.captionBold, { color: "#FD4B03", textShadowColor: "rgba(0,0,0,0.3)", textShadowRadius: 2 }]}>+{fmtNum(inc)}</Text>
      </View>
    </View>
  );
}

export type FeedLeftEarnProps = {
  seeStart?: number;
  seeInc?: number;
  seePeriod?: number;
  waveStart?: number;
  waveInc?: number;
  wavePeriod?: number;
};

export function FeedLeftEarn({ seeStart = 1.2, seeInc = 1.2, seePeriod = 10000, waveStart = 2.0, waveInc = 2.0, wavePeriod = 5000 }: FeedLeftEarnProps) {
  // The pill's own right padding only needs to exist to give the *last*
  // row's revealed balance/delta text room before the rounded corner —
  // wave is always rendered last.
  const [waveInfoShown, setWaveInfoShown] = useState(false);
  return (
    <View
      style={{
        flexDirection: "row",
        height: 34,
        alignItems: "center",
        gap: 4,
        borderRadius: 100,
        backgroundColor: "rgba(0,0,0,0.72)",
        paddingVertical: 2,
        paddingLeft: 2,
        paddingRight: waveInfoShown ? 10 : 2,
      }}
    >
      <EarnRow coin="see" start={seeStart} inc={seeInc} period={seePeriod} />
      <EarnRow coin="wave" start={waveStart} inc={waveInc} period={wavePeriod} onInfoChange={setWaveInfoShown} />
    </View>
  );
}
