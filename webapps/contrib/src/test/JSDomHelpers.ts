import { jsdom } from 'jsdom';

// We don't actually use jsdom in the tests - we use Enzyme shallow rendering
// However, this keeps the CSS modules happy
export function setupVirtualDOM() {
    const document = jsdom('<!doctype html><html><body></body></html>');
    const window: any = document.defaultView;
    const g: any = global;
    g.document = document;
    g.window = window;

    for (let key in window) {
        if (!window.hasOwnProperty(key)) continue
        if (key in global) continue

        g[key] = window[key]
    }
}