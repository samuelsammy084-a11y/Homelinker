import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

test("dashboard keeps existing listings on failure and recovers on retry", async () => {
  const source = readFileSync(new URL("../app/dashboard/page.tsx", import.meta.url), "utf8");
  const file = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const page = file.statements.find((node) => node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword));
  const declaration = page.body.statements
    .flatMap((node) => node.declarationList?.declarations ?? [])
    .find((node) => node.name.getText(file) === "loadProperties");
  const callback = declaration.initializer.arguments[0];
  const { outputText } = ts.transpileModule("(" + callback.getText(file) + ")", {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  });

  let properties = [{ id: 1 }];
  const failures = [];
  let result = { error: new Error("Temporary database failure") };
  const query = {
    select: (columns) => {
      assert.doesNotMatch(columns, /show_contact_phone|legacy_popular/);
      return query;
    },
    eq: (column, value) => {
      assert.equal(column, "user_id");
      assert.equal(value, "owner");
      return query;
    },
    order: () => query,
    abortSignal: async () => result,
  };
  const load = runInNewContext(outputText, {
    AbortSignal,
    supabase: { from: () => query },
    setProperties: (data) => { properties = data; },
    setPropertiesFailed: (failed) => failures.push(failed),
    console: { error() {} },
  });

  await load("owner");
  assert.deepEqual(properties, [{ id: 1 }]);
  result = { data: [{ id: 2 }] };
  await load("owner");
  assert.deepEqual(properties, [{ id: 2 }]);
  assert.deepEqual(failures, [true, false]);
});
