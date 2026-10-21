import type { ReactNode } from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ClipSegment, Phone, PickerSheet, Taps } from "../components/devices";
import { Docket, Label, Law, Reveal } from "../components/ui";
import { CLIPS, COUNTRIES } from "../data";
import { C, F } from "../theme";

const PHONE_H = 740;
const SCALE = PHONE_H / 844;

type Side = { from: number; to: number; hold: number; caption: ReactNode; note?: ReactNode };

export const beatLength = (a: Side, b: Side) => Math.max(a.to - a.from + a.hold, b.to - b.from + b.hold);

const Column: React.FC<{ tag: string; side: Side; align: "left" | "right"; uxl?: boolean }> = ({ tag, side, align, uxl }) => (
  <div style={{ width: 400, display: "grid", gap: 18, textAlign: align, justifyItems: align === "right" ? "end" : "start" }}>
    <Reveal delay={6}>
      <Label style={{ color: C.ink }}>{tag}</Label>
    </Reveal>
    <Reveal delay={14}>
      <div
        style={{
          fontFamily: F.body,
          fontSize: 36,
          lineHeight: 1.3,
          fontWeight: 600,
          color: C.ink,
          borderLeft: align === "left" ? `6px solid ${uxl ? C.mark : C.rule}` : undefined,
          borderRight: align === "right" ? `6px solid ${uxl ? C.mark : C.rule}` : undefined,
          padding: align === "left" ? "4px 0 4px 20px" : "4px 20px 4px 0",
        }}
      >
        {side.caption}
      </div>
    </Reveal>
    {side.note ? (
      <Reveal delay={40}>
        <div style={{ fontFamily: F.body, fontSize: 24, lineHeight: 1.45, color: C.inkSoft }}>{side.note}</div>
      </Reveal>
    ) : null}
  </div>
);

export const Beat: React.FC<{ title: string; laws: string[]; a: Side; b: Side; picker?: { at: number; dur: number } }> = ({
  title,
  laws,
  a,
  b,
  picker,
}) => {
  const clipA = CLIPS["a-phone"];
  const clipB = CLIPS["b-phone"];
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Docket />
      <div style={{ position: "absolute", top: 104, left: 0, right: 0, display: "grid", justifyItems: "center", gap: 14 }}>
        <Reveal>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {laws.map((l) => (
              <Law key={l}>{l}</Law>
            ))}
          </div>
        </Reveal>
        <Reveal delay={4}>
          <div style={{ fontFamily: F.display, fontSize: 58, color: C.ink }}>{title}</div>
        </Reveal>
      </div>
      <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <Column tag="A · awards" side={a} align="right" />
        <Phone height={PHONE_H}>
          <ClipSegment clip={clipA} from={a.from} to={a.to} hold={a.hold} />
          <Taps clip={clipA} from={a.from} to={a.to} scale={SCALE} />
          {picker ? (
            <Sequence from={picker.at - a.from} durationInFrames={picker.dur} layout="none">
              <PickerSheet countries={COUNTRIES} selected="Germany" scale={SCALE} dur={picker.dur} />
            </Sequence>
          ) : null}
        </Phone>
        <div style={{ width: 16 }} />
        <Phone height={PHONE_H}>
          <ClipSegment clip={clipB} from={b.from} to={b.to} hold={b.hold} />
          <Taps clip={clipB} from={b.from} to={b.to} scale={SCALE} />
        </Phone>
        <Column tag="B · awards + UXL" side={b} align="left" uxl />
      </div>
    </AbsoluteFill>
  );
};

// Cue card before the phone beats.
export const FlowIntro: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink, justifyContent: "center", alignItems: "center", gap: 28 }}>
    <Reveal>
      <Label style={{ color: C.mark }}>Same task, both sites, on a phone</Label>
    </Reveal>
    <Reveal delay={8}>
      <div style={{ fontFamily: F.display, fontSize: 84, color: C.paper, textAlign: "center", lineHeight: 1.1 }}>
        Reserve a Cube 20 in Smoke glass,
        <br />
        shipped to Germany.
      </div>
    </Reveal>
  </AbsoluteFill>
);
