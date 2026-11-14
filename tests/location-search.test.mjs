import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const file = ts.createSourceFile("LocationStep.tsx",
  readFileSync(new URL("../app/post-listing/components/LocationStep.tsx", import.meta.url), "utf8"),
  ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const component = file.statements.find((node) => node.name?.text === "LocationStep");
const effect = component.body.statements.find((node) =>
  node.expression?.expression?.getText(file) === "useEffect").expression.arguments[0];
const { outputText } = ts.transpileModule("(" + effect.getText(file) + ")", {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
});

test("an obsolete address search cannot overwrite the newer suggestions", async () => {
  const timers = [];
  const requests = [];
  let suggestions;
  const context = {
    address: "First street", suburb: "", city: "", province: "",
    AbortController,
    window: { setTimeout: (callback) => timers.push(callback), clearTimeout() {} },
    fetch: (_url, { signal }) => new Promise((resolve) => requests.push({ signal, resolve })),
    setSuggestions: (value) => { suggestions = value; },
    setSearchMessage() {},
    setSearching() {},
  };
  const start = runInNewContext(outputText, context);
  const cleanup = start();
  const firstSearch = timers.shift()();
  cleanup();
  assert.equal(requests[0].signal.aborted, true);

  context.address = "Second street";
  start();
  const secondSearch = timers.shift()();
  requests[1].resolve(Response.json([{ display_name: "Second street" }]));
  await secondSearch;
  requests[0].resolve(Response.json([{ display_name: "First street" }]));
  await firstSearch;
  assert.deepEqual(suggestions, [{ display_name: "Second street" }]);
});
