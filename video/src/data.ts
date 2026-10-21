import clips from "../public/clips/clips.json";

// Numbers from docs/voxmere/data.json and the blind jury reports in docs/voxmere/reports/.
export const SESSIONS = {
  a: { minutes: 117, cost: 36.33 },
  b: { minutes: 118, cost: 37.28 },
};

export const AUDIT = { a: 86, b: 96 };

export const JURY = {
  a: { weighted: 7.65, usability: 7.0, disposition: "fix" },
  b: { weighted: 7.83, usability: 7.0, disposition: "ship" },
};

export type Tap = { frame: number; x: number; y: number; label: string };
export type Clip = { file: string; frames: number; marks: Record<string, number>; taps: Tap[] };
export const CLIPS = clips as Record<"a-desktop" | "b-desktop" | "a-phone" | "b-phone", Clip>;

// The 30 options in Exhibit A's "Ship to" dropdown, in its order.
export const COUNTRIES = [
  "Switzerland", "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Finland",
  "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta",
  "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "United Kingdom", "United States",
];
