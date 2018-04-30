import { expect } from "chai";

import {estimatesInitialState, estimatesReducer} from "../../../main/contrib/reducers/estimatesReducer";
import {EstimatesTypes} from "../../../main/contrib/actionTypes/EstimatesTypes";

describe('Demographic reducer tests', () => {
    it('sets redirect path', () => {
        expect(estimatesReducer(undefined, {
            type: EstimatesTypes.ESTIMATES_SET_REDIRECT_PATH,
            data: '/some/path/'
        })).to.eql({...estimatesInitialState, redirectPath: '/some/path/'});
    });

    it('sets empty redirect path', () => {
        expect(estimatesReducer(undefined, {
            type: EstimatesTypes.ESTIMATES_SET_REDIRECT_PATH,
            data: null
        })).to.eql(estimatesInitialState);
    });

    it('sets fetched token', () => {
        expect(estimatesReducer(undefined, {
            type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED,
            data: 'test-token'
        })).to.eql({...estimatesInitialState, token: 'test-token'});
    });

    it('sets empty fetched token', () => {
        expect(estimatesReducer(undefined, {
            type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED,
            data: null
        })).to.eql(estimatesInitialState);
    });

    it('clears token', () => {
        expect(estimatesReducer({...estimatesInitialState, token: "some-token"}, {
            type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_CLEAR,
        })).to.eql(estimatesInitialState);
    });
})