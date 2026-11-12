import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

test("public search handles repeated query parameters and empty filters", () => {
  const file = ts.createSourceFile(
    "page.tsx",
    readFileSync(new URL("../app/properties/page.tsx", import.meta.url), "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const normalizer = file.statements.find((node) => node.name?.text === "firstSearchValue");
  const source = ts.transpileModule(normalizer.getText(file), {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const normalize = runInNewContext(source + "\nfirstSearchValue;");
  assert.equal(normalize(["2000", "3000"]), "2000");
  assert.equal(normalize(" Roodepoort "), "Roodepoort");
  assert.equal(normalize([" "]), undefined);
  assert.equal(normalize(undefined), undefined);
});
