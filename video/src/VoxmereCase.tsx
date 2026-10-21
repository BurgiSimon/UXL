import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import { CLIPS } from "./data";
import { Beat, beatLength, FlowIntro } from "./scenes/Flow";
import { Outro, Refusal, Scoreboard } from "./scenes/Close";
import { Setup, Title } from "./scenes/Intro";
import { BothAwardGrade, Pipelines } from "./scenes/Story";

// The phone beats cut both reservation clips at the marks capture.mjs recorded. It runs one script on both pages,
// so the marks match; only B's clip runs on, through the declined card.
const A = CLIPS["a-phone"];
const B = CLIPS["b-phone"];
const m = A.marks;
const shipTap = A.taps.find((t) => t.label === "Ship to")!.frame;
const settled = m.errors + 56;
const BEATS = [
  {
    name: "Where it ships",
    title: "Where does it ship?",
    laws: ["§L29 Working Memory", "§L10 Hick’s Law"],
    picker: { at: shipTap, dur: 40 },
    a: {
      from: m.region - 12,
      to: m.summary - 4,
      hold: 30,
      caption:
        "30 countries in a dropdown. The ship month appears after you pick.",
      note: "The native picker is redrawn here: a headless capture can’t show it.",
    },
    b: {
      from: m.region - 12,
      to: m.summary - 4,
      hold: 30,
      caption: "Four regions, each with its ship month.",
    },
  },
  {
    name: "The first batch",
    title: "The first batch of 500",
    laws: ["§L04 Cognitive Bias"],
    a: {
      from: m.summary - 4,
      to: m.open,
      hold: 45,
      caption: "“123 of 500 places left.” The number is hard-coded.",
      note: "const TAKEN_BEFORE_VISIT = 377;",
    },
    b: {
      from: m.summary - 4,
      to: m.open,
      hold: 45,
      caption: "The batch rule, in words. No counter.",
      note: "Its brief: “Deliberately absent: a ‘first batch remaining’ counter (it would be invented scarcity, UXL §L04)”",
    },
  },
  {
    name: "Empty submit",
    title: "Pay, with the form still empty",
    laws: ["§L24 Postel’s Law", "§L09 Goal-Gradient"],
    a: {
      from: m.open,
      to: settled,
      hold: 40,
      caption: "The browser’s bubble, on one field.",
    },
    b: {
      from: m.open,
      to: settled,
      hold: 40,
      caption: "Step 2 of 3. All five problems, listed.",
      note: "Focus moves to the list. The Pay button is never disabled.",
    },
  },
  {
    name: "Declined, then done",
    title: "A card that fails, then one that works",
    laws: ["§L23 Peak-End Rule"],
    a: {
      from: settled,
      to: A.frames,
      hold: B.frames - A.frames + 30,
      caption: "No declined path. Then a receipt.",
    },
    b: {
      from: settled,
      to: B.frames,
      hold: 30,
      caption: "A declined card, explained. Then: what happens next.",
    },
  },
];

const T = 15;
const SCENES: { name: string; len: number; node: React.ReactNode }[] = [
  { name: "Title", len: 130, node: <Title /> },
  { name: "Setup", len: 250, node: <Setup /> },
  { name: "Both award-grade", len: 300, node: <BothAwardGrade /> },
  { name: "Pipelines", len: 210, node: <Pipelines /> },
  { name: "Flow intro", len: 75, node: <FlowIntro /> },
  ...BEATS.map((b) => ({
    name: b.name,
    len: beatLength(b.a, b.b),
    node: (
      <Beat title={b.title} laws={b.laws} a={b.a} b={b.b} picker={b.picker} />
    ),
  })),
  { name: "Refusal", len: 200, node: <Refusal /> },
  { name: "Scoreboard", len: 240, node: <Scoreboard /> },
  { name: "Outro", len: 150, node: <Outro /> },
];

export const DURATION =
  SCENES.reduce((n, s) => n + s.len, 0) - T * (SCENES.length - 1);

export const VoxmereCase: React.FC = () => (
  <TransitionSeries>
    {SCENES.map((s, i) => (
      <Fragment key={s.name}>
        {i > 0 ? (
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: T })}
          />
        ) : null}
        <TransitionSeries.Sequence name={s.name} durationInFrames={s.len}>
          {s.node}
        </TransitionSeries.Sequence>
      </Fragment>
    ))}
  </TransitionSeries>
);
