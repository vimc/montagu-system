import * as sinon from 'sinon';
import { sources, ResponsibilityFetchParameters } from '../../main/sources/Sources';
import * as mocks from '../mocks';
import { Result, ErrorInfo, Responsibilities } from '../../main/Models';
import { FetchHelper } from './helpers';
import * as actionHelpers from '../actionHelpers';

import { responsibilityActions } from '../../main/actions/ResponsibilityActions';

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

        makePayload: () => mocks.mockResponsibilitySet()
    }).addTestsToMocha();
});