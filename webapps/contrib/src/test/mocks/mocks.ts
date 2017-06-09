import { Location } from "simple-react-router";
import * as models from "../../main/models/Generated";
import { alt } from "../../main/alt";
import { makeLookup } from "../../main/stores/Loadable";

export function mockLocation<T>(params?: T): Location<T> {
    return {
        hash: "hash",
        params: params || null,
        pathName: "/some/path",
        query: null
    };
}

export function setupMainStore(config: {
    diseases?: models.Disease[],
    groups?: models.ModellingGroup[]
})
{
    alt.bootstrap(JSON.stringify({
        MainStore: {
            diseases: makeLookup<models.Disease>(config.diseases),
            modellingGroups: makeLookup<models.ModellingGroup>(config.groups),
        }
    }));
}

export function mockEvent() {
    return {
        preventDefault: () => {
        }
    };
}