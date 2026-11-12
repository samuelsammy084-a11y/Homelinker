import assert from "node:assert/strict";
import { test } from "node:test";
import { authReturnPath } from "../lib/auth-return-path.ts";

test("preserves internal return paths and their query strings", () => {
  const path = "/properties?city=Roodepoort#results";
  assert.equal(authReturnPath(path), path);
});

test("defaults to the dashboard for missing and invalid return paths", () => {
  assert.equal(authReturnPath(null), "/dashboard");
  assert.equal(authReturnPath("properties"), "/dashboard");
  assert.equal(authReturnPath("https://example.test"), "/dashboard");
});
