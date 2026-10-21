import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Same system as the showcase pages in docs/: paper, ink, a highlighter yellow for UXL.
export const C = {
  paper: "#f2f4f9",
  sheet: "#ffffff",
  ink: "#121a2c",
  inkSoft: "#4a5571",
  rule: "#d6dce8",
  mark: "#ffe25a",
  markInk: "#1d1a05",
  pass: "#0b7149",
  passBg: "#e2f3ea",
  fail: "#b0271f",
  failBg: "#fbe8e5",
  bezel: "#0b0f1a",
};

// The showcase fonts, bundled from npm @fontsource (OFL-1.1, licences in public/fonts/), so a render needs no network.
const FONTS: [family: string, file: string, weight: string][] = [
  ["Libre Caslon Display", "libre-caslon-display-latin-400-normal", "400"],
  ["Public Sans", "public-sans-latin-400-normal", "400"],
  ["Public Sans", "public-sans-latin-500-normal", "500"],
  ["Public Sans", "public-sans-latin-600-normal", "600"],
  ["Public Sans", "public-sans-latin-700-normal", "700"],
  ["IBM Plex Mono", "ibm-plex-mono-latin-400-normal", "400"],
  ["IBM Plex Mono", "ibm-plex-mono-latin-500-normal", "500"],
];
for (const [family, file, weight] of FONTS) {
  loadFont({ family, url: staticFile(`fonts/${file}.woff2`), weight });
}

export const F = {
  display: '"Libre Caslon Display", Georgia, serif',
  body: '"Public Sans", system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
};
