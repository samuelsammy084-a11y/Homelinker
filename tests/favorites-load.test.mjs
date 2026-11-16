import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

test("favorites distinguishes a failed owner-scoped query from a successful retry", async () => {
  const source = readFileSync(new URL("../app/favorites/page.tsx", import.meta.url), "utf8");
  const file = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const page = file.statements.find((node) => node.name?.getText(file) === "FavoritesPage");
  const callback = page.body.statements
    .flatMap((node) => node.declarationList?.declarations ?? [])
    .find((node) => node.name.getText(file) === "loadFavorites").initializer.arguments[0];
  const { outputText } = ts.transpileModule("(" + callback.getText(file) + ")", {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  });

  let result = { error: new Error("Temporary query outage") };
  let failed;
  let loading;
  let properties;
  const load = runInNewContext(outputText, {
    loadRequest: { current: 0 },
    supabase: {
      auth: { getUser: async () => ({ data: { user: { id: "owner" } } }) },
      from: (table) => {
        assert.equal(table, "favorites");
        return { select: () => ({ eq: async (key, value) => {
          assert.equal(key, "user_id");
          assert.equal(value, "owner");
          return result;
        } }) };
      },
    },
    setLoading: (value) => { loading = value; },
    setLoadFailed: (value) => { failed = value; },
    setSignedIn() {},
    setProperties: (value) => { properties = value; },
    console: { error() {} },
  });

  await load();
  assert.equal(failed, true);
  assert.equal(loading, false);

  result = { data: [{ properties: { id: 1 } }] };
  await load();
  assert.equal(failed, false);
  assert.equal(loading, false);
  assert.equal(properties[0].id, 1);
});
