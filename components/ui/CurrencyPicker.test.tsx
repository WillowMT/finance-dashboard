import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { CurrencyPicker } from "./CurrencyPicker";

test("renders an accessible currency control with a polite status region", () => {
  const html = renderToStaticMarkup(<CurrencyPicker current="USD" />);

  expect(html).toContain('aria-label="Currency"');
  expect(html).toContain('aria-live="polite"');
  expect(html).toContain("Saved");
});
