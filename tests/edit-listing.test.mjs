import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

const file = ts.createSourceFile("page.tsx",
  readFileSync(new URL("../app/edit-listing/[id]/page.tsx", import.meta.url), "utf8"),
  ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const page = file.statements.find((node) => node.name?.text === "EditListingPage");
const handler = page.body.statements.find((node) => node.name?.text === "handleUpdate");
const source = ts.transpileModule(handler.getText(file), {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;

function editFixture(data) {
  const alerts = [];
  const paths = [];
  const filters = [];
  const query = {
    update: () => query,
    eq: (field, value) => { filters.push([field, value]); return query; },
    select: () => query,
    maybeSingle: async () => ({ data, error: null }),
  };
  const update = runInNewContext(source + "\nhandleUpdate;", {
    id: "17", title: "Test flat", description: "Test description", price: "3000",
    province: "Gauteng", city: "Roodepoort", contactNumber: "0821234567",
    propertyType: "Apartment", bedrooms: "", bathrooms: "", parking: "", showContactPhone: false,
    loading: false, setLoading() {},
    supabase: { auth: { getUser: async () => ({ data: { user: { id: "owner" } } }) }, from: () => query },
    alert: (message) => alerts.push(message),
    router: { push: (path) => paths.push(path), refresh() {} },
    console,
  });
  return { update: () => update({ preventDefault() {} }), alerts, paths, filters };
}

test("editing a listing without a matching owned row keeps the editor open", async () => {
  const fixture = editFixture(null);
  await fixture.update();
  assert.match(fixture.alerts[0], /could not be saved/);
  assert.deepEqual(fixture.paths, []);
  assert.deepEqual(fixture.filters, [["id", "17"], ["user_id", "owner"]]);
});

test("editing an owned listing confirms success after a row is returned", async () => {
  const fixture = editFixture({ id: 17 });
  await fixture.update();
  assert.match(fixture.alerts[0], /updated successfully/);
  assert.deepEqual(fixture.paths, ["/dashboard"]);
});
