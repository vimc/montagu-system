import { ResponsibilityFetchParameters, sources } from "../../main/sources/Sources";
import { mockResponsibilitySet } from "../mocks/mockModels";
import { FetchHelper } from "./helpers";
import * as actionHelpers from "../actionHelpers";

import { responsibilityActions } from "../../main/actions/ResponsibilityActions";

describe("ResponsibilityFetch", () => {
    afterEach(() => {
        actionHelpers.restoreDispatch();
    });

    new FetchHelper<ResponsibilityFetchParameters>({
        source: sources.responsibilities,
        fetchAction: x => responsibilityActions.fetch(x),
        params: { groupId: "group-1", touchstoneId: "touchstone-id" },

        actionNamespace: "ResponsibilityActions",
        successAction: "updateResponsibilities",
        failAction: "fetchFailed",

        makePayload: () => mockResponsibilitySet()
    }).addTestsToMocha();
});