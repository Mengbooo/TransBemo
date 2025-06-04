import {
  parse
} from "./chunk-FGSSDS5H.js";
import "./chunk-WFDMI2OC.js";
import "./chunk-HMWS4MMT.js";
import "./chunk-F3CEVQW6.js";
import "./chunk-7AZNKOTZ.js";
import "./chunk-FG2IK7NR.js";
import "./chunk-XUHTM2RS.js";
import "./chunk-TX25O3KA.js";
import {
  package_default
} from "./chunk-6MRHVRCP.js";
import {
  selectSvgElement
} from "./chunk-VZBYNM2G.js";
import "./chunk-QLY7FPWO.js";
import "./chunk-WD7LCGZD.js";
import {
  __name,
  configureSvgSize,
  log
} from "./chunk-K7WB6PZO.js";
import "./chunk-DXC7KYZB.js";
import "./chunk-FDBJFBLO.js";

// node_modules/.store/mermaid@11.6.0/node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-PH2N3AL5.mjs
var parser = {
  parse: __name(async (input) => {
    const ast = await parse("info", input);
    log.debug(ast);
  }, "parse")
};
var DEFAULT_INFO_DB = { version: package_default.version };
var getVersion = __name(() => DEFAULT_INFO_DB.version, "getVersion");
var db = {
  getVersion
};
var draw = __name((text, id, version) => {
  log.debug("rendering info diagram\n" + text);
  const svg = selectSvgElement(id);
  configureSvgSize(svg, 100, 400, true);
  const group = svg.append("g");
  group.append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
}, "draw");
var renderer = { draw };
var diagram = {
  parser,
  db,
  renderer
};
export {
  diagram
};
//# sourceMappingURL=infoDiagram-PH2N3AL5-XYPJYSBG.js.map
