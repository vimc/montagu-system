import * as sinon from 'sinon';
import { sources, NoParameters } from '../../main/sources/Sources';
import * as mocks from '../mocks';
import { Result, ErrorInfo, Touchstone } from '../../main/Models';
import { FetchHelper } from './helpers';
import * as actionHelpers from '../actionHelpers';

import { touchstoneActions } from '../../main/actions/TouchstoneActions';

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
            mocks.mockTouchstone({ id: "a" }), 
            mocks.mockTouchstone({ id: "b" })
        ]
    }).addTestsToMocha();
});