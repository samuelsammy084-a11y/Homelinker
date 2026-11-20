import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../app/post-listing/components/LocationStep.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
});

function* elements(node) {
  if (Array.isArray(node)) {
    for (const child of node) yield* elements(child);
  } else if (node && typeof node === "object") {
    yield node;
    yield* elements(node.props.children);
  }
}

test("manual addresses can continue without a pin and address edits clear stale pins", () => {
  const state = [];
  let hookIndex = 0;
  const jsx = (type, props) => ({ type, props });
  const mapPicker = Symbol("map picker");
  const modules = {
    "react/jsx-runtime": { jsx, jsxs: jsx },
    "next/dynamic": { default: () => mapPicker },
    react: {
      useState(initial) {
        const index = hookIndex++;
        if (!(index in state)) state[index] = initial;
        return [state[index], (next) => {
          state[index] = typeof next === "function" ? next(state[index]) : next;
        }];
      },
    },
    "lucide-react": {},
  };
  const exports = {};
  runInNewContext(outputText, { exports, require: (name) => modules[name] });
  const props = {
    province: "Gauteng",
    city: "Johannesburg",
    suburb: "",
    address: "Example address",
    latitude: null,
    longitude: null,
  };
  let continued = 0;
  props.onNext = () => { continued++; };
  for (const key of ["province", "city", "suburb", "address", "latitude", "longitude"]) {
    props["set" + key[0].toUpperCase() + key.slice(1)] = (value) => { props[key] = value; };
  }

  const render = () => {
    hookIndex = 0;
    return [...elements(exports.default(props))];
  };
  const control = (tree, text) => tree.find((node) => node.props.children === text);

  let tree = render();
  assert.equal(tree.some((node) => node.type === mapPicker), false);
  const next = control(tree, "Continue →");
  assert.equal(next.props.disabled, false);
  next.props.onClick();
  assert.equal(continued, 1);

  control(tree, "Set a map pin (optional)").props.onClick();
  tree = render();
  const map = tree.find((node) => node.type === mapPicker);
  map.props.setLatitude(-26.2);
  map.props.setLongitude(28.04);

  tree.find((node) => node.props.autoComplete === "street-address")
    .props.onChange({ target: { value: "Updated address" } });
  assert.equal(props.address, "Updated address");
  assert.equal(props.latitude, null);
  assert.equal(props.longitude, null);
  assert.equal(control(render(), "Continue →").props.disabled, false);
});
