"""Tests for the UXL static linter. Run: python3 -m unittest discover -s tests"""

import io
import json
import os
import sys
import tempfile
import unittest
from contextlib import redirect_stdout

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "skills", "ux-lawyer", "scripts"))

import uxl_lint  # noqa: E402

FIX = os.path.join(ROOT, "tests", "fixtures")
CHECKOUT = os.path.join(ROOT, "evals", "fixtures", "shopco-checkout")


def lint(*paths, extra=()):
    buf = io.StringIO()
    with redirect_stdout(buf):
        code = uxl_lint.main([*paths, "--format", "json", "--max-per-rule", "0", *extra])
    return code, json.loads(buf.getvalue())


def rules(report):
    return {f["rule"] for f in report["findings"]}


def lint_snippet(name, content):
    with tempfile.TemporaryDirectory() as d:
        path = os.path.join(d, name)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(content)
        return lint(path)[1]


class CleanFixtures(unittest.TestCase):
    def test_good_html_has_no_findings(self):
        _, rep = lint(os.path.join(FIX, "good"))
        self.assertEqual(rep["findings"], [], rep["findings"])
        self.assertEqual(rep["score"], 100)

    def test_audit_edge_fixture_has_no_findings(self):
        # grouped nav, focus ring on wrapper, repeated identical CTA, honeypot field
        _, rep = lint(os.path.join(FIX, "audit-edge"))
        self.assertEqual(rep["findings"], [], rep["findings"])

    def test_good_react_has_no_findings(self):
        _, rep = lint(os.path.join(FIX, "react-good"))
        self.assertEqual(rep["findings"], [], rep["findings"])


