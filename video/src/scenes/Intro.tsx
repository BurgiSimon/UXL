import { AbsoluteFill } from "remotion";
import { Docket, Label, Mark, Reveal, Seal } from "../components/ui";
import { C, F } from "../theme";

export const Title: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, justifyContent: "center", alignItems: "center", gap: 36 }}>
    <Reveal>
      <Seal size={150} />
    </Reveal>
    <Reveal delay={8}>
      <div style={{ fontFamily: F.display, fontSize: 132, color: C.ink, lineHeight: 1 }}>UXL · UX Lawyer</div>
    </Reveal>
    <Reveal delay={18}>
      <div style={{ fontFamily: F.body, fontSize: 40, color: C.inkSoft }}>The 30 Laws of UX, applied by your AI coding agent.</div>
    </Reveal>
    <Reveal delay={34} style={{ marginTop: 36 }}>
      <Label>Case 3 · The Voxmere case</Label>
    </Reveal>
  </AbsoluteFill>
);

const Lane: React.FC<{ tag: string; title: string; uxl?: boolean; delay: number }> = ({ tag, title, uxl, delay }) => (
  <Reveal delay={delay}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        background: C.sheet,
        border: `2px solid ${uxl ? C.markInk : C.rule}`,
        borderRadius: 16,
        padding: "26px 32px",
      }}
    >
      <span style={{ fontFamily: F.mono, fontSize: 30, fontWeight: 500, color: C.inkSoft }}>{tag}</span>
      <span style={{ fontFamily: F.body, fontSize: 40, fontWeight: 700, color: C.ink }}>
        {uxl ? (
          <>
            awards plugin <Mark delay={delay + 14}>+ UXL</Mark>
          </>
        ) : (
          title
        )}
      </span>
    </div>
  </Reveal>
);

export const Setup: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, padding: "150px 120px 100px", flexDirection: "row", gap: 90, alignItems: "center" }}>
    <Docket />
    <div style={{ flex: 1.25, display: "grid", gap: 30 }}>
      <Reveal>
        <Label>Exhibit P · the prompt, excerpt</Label>
      </Reveal>
      <Reveal delay={6}>
        <div style={{ fontFamily: F.display, fontSize: 52, lineHeight: 1.18, color: C.ink }}>
          “We’re Voxmere, a (fictional) deep-tech startup from Lausanne. We’ve built the first display that shows true 3D holograms inside a solid block of glass.”
        </div>
      </Reveal>
      <Reveal delay={40}>
        <div style={{ fontFamily: F.display, fontSize: 52, lineHeight: 1.18, color: C.ink }}>
          “We want it to win <Mark delay={60}>Awwwards Site of the Day</Mark> and FWA of the Day: <Mark delay={78}>push it, be experimental.</Mark>”
        </div>
      </Reveal>
    </div>
    <div style={{ flex: 1, display: "grid", gap: 26 }}>
      <Reveal delay={100}>
        <Label>Two fresh Claude Code sessions</Label>
      </Reveal>
      <Lane tag="A" title="awards plugin" delay={110} />
      <Lane tag="B" title="" uxl delay={124} />
      <Reveal delay={150}>
        <div style={{ fontFamily: F.body, fontSize: 30, color: C.inkSoft, lineHeight: 1.45 }}>
          Same prompt, same model, effort xhigh. The prompt names neither skill and never says “UX”.
        </div>
      </Reveal>
    </div>
  </AbsoluteFill>
);
