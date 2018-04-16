import { expect } from "chai";

import {estimatesInitialState, estimatesReducer} from "../../../main/contrib/reducers/estimatesReducer";
import {EstimatesTypes} from "../../../main/contrib/actionTypes/EstimatesTypes";

describe('Demographic reducer tests', () => {
    it('sets redirect path to the state', () => {
        expect(estimatesReducer(undefined, {
            type: EstimatesTypes.ESTIMATES_SET_REDIRECT_PATH,
            data: '/some/path/'
        })).to.eql(
            {
                redirectPath: '/some/path/',
                token: null
            }
        )
    })

    it('sets empty redirect path to the state', () => {
        expect(estimatesReducer(undefined, {
            type: EstimatesTypes.ESTIMATES_SET_REDIRECT_PATH,
            data: null
        })).to.eql(
            {
                redirectPath: null,
                token: null
            }
        )
    })

    it('sets fetched token to the state', () => {
        expect(estimatesReducer(undefined, {
            type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED,
            data: 'test-token'
        })).to.eql(
            {
                redirectPath: null,
                token: 'test-token'
            }
        )
    })

    it('sets empty fetched token to the state', () => {
        expect(estimatesReducer(undefined, {
            type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED,
            data: null
        })).to.eql(
            {
                redirectPath: null,
                token: null
            }
        )
    })

    it('clears token in the state', () => {
        const state = estimatesInitialState;
        state.token = 'some-token';
        expect(estimatesReducer(state, {
            type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_CLEAR,
        })).to.eql(
            {
                redirectPath: null,
                token: null
            }
        )
    })
})