import { Location } from "simple-react-router";
import * as models from "../../main/Models";
import { alt } from "../../main/alt";
import { makeDiseaseLookup } from "../../main/stores/MainStore";

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