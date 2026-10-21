import type { ReactNode } from "react";
import {
  Freeze,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { Clip } from "../data";
import { C, F } from "../theme";

// A phone bezel around a 390 × 844 CSS-px screen, drawn `height` px tall.
export const Phone: React.FC<{ height: number; children: ReactNode }> = ({
  height,
  children,
}) => {
  const scale = height / 844;
  return (
    <div
      style={{
        background: C.bezel,
        borderRadius: 52,
        padding: 14,
        boxShadow: "0 40px 80px -40px rgb(10 14 26 / 0.55)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 390 * scale,
          height,
          borderRadius: 38,
          overflow: "hidden",
          background: C.bezel,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// A desktop browser window around a 1440 × 900 CSS-px screen, drawn `width` px wide.
export const Browser: React.FC<{ width: number; children: ReactNode }> = ({
  width,
  children,
}) => (
  <div
    style={{
      background: C.bezel,
      borderRadius: 16,
      padding: "34px 10px 10px",
      position: "relative",
      boxShadow: "0 40px 80px -40px rgb(10 14 26 / 0.55)",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 13,
        left: 18,
        display: "flex",
        gap: 8,
      }}
    >
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <span
          key={c}
          style={{ width: 10, height: 10, borderRadius: "50%", background: c }}
        />
      ))}
    </div>
    <div
      style={{
        position: "relative",
        width,
        height: (width * 900) / 1440,
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

// Plays clip frames [from, to) and then holds the last one until the parent sequence ends.
export const ClipSegment: React.FC<{
  clip: Clip;
  from: number;
  to: number;
  hold: number;
}> = ({ clip, from, to, hold }) => {
  const len = to - from;
  const video = (
    <OffthreadVideo
      src={staticFile(clip.file)}
      trimBefore={from}
      muted
      style={{ width: "100%", height: "100%" }}
    />
  );
  return (
    <>
      <Sequence name="Play" durationInFrames={len} layout="none">
        {video}
      </Sequence>
      {hold > 0 ? (
        <Sequence name="Hold" from={len} durationInFrames={hold} layout="none">
          <Freeze frame={len - 1}>{video}</Freeze>
        </Sequence>
      ) : null}
    </>
  );
};

// A ripple wherever the capture tapped, drawn over the phone screen (tap x/y are CSS px).
export const Taps: React.FC<{
  clip: Clip;
  from: number;
  to: number;
  scale: number;
}> = ({ clip, from, to, scale }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {clip.taps
        .filter((t) => t.frame >= from && t.frame < to)
        .map((t) => {
          const local = frame - (t.frame - from);
          if (local < 0 || local > 18) return null;
          return (
            <div
              key={t.frame}
              style={{
                position: "absolute",
                left: t.x * scale - 30,
                top: t.y * scale - 30,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgb(18 26 44 / 0.28)",
                border: "3px solid rgb(255 255 255 / 0.9)",
                opacity: interpolate(local, [0, 4, 18], [0, 1, 0]),
                scale: interpolate(local, [0, 18], [0.5, 1.4]),
              }}
            />
          );
        })}
    </>
  );
};

// Exhibit A's native country picker, which a headless capture can't show: the 30 options as a phone sheet.
export const PickerSheet: React.FC<{
  countries: string[];
  selected: string;
  scale: number;
  dur: number;
}> = ({ countries, selected, scale, dur }) => {
  const frame = useCurrentFrame();
  const row = 48 * scale;
  const shown = 11;
  const target = countries.indexOf(selected);
  const scrollRows = interpolate(
    frame,
    [8, dur - 14],
    [0, Math.max(0, target - 4)],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const visible = interpolate(frame, [0, 6, dur - 6, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const picked = frame > dur - 14;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `rgb(10 14 26 / ${0.45 * visible})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: row * shown + 70 * scale,
          background: "#fff",
          borderRadius: `${18 * scale}px ${18 * scale}px 0 0`,
          translate: `0px ${(1 - visible) * 100}%`,
          overflow: "hidden",
          fontFamily: "Roboto, Arial, sans-serif",
        }}
      >
        <div
          style={{
            height: 56 * scale,
            display: "flex",
            alignItems: "center",
            padding: `0 ${20 * scale}px`,
            fontSize: 18 * scale,
            fontWeight: 600,
            color: "#222",
            borderBottom: "1px solid #ddd",
          }}
        >
          Ship to
        </div>
        <div style={{ height: row * shown, overflow: "hidden" }}>
          <div style={{ translate: `0px ${-scrollRows * row}px` }}>
            {countries.map((c, i) => (
              <div
                key={c}
                style={{
                  height: row,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: `0 ${20 * scale}px`,
                  fontSize: 17 * scale,
                  color: "#222",
                  background:
                    picked && i === target ? "#e8eefc" : "transparent",
                }}
              >
                {c}
                <span
                  style={{
                    width: 18 * scale,
                    height: 18 * scale,
                    borderRadius: "50%",
                    border: `2px solid ${(picked ? i === target : i === 0) ? "#1a73e8" : "#999"}`,
                    background: (picked ? i === target : i === 0)
                      ? "radial-gradient(#1a73e8 45%, transparent 50%)"
                      : "transparent",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 16 * scale,
          right: 16 * scale,
          fontFamily: F.mono,
          fontSize: 15 * scale,
          background: C.mark,
          color: C.markInk,
          padding: `${4 * scale}px ${10 * scale}px`,
          borderRadius: 4,
          opacity: visible,
        }}
      >
        30 options
      </div>
    </div>
  );
};
