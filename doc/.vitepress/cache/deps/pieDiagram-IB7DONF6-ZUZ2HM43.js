import {
  populateCommonDb
} from "./chunk-VKR55RGS.js";
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
  selectSvgElement
} from "./chunk-VZBYNM2G.js";
import "./chunk-QLY7FPWO.js";
import "./chunk-WD7LCGZD.js";
import {
  cleanAndMerge,
  parseFontSize
} from "./chunk-XB3H232M.js";
import "./chunk-OPPAJXN6.js";
import {
  __name,
  arc_default,
  clear,
  configureSvgSize,
  defaultConfig_default,
  getAccDescription,
  getAccTitle,
  getConfig2,
  getDiagramTitle,
  log,
  ordinal,
  pie_default,
  setAccDescription,
  setAccTitle,
  setDiagramTitle
} from "./chunk-K7WB6PZO.js";
import "./chunk-DXC7KYZB.js";
import "./chunk-FDBJFBLO.js";

// node_modules/.store/mermaid@11.6.0/node_modules/mermaid/dist/chunks/mermaid.core/pieDiagram-IB7DONF6.mjs
var DEFAULT_PIE_CONFIG = defaultConfig_default.pie;
var DEFAULT_PIE_DB = {
  sections: /* @__PURE__ */ new Map(),
  showData: false,
  config: DEFAULT_PIE_CONFIG
};
var sections = DEFAULT_PIE_DB.sections;
var showData = DEFAULT_PIE_DB.showData;
var config = structuredClone(DEFAULT_PIE_CONFIG);
var getConfig22 = __name(() => structuredClone(config), "getConfig");
var clear2 = __name(() => {
  sections = /* @__PURE__ */ new Map();
  showData = DEFAULT_PIE_DB.showData;
  clear();
}, "clear");
var addSection = __name(({ label, value }) => {
  if (!sections.has(label)) {
    sections.set(label, value);
    log.debug(`added new section: ${label}, with value: ${value}`);
  }
}, "addSection");
var getSections = __name(() => sections, "getSections");
var setShowData = __name((toggle) => {
  showData = toggle;
}, "setShowData");
var getShowData = __name(() => showData, "getShowData");
var db = {
  getConfig: getConfig22,
  clear: clear2,
  setDiagramTitle,
  getDiagramTitle,
  setAccTitle,
  getAccTitle,
  setAccDescription,
  getAccDescription,
  addSection,
  getSections,
  setShowData,
  getShowData
};
var populateDb = __name((ast, db2) => {
  populateCommonDb(ast, db2);
  db2.setShowData(ast.showData);
  ast.sections.map(db2.addSection);
}, "populateDb");
var parser = {
  parse: __name(async (input) => {
    const ast = await parse("pie", input);
    log.debug(ast);
    populateDb(ast, db);
  }, "parse")
};
var getStyles = __name((options) => `
  .pieCircle{
    stroke: ${options.pieStrokeColor};
    stroke-width : ${options.pieStrokeWidth};
    opacity : ${options.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${options.pieOuterStrokeColor};
    stroke-width: ${options.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${options.pieTitleTextSize};
    fill: ${options.pieTitleTextColor};
    font-family: ${options.fontFamily};
  }
  .slice {
    font-family: ${options.fontFamily};
    fill: ${options.pieSectionTextColor};
    font-size:${options.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${options.pieLegendTextColor};
    font-family: ${options.fontFamily};
    font-size: ${options.pieLegendTextSize};
  }
`, "getStyles");
var pieStyles_default = getStyles;
var createPieArcs = __name((sections2) => {
  const pieData = [...sections2.entries()].map((element) => {
    return {
      label: element[0],
      value: element[1]
    };
  }).sort((a, b) => {
    return b.value - a.value;
  });
  const pie = pie_default().value(
    (d3Section) => d3Section.value
  );
  return pie(pieData);
}, "createPieArcs");
var draw = __name((text, id, _version, diagObj) => {
  log.debug("rendering pie chart\n" + text);
  const db2 = diagObj.db;
  const globalConfig = getConfig2();
  const pieConfig = cleanAndMerge(db2.getConfig(), globalConfig.pie);
  const MARGIN = 40;
  const LEGEND_RECT_SIZE = 18;
  const LEGEND_SPACING = 4;
  const height = 450;
  const pieWidth = height;
  const svg = selectSvgElement(id);
  const group = svg.append("g");
  group.attr("transform", "translate(" + pieWidth / 2 + "," + height / 2 + ")");
  const { themeVariables } = globalConfig;
  let [outerStrokeWidth] = parseFontSize(themeVariables.pieOuterStrokeWidth);
  outerStrokeWidth ?? (outerStrokeWidth = 2);
  const textPosition = pieConfig.textPosition;
  const radius = Math.min(pieWidth, height) / 2 - MARGIN;
  const arcGenerator = arc_default().innerRadius(0).outerRadius(radius);
  const labelArcGenerator = arc_default().innerRadius(radius * textPosition).outerRadius(radius * textPosition);
  group.append("circle").attr("cx", 0).attr("cy", 0).attr("r", radius + outerStrokeWidth / 2).attr("class", "pieOuterCircle");
  const sections2 = db2.getSections();
  const arcs = createPieArcs(sections2);
  const myGeneratedColors = [
    themeVariables.pie1,
    themeVariables.pie2,
    themeVariables.pie3,
    themeVariables.pie4,
    themeVariables.pie5,
    themeVariables.pie6,
    themeVariables.pie7,
    themeVariables.pie8,
    themeVariables.pie9,
    themeVariables.pie10,
    themeVariables.pie11,
    themeVariables.pie12
  ];
  const color = ordinal(myGeneratedColors);
  group.selectAll("mySlices").data(arcs).enter().append("path").attr("d", arcGenerator).attr("fill", (datum) => {
    return color(datum.data.label);
  }).attr("class", "pieCircle");
  let sum = 0;
  sections2.forEach((section) => {
    sum += section;
  });
  group.selectAll("mySlices").data(arcs).enter().append("text").text((datum) => {
    return (datum.data.value / sum * 100).toFixed(0) + "%";
  }).attr("transform", (datum) => {
    return "translate(" + labelArcGenerator.centroid(datum) + ")";
  }).style("text-anchor", "middle").attr("class", "slice");
  group.append("text").text(db2.getDiagramTitle()).attr("x", 0).attr("y", -(height - 50) / 2).attr("class", "pieTitleText");
  const legend = group.selectAll(".legend").data(color.domain()).enter().append("g").attr("class", "legend").attr("transform", (_datum, index) => {
    const height2 = LEGEND_RECT_SIZE + LEGEND_SPACING;
    const offset = height2 * color.domain().length / 2;
    const horizontal = 12 * LEGEND_RECT_SIZE;
    const vertical = index * height2 - offset;
    return "translate(" + horizontal + "," + vertical + ")";
  });
  legend.append("rect").attr("width", LEGEND_RECT_SIZE).attr("height", LEGEND_RECT_SIZE).style("fill", color).style("stroke", color);
  legend.data(arcs).append("text").attr("x", LEGEND_RECT_SIZE + LEGEND_SPACING).attr("y", LEGEND_RECT_SIZE - LEGEND_SPACING).text((datum) => {
    const { label, value } = datum.data;
    if (db2.getShowData()) {
      return `${label} [${value}]`;
    }
    return label;
  });
  const longestTextWidth = Math.max(
    ...legend.selectAll("text").nodes().map((node) => (node == null ? void 0 : node.getBoundingClientRect().width) ?? 0)
  );
  const totalWidth = pieWidth + MARGIN + LEGEND_RECT_SIZE + LEGEND_SPACING + longestTextWidth;
  svg.attr("viewBox", `0 0 ${totalWidth} ${height}`);
  configureSvgSize(svg, height, totalWidth, pieConfig.useMaxWidth);
}, "draw");
var renderer = { draw };
var diagram = {
  parser,
  db,
  renderer,
  styles: pieStyles_default
};
export {
  diagram
};
//# sourceMappingURL=pieDiagram-IB7DONF6-ZUZ2HM43.js.map
