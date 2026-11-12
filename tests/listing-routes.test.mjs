import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

function route(name, { user = "owner", profile, property, fetch } = {}) {
  const calls = [];
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: "http://localhost:54321",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test",
    SUPABASE_SERVICE_ROLE_KEY: "test",
    STRIPE_SECRET_KEY: "test",
    DIDIT_API_KEY: "test",
    DIDIT_WORKFLOW_ID: "test",
  };
  const exports = {};
  const client = {
    auth: { getUser: async () => ({ data: { user: { id: user } } }) },
    from(table) {
      const query = {};
      for (const method of ["select", "eq", "in", "gt", "order", "limit", "update", "insert"]) {
        query[method] = (...args) => {
          calls.push([table, method, ...args]);
          return query;
        };
      }
      query.maybeSingle = query.single = async () => ({
        data: {
          profiles: profile,
          advertiser_subscriptions: { id: 1, user_id: user },
          properties: property,
        }[table],
      });
      return query;
    },
  };
  const source = readFileSync(new URL("../app/api/" + name + "/route.ts", import.meta.url), "utf8");
  runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports, process: { env }, console, fetch, AbortSignal,
    require: (id) => ({
      "next/server": { NextResponse: Response },
      "@supabase/supabase-js": { createClient: () => client },
      stripe: class { constructor() { assert.fail("Unexpected Stripe access"); } },
    })[id],
  });
  return {
    calls,
    post: (body, authenticated = true) => exports.POST(new Request("http://localhost", {
      method: "POST",
      headers: authenticated ? { Authorization: "Bearer test" } : {},
      body: JSON.stringify(body),
    })),
  };
}

const listing = {
  listing_type: "rent", property_type: "Apartment", title: "Test apartment",
  province: "Gauteng", city: "Roodepoort", price: 1000,
  image_urls: ["https://example.test/photo.jpg"],
  user_id: "other", plan: "pro", featured: true, verified: true,
  verification_status: "verified", status: "active",
};

test("unauthenticated listing creation fails without database access", async () => {
  const api = route("create-listing");
  assert.equal((await api.post(listing, false)).status, 401);
  assert.equal(api.calls.length, 0);
});

test("authenticated users can create unverified free drafts without a profile lookup", async () => {
  const api = route("create-listing", { property: { id: 1, status: "pending" } });
  assert.ok((await api.post(listing)).ok);
  assert.ok(api.calls.every(([table]) => table === "properties"));
  const [, , inserted] = api.calls.find(([, method]) => method === "insert");
  assert.equal(inserted.user_id, "owner");
  assert.equal(inserted.plan, "free");
  assert.equal(inserted.status, "pending");
  assert.equal(inserted.verified, false);
  assert.equal(inserted.featured, false);
  assert.equal(inserted.verification_status, undefined);
});

test("free activation requires ownership and sets free fields", async () => {
  const property = { id: 1, status: "pending", user_id: "owner", plan: "free", payment_status: "free" };
  const foreign = route("activate-free-listing", { property, user: "other" });
  assert.equal((await foreign.post({ propertyId: 1 })).status, 403);
  assert.ok(foreign.calls.every(([, method]) => method !== "update"));
  const owner = route("activate-free-listing", { property });
  assert.ok((await owner.post({ propertyId: 1 })).ok);
  const [, , updated] = owner.calls.find(([, method]) => method === "update");
  assert.equal(updated.status, "active");
  assert.equal(updated.plan, "free");
  assert.equal(updated.featured, false);
  assert.equal(updated.verified, undefined);
});

for (const plan of ["premium", "pro"]) {
  test(plan + " checkout rejects an unverified advertiser before Stripe access", async () => {
    const api = route("create-checkout-session", {
      profile: { is_verified: false, verification_status: "pending" },
    });
    const res = await api.post({ plan, propertyId: 1 });
    assert.equal(res.status, 403);
    assert.equal((await res.json()).code, "IDENTITY_VERIFICATION_REQUIRED");
  });
}

for (const action of ["promote", "make_priority"]) {
  test(action + " requires current identity verification even with active Pro", async () => {
    const api = route("pro/manage-listing", {
      property: { id: 1, status: "active", user_id: "owner" },
      profile: { is_verified: true, verification_status: "pending" },
    });
    const res = await api.post({ action, propertyId: 1 });
    assert.equal(res.status, 403);
    assert.equal((await res.json()).code, "IDENTITY_VERIFICATION_REQUIRED");
    assert.ok(api.calls.every(([, method]) => method !== "update"));
  });
}

test("verification handles an empty provider result without saving a session", async () => {
  const api = route("verification/start", {
    profile: { is_verified: false },
    fetch: async () => Response.json(null),
  });
  assert.equal((await api.post({})).status, 502);
  assert.ok(api.calls.every(([, method]) => method !== "insert"));
});
