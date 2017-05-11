import { expect } from "chai";
import alt from "../../main/alt";
import { mockDisease } from "../mocks/mockModels";
const jwt = require("jsonwebtoken");

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

    it("logIn does not set errorMessage if user is active modeller", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "*/can-login",
            roles: "modelling-group:group/member"
        }, "secret");
        authActions.logIn(token);

        const state = Store.getState();
        expect(state.errorMessage).to.be.null;
    });

    it("logIn does set errorMessage if user is inactive", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "",
            roles: "modelling-group:group/member"
        }, "secret");
        authActions.logIn(token);

        const state = Store.getState();
        expect(state.errorMessage).to.contain("Your account has been deactivated");
    });

    it("logIn does set errorMessage if user is not a modeller", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "*/can-login",
            roles: ""
        }, "secret");
        authActions.logIn(token);

        const state = Store.getState();
        expect(state.errorMessage).to.contain("Only members of modelling groups");
    });
});
