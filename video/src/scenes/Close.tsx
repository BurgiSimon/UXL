import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Phone } from "../components/devices";
import { Docket, Label, Law, Reveal, Seal } from "../components/ui";
import { AUDIT, JURY, SESSIONS } from "../data";
import { C, F } from "../theme";

// The jury request B turned down, with both first phone screens as published.
export const Refusal: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Docket />
    <div style={{ position: "absolute", top: 104, left: 0, right: 0, display: "grid", justifyItems: "center", gap: 14 }}>
      <Reveal>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Law>§L05 Cognitive Load</Law>
          <Law>§L25 Selective Attention</Law>
        </div>
      </Reveal>
      <Reveal delay={4}>
        <div style={{ fontFamily: F.display, fontSize: 58, color: C.ink }}>Both juries wanted the headline behind the glass on phones.</div>
      </Reveal>
    </div>
    <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
      <div style={{ width: 400, textAlign: "right", display: "grid", gap: 18, justifyItems: "end" }}>
        <Reveal delay={6}>
          <Label style={{ color: C.ink }}>A · awards</Label>
        </Reveal>
        <Reveal delay={14}>
          <div style={{ fontFamily: F.body, fontSize: 36, lineHeight: 1.3, fontWeight: 600, color: C.ink, borderRight: `6px solid ${C.rule}`, paddingRight: 20 }}>
            A complied. “that holds light.” now sits behind smoked glass.
          </div>
        </Reveal>
      </div>
      <Phone height={740}>
        <Img src={staticFile("clips/a-first.png")} style={{ width: "100%" }} />
      </Phone>
      <div style={{ width: 16 }} />
      <Phone height={740}>
        <Img src={staticFile("clips/b-first.png")} style={{ width: "100%" }} />
      </Phone>
      <div style={{ width: 400, display: "grid", gap: 18 }}>
        <Reveal delay={6}>
          <Label style={{ color: C.ink }}>B · awards + UXL</Label>
        </Reveal>
        <Reveal delay={14}>
          <div style={{ fontFamily: F.body, fontSize: 36, lineHeight: 1.3, fontWeight: 600, color: C.ink, borderLeft: `6px solid ${C.mark}`, paddingLeft: 20 }}>
            B refused, and cited two laws.
          </div>
        </Reveal>
        <Reveal delay={40}>
          <div style={{ fontFamily: F.body, fontSize: 24, lineHeight: 1.45, color: C.inkSoft }}>
            “the phone keeps a legible &lt;h1&gt; under the cube (UXL §L05 Cognitive Load, §L25 Selective Attention); the refraction stays a desktop moment.”
          </div>
        </Reveal>
      </div>
    </div>
  </AbsoluteFill>
);

const Row: React.FC<{ label: string; a: string; b: string; delay: number; bWins?: boolean }> = ({ label, a, b, delay, bWins }) => (
  <Reveal delay={delay}>
    <div style={{ display: "grid", gridTemplateColumns: "560px 480px 480px", alignItems: "baseline", borderBottom: `2px solid ${C.rule}`, padding: "22px 0" }}>
      <div style={{ fontFamily: F.body, fontSize: 32, color: C.inkSoft }}>{label}</div>
      <div style={{ fontFamily: F.body, fontSize: 40, fontWeight: 600, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{a}</div>
      <div style={{ fontFamily: F.body, fontSize: 40, fontWeight: 700, color: bWins ? C.pass : C.ink, fontVariantNumeric: "tabular-nums" }}>{b}</div>
    </div>
  </Reveal>
);

export const Scoreboard: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.paper, padding: "150px 160px 0" }}>
      <Docket />
      <Reveal>
        <div style={{ fontFamily: F.display, fontSize: 64, color: C.ink, marginBottom: 40 }}>The scoreboard</div>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "560px 480px 480px", paddingBottom: 8 }}>
        <span />
        <Label style={{ color: C.ink }}>A · awards</Label>
        <Label style={{ color: C.ink }}>B · awards + UXL</Label>
      </div>
      <Row label="Blind awards jury, weighted" a={`${JURY.a.weighted.toFixed(2)} · ${JURY.a.disposition}`} b={`${JURY.b.weighted.toFixed(2)} · ${JURY.b.disposition}`} delay={10} bWins={JURY.b.weighted > JURY.a.weighted} />
      <Row label="Blind jury, Usability" a={`${JURY.a.usability.toFixed(1)}, capped`} b={`${JURY.b.usability.toFixed(1)}, capped`} delay={18} />
      <Row label="UXL runtime audit" a={`${AUDIT.a} / 100`} b={`${AUDIT.b} / 100`} delay={26} bWins />
      <Row label="Invented scarcity on the page" a="yes" b="no" delay={34} bWins />
      <Row label="Time · cost" a={`${SESSIONS.a.minutes} min · $${SESSIONS.a.cost.toFixed(2)}`} b={`${SESSIONS.b.minutes} min · $${SESSIONS.b.cost.toFixed(2)}`} delay={42} />
      <Reveal delay={60} style={{ marginTop: 30 }}>
        <div style={{ fontFamily: F.body, fontSize: 26, color: C.inkSoft }}>Each Usability score is capped by one failed check: A’s 41 px phone button, which UXL’s audit had flagged; B’s chapter readout and a 404 page left out of the jury folder. One run per condition: an illustration, not a statistic.</div>
      </Reveal>
    </AbsoluteFill>
  );
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.ink, justifyContent: "center", alignItems: "center", gap: 40 }}>
      <Reveal>
        <div style={{ fontFamily: F.display, fontSize: 96, color: C.paper, textAlign: "center", lineHeight: 1.1 }}>
          Award briefs invite tricks.
          <br />
          <span style={{ color: C.mark }}>UXL turns them down.</span>
        </div>
      </Reveal>
      <Reveal delay={40}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 38,
            color: C.paper,
            border: `2px solid ${C.inkSoft}`,
            borderRadius: 12,
            padding: "18px 32px",
            opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          /plugin marketplace add BurgiSimon/UXL
        </div>
      </Reveal>
      <Reveal delay={56}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: F.body, fontSize: 34, color: C.paper }}>
          <span style={{ filter: "invert(1)" }}>
            <Seal size={56} />
          </span>
          github.com/BurgiSimon/UXL
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};
