import { DOMWindow, JSDOM } from "jsdom";
import { configure } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

const jsdom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost"
});
const { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target)
  });
}

global["window"] = window as DOMWindow & typeof globalThis;
global["document"] = window.document;
global["navigator"] = {
  userAgent: "node.js"
} as Navigator;
global["requestAnimationFrame"] = function(callback) {
  setTimeout(callback, 0);
  return 0;
};
global["cancelAnimationFrame"] = function(id) {
  clearTimeout(id);
};
copyProps(window, global);

// Ignore imported stylesheets.
let noop = () => {};
require.extensions[".scss"] = noop;
