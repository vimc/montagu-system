import { NoParameters, sources } from "../../main/sources/Sources";
import { mockTouchstone } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";
import * as actionHelpers from "../actionHelpers";

import { touchstoneActions } from "../../main/actions/TouchstoneActions";

let helper: FetchHelper<NoParameters>;

describe("TouchstoneFetch", () => {
    afterEach(() => {
        actionHelpers.restoreDispatch();
    });

    new FetchHelper<NoParameters>({
        source: sources.touchstones,
        fetchAction: () => touchstoneActions.fetch({}),
        params: {},

        actionNamespace: "TouchstoneActions",
        successAction: "update",
        failAction: "fetchFailed",

        makePayload: () => [
            mockTouchstone({ id: "a" }),
            mockTouchstone({ id: "b" })
        ]
    }).addTestsToMocha();
});