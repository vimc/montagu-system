import {mockOnetimeTokenState} from "../../mocks/mockStates";
import {onetimeTokenReducer} from "../../../main/report/reducers/oneTimeTokenReducer";
import {OnetimeTokenActionType} from "../../../main/report/actionTypes/OnetimeTokenActions";
import {mockOneTimeToken} from "../../mocks/mocks";
import {expect} from "chai"

describe('OnetimeToken reducer tests', () => {

    it('adds token to token lookup keyed by url', () => {

        const fakeOldToken = mockOneTimeToken("url");
        const state = mockOnetimeTokenState({tokens: {"url": fakeOldToken}});
        const fakeNewToken = mockOneTimeToken("some/url");
        const result = onetimeTokenReducer(state, {
            type: OnetimeTokenActionType.TOKEN_FETCHED, data: {
                url: "some/url", token: fakeNewToken
            }
        });

        expect(result.tokens["url"]).to.eq(fakeOldToken);
        expect(result.tokens["some/url"]).to.eq(fakeNewToken);

    });
});