import {
  __name
} from "./chunk-K7WB6PZO.js";

// node_modules/.store/mermaid@11.6.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-4BMEZGHF.mjs
function populateCommonDb(ast, db) {
  var _a, _b, _c;
  if (ast.accDescr) {
    (_a = db.setAccDescription) == null ? void 0 : _a.call(db, ast.accDescr);
  }
  if (ast.accTitle) {
    (_b = db.setAccTitle) == null ? void 0 : _b.call(db, ast.accTitle);
  }
  if (ast.title) {
    (_c = db.setDiagramTitle) == null ? void 0 : _c.call(db, ast.title);
  }
}
__name(populateCommonDb, "populateCommonDb");

export {
  populateCommonDb
};
//# sourceMappingURL=chunk-VKR55RGS.js.map
