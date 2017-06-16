import { Location } from "simple-react-router";
import * as models from "../../main/shared/models/Generated";
import { alt } from "../../main/shared/alt";
import { makeLookup } from "../../main/contrib/stores/Loadable";

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