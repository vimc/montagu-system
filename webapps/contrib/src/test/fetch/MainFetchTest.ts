import { sources, NoParameters } from '../../main/sources/Sources';
import * as mocks from '../mocks';
import { FetchHelper } from './helpers';
import * as actionHelpers from '../actionHelpers';

import { mainActions } from '../../main/actions/MainActions';

let helper: FetchHelper<NoParameters>;

describe("MainFetch", () => {
    afterEach(() => {
        actionHelpers.restoreDispatch();
    });

    new FetchHelper<NoParameters>({
        source: sources.diseases,
        fetchAction: () => mainActions.fetch({}),
        params: {},

        actionNamespace: "MainActions", 
        successAction: "receiveDiseases",
        failAction: "fetchFailed",

        makePayload: () => [ 
            mocks.mockDisease(), 
            mocks.mockDisease()
        ]
    }).addTestsToMocha();
});