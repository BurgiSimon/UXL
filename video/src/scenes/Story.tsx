import { AbsoluteFill } from "remotion";
import { Browser, ClipSegment } from "../components/devices";
import { Docket, Label, Mark, Reveal } from "../components/ui";
import { CLIPS } from "../data";
import { C, F } from "../theme";

// Both desktop pages side by side: the award layer both sessions got from the same pipeline.
export const BothAwardGrade: React.FC = () => {
  const a = CLIPS["a-desktop"];
  const b = CLIPS["b-desktop"];
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Docket />
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", display: "grid", gap: 10 }}>
        <Reveal>
          <div style={{ fontFamily: F.display, fontSize: 64, color: C.ink }}>Both look award-grade.</div>
        </Reveal>
        <Reveal delay={10}>
          <div style={{ fontFamily: F.body, fontSize: 30, color: C.inkSoft }}>Awards gave each one a concept, a glass cube in WebGL, and motion.</div>
        </Reveal>
      </div>
      <div style={{ position: "absolute", top: 310, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 48 }}>
        {[
          { clip: a, tag: "A · awards" },
          { clip: b, tag: "B · awards + UXL" },
        ].map(({ clip, tag }) => (
          <div key={tag} style={{ display: "grid", gap: 16 }}>
            <Label style={{ color: C.ink }}>{tag}</Label>
            <Browser width={860}>
              <ClipSegment clip={clip} from={0} to={clip.frames} hold={0} />
            </Browser>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const STEPS_A = ["craft", "concept", "system", "structure", "stack", "motion", "webgl", "jury", "ship", "jury"];
const STEPS_B = ["craft", "concept", "system", "structure", "uxl: ux-lawyer", "stack", "motion", "webgl", "uxl: lint + audit ×3", "jury", "jury", "ship", "uxl: final scan"];

const Track: React.FC<{ title: string; steps: string[]; delay: number }> = ({ title, steps, delay }) => (
  <div style={{ display: "grid", gap: 18 }}>
    <Reveal delay={delay}>
      <div style={{ fontFamily: F.body, fontSize: 32, fontWeight: 700, color: C.ink }}>{title}</div>
    </Reveal>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px" }}>
      {steps.map((s, i) => {
        const uxl = s.startsWith("uxl");
        return (
          <Reveal key={`${s}-${i}`} delay={delay + 6 + i * 4} dist={12}>
            <div
              style={{
                position: "relative",
                fontFamily: F.mono,
                fontSize: 26,
                fontWeight: uxl ? 500 : 400,
                padding: "10px 18px",
                borderRadius: 8,
                border: `2px solid ${uxl ? C.markInk : C.rule}`,
                background: uxl ? C.mark : C.sheet,
                color: uxl ? C.markInk : C.ink,
              }}
            >
              {s}
              {i < steps.length - 1 ? <span style={{ position: "absolute", right: -32, top: 10, color: C.inkSoft, fontFamily: F.body }}>→</span> : null}
            </div>
          </Reveal>
        );
      })}
    </div>
  </div>
);

export const Pipelines: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, padding: "150px 120px 0" }}>
    <Docket />
    <Reveal>
      <div style={{ fontFamily: F.display, fontSize: 64, color: C.ink, marginBottom: 56 }}>
        Awards ran the pipeline. <Mark delay={20}>B called UXL on its own.</Mark>
      </div>
    </Reveal>
    <div style={{ display: "grid", gap: 56 }}>
      <Track title="Exhibit A · skill calls in order" steps={STEPS_A} delay={10} />
      <Track title="Exhibit B · skill calls in order" steps={STEPS_B} delay={40} />
    </div>
    <Reveal delay={110} style={{ marginTop: 60 }}>
      <div style={{ fontFamily: F.body, fontSize: 32, color: C.inkSoft, lineHeight: 1.45, maxWidth: 1500 }}>
        Before writing any markup, B read UXL’s playbook for forms, checkout and multi-step flows. Before its first jury, it ran UXL’s linter and auditor. Cost of all that: one more minute, $0.95.
      </div>
    </Reveal>
  </AbsoluteFill>
);
