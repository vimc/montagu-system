import { expect } from "chai";
import alt from "../../main/alt";
import { mockDisease } from "../mocks/mockModels";

import { Store } from "../../main/stores/MainStore";
import { mainActions } from "../../main/actions/MainActions";
import { authActions } from "../../main/actions/AuthActions";

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
        const disease1 = mockDisease({ id: "d1" });
        const disease2 = mockDisease({ id: "d2" });
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

    it("logInForbidden sets errorMessage", () => {
        authActions.logInForbidden("REASON");

        const state = Store.getState();
        expect(state.errorMessage).to.contain("REASON");
        expect(state.errorMessage).to.contain("Please contact");
    });
});
