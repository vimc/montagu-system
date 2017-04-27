import { expect } from 'chai';
import alt from '../../main/alt';
import * as mocks from '../mocks';

import { Store } from '../../main/stores/MainStore';
import { mainActions } from '../../main/actions/MainActions';

describe("MainStore", () => {
    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    it("is initially blank", () => {
        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: false,
            diseases: { loaded: false, content: null }
        });
    });

    it("receiveDiseases sets diseases", () => {
        const disease1 = mocks.mockDisease({ id: "d1" });
        const disease2 = mocks.mockDisease({ id: "d2" });
        mainActions.receiveDiseases([ disease1, disease2 ]);

        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: true,
            diseases: {
                loaded: true,
                content: {
                    d1: disease1,
                    d2: disease2,
                }
            }
        });
    });

    it("fetchFailed sets errorMessage", () => {
        mainActions.fetchFailed("message");

        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: "message",
            ready: false,
            diseases: { loaded: false, content: null }
        });
    });
});
