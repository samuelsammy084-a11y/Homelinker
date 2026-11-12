import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import assert from "node:assert/strict";
import { test } from "node:test";
import ts from "typescript";

const file = ts.createSourceFile("page.tsx", readFileSync(new URL("../app/post-listing/page.tsx", import.meta.url), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const page = file.statements.find(node => node.name?.text === "PostListingPage");
const publish = page.body.statements.find(node => node.name?.text === "publishListing");
const code = ts.transpileModule(publish.getText(file), { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;

function fixture({ missingSession, failUpload, blockedStorage, response = 200 } = {}) {
  const calls = [];
  const image = { type: "image/jpeg", size: 100, name: "test.jpg" };
  const publishInProgress = { current: false };
  let uploads = 0;
  const storage = {
    async upload() {
      calls.push("upload");
      if (++uploads === failUpload) throw new Error("Network failure");
      return {};
    },
    async remove(paths) { calls.push(["remove", ...paths]); return {}; },
    getPublicUrl: () => ({ data: { publicUrl: "https://example.test/photo.jpg" } }),
  };
  const query = { maybeSingle: async () => ({ data: null }) };
  for (const method of ["select", "eq", "ilike", "limit"]) query[method] = () => query;
  const run = runInNewContext(code + "\npublishListing;", {
    publishInProgress, images: [image, image], listingType: "rent",
    propertyType: "Apartment", province: "Gauteng", city: "Roodepoort",
    suburb: "Florida", address: "Test address", latitude: -26, longitude: 28,
    price: "2500", bedrooms: "1", bathrooms: "1", parking: "0",
    deposit: "", availableFrom: "", floorSize: "", landSize: "", condition: "",
    rates: "", levies: "", furnished: false, petFriendly: false,
    title: "Test property listing", description: "A synthetic property listing for regression testing.",
    phoneNumber: "0821234567",
    crypto: { randomUUID: () => String(uploads + 1) },
    imageCompression: async image => image,
    setPublishing: () => {}, showError: title => calls.push(title),
    console: { error() {}, warn() {} },
    sessionStorage: { setItem() { if (blockedStorage) throw new Error("Storage unavailable"); } },
    router: { push: path => calls.push(path) },
    fetch: async () => {
      calls.push("create");
      return { status: response, ok: response === 200, json: async () => response === 200 ? { propertyId: 1 } : {} };
    },
    supabase: {
      storage: { from: () => storage }, from: () => query,
      auth: {
        getSession: async () => ({ data: { session: missingSession ? null : { access_token: "test" } } }),
        getUser: async () => ({ data: { user: { id: "test-owner" } } }),
      },
    },
  });
  return { run, calls, publishInProgress };
}

test("duplicate submit makes only one listing request", async () => {
  const { run, calls } = fixture();
  await Promise.all([run(), run()]);
  assert.deepEqual(calls, ["upload", "upload", "create", "/pricing?propertyId=1"]);
});
test("missing session prevents all uploads", async () => {
  const { run, calls } = fixture({ missingSession: true });
  await run();
  assert.deepEqual(calls, ["Login Required"]);
});
test("thrown upload failure cleans up photos already uploaded", async () => {
  const { run, calls, publishInProgress } = fixture({ failUpload: 2 });
  await run();
  assert.deepEqual(calls, ["upload", "upload", "Unexpected Error", ["remove", "test-owner/1-test.jpg"]]);
  assert.equal(publishInProgress.current, false);
});
test("confirmed request rejection cleans up uploaded photos", async () => {
  const { run, calls } = fixture({ response: 409 });
  await run();
  assert.deepEqual(calls.at(-1), ["remove", "test-owner/1-test.jpg", "test-owner/2-test.jpg"]);
});
test("ambiguous server error retains photos in case the listing exists", async () => {
  const { run, calls } = fixture({ response: 500 });
  await run();
  assert.deepEqual(calls, ["upload", "upload", "create", "Something Went Wrong"]);
});


test("a saved draft reaches plan selection even when browser storage is blocked", async () => {
  const { run, calls } = fixture({ blockedStorage: true });
  await run();
  assert.deepEqual(calls, ["upload", "upload", "create", "/pricing?propertyId=1"]);
});
