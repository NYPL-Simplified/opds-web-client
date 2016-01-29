const tsc = require('typescript');

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      return tsc.transpile(
        src,
        {
          module: tsc.ModuleKind.CommonJS,
          // module: tsc.ModuleKind.ES6,
          // target: tsc.ScriptTarget.ES6,
          jsx: tsc.JsxEmit.React
        },
        path,
        []
      );
    }
    return src;
  }
};