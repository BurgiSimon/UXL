import type { CSSProperties, ReactNode } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Fades and lifts its children in, starting `delay` frames into the parent sequence.
export const Reveal: React.FC<{ delay?: number; dist?: number; style?: CSSProperties; children: ReactNode }> = ({
  delay = 0,
  dist = 24,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        ...style,
        opacity: interpolate(frame, [delay, delay + 0.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translate: interpolate(frame, [delay, delay + 0.6 * fps], [`0px ${dist}px`, "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
        }),
      }}
    >
      {children}
    </div>
  );
};

// Highlighter stroke that sweeps across the text, like <mark> on the showcase pages.
export const Mark: React.FC<{ delay?: number; children: ReactNode }> = ({ delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [delay, delay + 0.6 * fps], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(transparent 55%, ${C.mark} 55%, ${C.mark} 92%, transparent 92%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${p}% 100%`,
        padding: "0 0.06em",
      }}
    >
      {children}
    </span>
  );
};

export const Label: React.FC<{ children: ReactNode; style?: CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkSoft, ...style }}>
    {children}
  </div>
);

export const Law: React.FC<{ children: ReactNode }> = ({ children }) => (
  <span
    style={{
      fontFamily: F.mono,
      fontSize: 24,
      fontWeight: 500,
      border: `2px solid ${C.markInk}`,
      background: C.mark,
      color: C.markInk,
      borderRadius: 6,
      padding: "4px 14px",
    }}
  >
    {children}
  </span>
);

// The docket strip in the top-left corner of every scene.
export const Docket: React.FC = () => (
  <div style={{ position: "absolute", top: 40, left: 64, display: "flex", alignItems: "center", gap: 16, fontFamily: F.body, fontWeight: 700, fontSize: 24, color: C.ink }}>
    <Seal size={44} />
    UXL · The Voxmere case
  </div>
);

export const Seal: React.FC<{ size: number }> = ({ size }) => (
  <span
    style={{
      display: "inline-grid",
      placeItems: "center",
      width: size,
      height: size,
      border: `${Math.max(2, size / 24)}px solid ${C.ink}`,
      borderRadius: "50%",
      fontFamily: F.display,
      fontSize: size * 0.55,
      lineHeight: 1,
      color: C.ink,
    }}
  >
    §
  </span>
);
