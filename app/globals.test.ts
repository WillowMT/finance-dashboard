import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

test("disables accidental iOS interactions across the app shell", () => {
  expect(css).toContain(":where(body, body *)");
  expect(css).toContain("-webkit-user-select: none");
  expect(css).toContain("-webkit-touch-callout: none");
  expect(css).toContain("-webkit-tap-highlight-color: transparent");
  expect(css).toContain("-webkit-user-drag: none");
});

test("keeps intentional text regions selectable", () => {
  expect(css).toContain('[contenteditable]:not([contenteditable="false"])');
  expect(css).toContain(".copyable");
  expect(css).toContain(".prose");
  expect(css).toContain("-webkit-user-select: text");
  expect(css).toContain("-webkit-touch-callout: default");
});
