import { expect } from "chai";

import {estimatesInitialState, estimatesReducer} from "../../../main/contrib/reducers/estimatesReducer";
import {EstimateTypes} from "../../../main/contrib/actionTypes/EstimateTypes";

describe('Estimates reducer tests', () => {

    it('adds estimates to estimates lookup', () => {
        const fakeBurdens =  {"2000": [{"x": 1, "y": 10000}]};
        const fakeData = {
            setId: 2,
            burdens: fakeBurdens
        };

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.BURDEN_ESTIMATES_FETCHED,
            data: fakeData
        });

        expect(result.burdenOutcomes[2]).to.eq(fakeBurdens)
    })
});