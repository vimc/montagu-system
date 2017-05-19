const jsdom = require('jsdom');

// We don't actually use jsdom in the tests - we use Enzyme shallow rendering
// However, this keeps the CSS modules happy
const document = jsdom.jsdom('<!doctype html><html><body></body></html>');
const window = document.defaultView;
const g = global;
g.document = document;
g.window = window;

for (var key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;

    g[key] = window[key]
}