class BadCheckout(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        _, cls.rep = lint(CHECKOUT)
        cls.found = rules(cls.rep)

    def test_expected_rules_fire(self):
        expected = {
            "zoom-disabled", "nav-overload", "placeholder-as-label", "autocomplete-missing", "input-type-generic",
            "strict-pattern", "form-long", "select-overload", "multiple-primary-cta", "small-target",
            "input-font-small", "focus-outline-removed", "disabled-submit", "native-dialog-interrupt",
            "async-no-feedback", "hover-only", "div-button", "image-no-dimensions", "slow-animation",
            "reduced-motion-missing", "tiny-text", "generic-button-label", "color-sprawl",
            "dark-pattern-urgency", "dark-pattern-precheck", "dark-pattern-confirmshaming", "autoplay-carousel",
        }
        self.assertEqual(expected - self.found, set())

    def test_every_finding_cites_a_law(self):
        for f in self.rep["findings"]:
            self.assertTrue(f["laws"], f)
            for law in f["laws"]:
                self.assertIn(law, uxl_lint.LAWS)
            self.assertIn("§", f["citation"])

    def test_score_is_low(self):
        self.assertLess(self.rep["score"], 40)

    def test_fail_on_exit_code(self):
        code, _ = lint(CHECKOUT, extra=("--fail-on", "major"))
        self.assertEqual(code, 1)
        code, _ = lint(os.path.join(FIX, "good"), extra=("--fail-on", "minor"))
        self.assertEqual(code, 0)


class ReactBad(unittest.TestCase):
    def test_tailwind_and_jsx_rules(self):
        _, rep = lint(os.path.join(FIX, "react-bad"))
        expected = {"async-no-feedback", "div-button", "focus-outline-removed", "input-font-small", "nav-overload",
                    "placeholder-as-label", "disabled-submit", "generic-button-label", "hover-only",
                    "reduced-motion-missing", "small-target", "tiny-text"}
        self.assertEqual(expected - rules(rep), set())


class Snippets(unittest.TestCase):
    def test_viewport_missing(self):
        rep = lint_snippet("a.html", "<html><head><title>x</title></head><body></body></html>")
        self.assertIn("viewport-missing", rules(rep))

    def test_label_for_suppresses_placeholder_finding(self):
        rep = lint_snippet("a.html", '<label for="e">Email</label><input id="e" type="email" autocomplete="email" placeholder="you@x.com">')
        self.assertNotIn("placeholder-as-label", rules(rep))
        self.assertNotIn("input-unlabeled", rules(rep))

    def test_wrapped_label_counts(self):
        rep = lint_snippet("a.html", '<label>Name <input name="name" autocomplete="name"></label>')
        self.assertFalse(rules(rep) & {"input-unlabeled", "placeholder-as-label"})

    def test_suppression_comment(self):
        rep = lint_snippet("a.html", '<!-- uxl-ignore div-button -->\n<div onclick="go()">Go</div>')
        self.assertNotIn("div-button", rules(rep))

    def test_footer_nav_not_counted(self):
        links = "".join(f'<a href="/{i}">L{i}</a>' for i in range(12))
        rep = lint_snippet("a.html", f'<footer><nav aria-label="Footer">{links}</nav></footer>')
        self.assertNotIn("nav-overload", rules(rep))

    def test_shadcn_input_responsive_text_ok(self):
        rep = lint_snippet("a.tsx", '<Label htmlFor="q">Q</Label><Input id="q" className="text-base md:text-sm" />')
        self.assertNotIn("input-font-small", rules(rep))

    def test_focus_visible_replacement_ok(self):
        rep = lint_snippet("a.css", "button:focus { outline: none; }\nbutton:focus-visible { outline: 2px solid blue; }")
        self.assertNotIn("focus-outline-removed", rules(rep))

    def test_hover_with_focus_twin_ok(self):
        rep = lint_snippet("a.css", ".menu:hover .sub, .menu:focus-within .sub { display: block; }")
        self.assertNotIn("hover-only", rules(rep))

    def test_hover_in_hover_media_ok(self):
        rep = lint_snippet("a.css", "@media (hover: hover) { .card:hover .actions { opacity: 1; } }")
        self.assertNotIn("hover-only", rules(rep))

    def test_loader_animation_not_slow(self):
        rep = lint_snippet("a.css", ".spinner { animation: spin 1200ms linear infinite; }")
        self.assertNotIn("slow-animation", rules(rep))

    def test_backdrop_click_is_not_div_button(self):
        rep = lint_snippet("a.tsx", '<div aria-hidden className="fixed inset-0 bg-black/40" onClick={onClose} />')
        self.assertNotIn("div-button", rules(rep))

    def test_grouped_nav_array_not_overloaded(self):
        items = ",\n".join(f'  {{ label: "L{i}", href: "/{i}", section: "s{i % 3}" }}' for i in range(14))
        rep = lint_snippet("a.tsx", f"const NAV_ITEMS = [\n{items}\n];\nexport const X = () => <nav />;")
        self.assertNotIn("nav-overload", rules(rep))

    def test_flat_nav_array_overloaded(self):
        items = ",\n".join(f'  {{ label: "L{i}", href: "/{i}" }}' for i in range(10))
        rep = lint_snippet("a.tsx", f"const navItems = [\n{items}\n];\nexport const X = () => <nav />;")
        self.assertIn("nav-overload", rules(rep))

    def test_repeated_same_primary_action_ok(self):
        btn = '<a href="#signup" class="btn btn-primary">Get early access</a>'
        rep = lint_snippet("a.html", f"<header>{btn}</header><main>{btn}</main><footer>{btn}</footer>")
        self.assertNotIn("multiple-primary-cta", rules(rep))

    def test_honeypot_field_ignored(self):
        rep = lint_snippet("a.html", '<div class="hp" aria-hidden="true"><label>Leave empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>')
        self.assertFalse(rules(rep) & {"input-type-generic", "autocomplete-missing", "input-unlabeled"})

    def test_postal_code_with_autocomplete_ok(self):
        rep = lint_snippet("a.html", '<label for="z">Postal code</label><input id="z" name="zip" type="text" autocomplete="postal-code">')
        self.assertNotIn("input-type-generic", rules(rep))

    def test_icon_inside_button_not_small_target(self):
        rep = lint_snippet("a.css", ".btn { min-height: 48px; }\n.btn svg { width: 20px; height: 20px; }")
        self.assertNotIn("small-target", rules(rep))

    def test_small_button_still_flagged(self):
        rep = lint_snippet("a.css", ".toolbar .btn { height: 28px; }")
        self.assertIn("small-target", rules(rep))

    def test_fetch_in_comment_is_not_async(self):
        rep = lint_snippet("a.html", "<form id=f></form><script>f.onsubmit=()=>{ // TODO: fetch('/api/x')\n show(); }</script>")
        self.assertNotIn("async-no-feedback", rules(rep))

    def test_ends_in_prose_is_not_urgency(self):
        rep = lint_snippet("a.html", "<p>Every row ends in the same filled button.</p>")
        self.assertNotIn("dark-pattern-urgency", rules(rep))

    def test_countdown_copy_is_urgency(self):
        for copy in ("Sale ends in 2 hours", 'Deal ends in <span id="t">09:59</span>'):
            rep = lint_snippet("a.html", f"<p>{copy}</p>")
            self.assertIn("dark-pattern-urgency", rules(rep), copy)

    def test_menu_toggle_ignored_by_audit_is_documented(self):
        self.assertIn("isToggle", open(os.path.join(ROOT, "skills", "ux-lawyer", "scripts", "uxl_audit.mjs")).read())

    def test_list_rules(self):
        buf = io.StringIO()
        with redirect_stdout(buf):
            self.assertEqual(uxl_lint.main(["--list-rules"]), 0)
        for rid in uxl_lint.RULES:
            self.assertIn(rid, buf.getvalue())


if __name__ == "__main__":
    unittest.main()
