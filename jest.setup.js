// Mock for CSSStyleSheet.replaceSync which is not implemented in JSDOM
// This is needed for tests to run with components that use adoptedStyleSheets
try {
  global.CSSStyleSheet = class {
    constructor() {
      // The constructor is called, so we need to have it.
    }
    replaceSync() {
      // This is a no-op, but it prevents the error.
    }
  };
} catch (e) {
  // In case CSSStyleSheet is not defined at all.
}