import { Location } from "simple-react-router";
import * as models from "../../main/Models";
import { alt } from "../../main/alt";
import { makeDiseaseLookup } from "../../main/stores/MainStore";

// You can see what's inside this by copying and pasting it to http://jwt.io
// Also its contents are verified by AuthStoreTests handles logIn event
export const sampleToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LnVzZXIiLCJwZXJtaXNzaW9ucyI6InAxLHAyIiwicm9sZXMiOiIqL3JvbGUsbW9kZWxsaW5nLWdyb3VwOnRlc3QuZ3JvdXAvbWVtYmVyIn0.Kumqt_HrFKgZEcSVfdLDDW_ALSVIVtLS8Q_HF8KBdbltLjaMHsK9xt_nxujyykQL06apiwOeePIRU6AqDg4uEK_vFxHXxMrKsWZ5SClAG6j48TXPwkLqX4Wk45FMZR18wGvJZtD9cK-yyeJBoGY8vy-j7NtV2MWzJM-ZZJ7iYDQ";

export function mockLocation(params?: any): Location<undefined> {
    return {
        hash: "hash",
        params: params || null,
        pathName: "/some/path",
        query: null
    };
}

export function setupMainStore(diseases: models.Disease[]) {
    alt.bootstrap(JSON.stringify({
        MainStore: {
            diseases: makeDiseaseLookup(diseases)
        }
    }));
}

export function mockEvent() {
    return {
        preventDefault: () => {
        }
    };
}