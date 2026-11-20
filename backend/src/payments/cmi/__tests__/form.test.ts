import { describe, expect, it } from "vitest";
import { escapeHtml, renderAutoSubmitPage } from "..";

describe("renderAutoSubmitPage", () => {
  const html = renderAutoSubmitPage("https://gateway.example.test/fim/est3Dgate?a=1&b=2", [
    ["email", `x"><script>alert(1)</script>`],
    ["BillToName", "O'Brien & Co"],
    ["HASH", "abc+/="],
  ]);

  it("escapes names and values (no HTML injection)", () => {
    expect(html).toContain(
      'value="x&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;"',
    );
    expect(html).toContain('value="O&#39;Brien &amp; Co"');
    expect(html).toContain('action="https://gateway.example.test/fim/est3Dgate?a=1&amp;b=2"');
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  it("is UTF-8, has no external assets, and a nameless submit button", () => {
    expect(html).toContain('<meta charset="utf-8">');
    expect(html).not.toMatch(/\s(src|href)=/);
    expect(html).toMatch(/<button type="submit">Continuer vers le paiement<\/button>/);
    expect(html).not.toMatch(/<button[^>]*\sname=/);
  });

  it("escapeHtml covers & < > \" '", () => {
    expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  });
});
