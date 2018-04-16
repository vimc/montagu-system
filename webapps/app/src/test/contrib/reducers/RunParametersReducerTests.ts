import { expect } from "chai";

import { runParametersReducer, runParametersInitialState } from "../../../main/contrib/reducers/runParametersReducer";
import { RunParametersTypes } from "../../../main/contrib/actionTypes/RunParametersTypes";
import {mockModelRunParameterSet} from "../../mocks/mockModels";

const testModelRunParametersSet = mockModelRunParameterSet();

describe('Run Parameters reducer tests', () => {
    it('set fetched model run parameters set', () => {
        expect(runParametersReducer(undefined, {
            type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED,
            data: [testModelRunParametersSet]
        })).to.eql({...runParametersInitialState, sets: [testModelRunParametersSet]});
    });



})