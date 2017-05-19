import { expect } from "chai";
import alt from "../../main/alt";
import { Sandbox } from "../Sandbox";
import { mockDisease } from "../mocks/mockModels";
const jwt = require("jsonwebtoken");

import { Store } from "../../main/stores/MainStore";
import { authActions } from "../../main/actions/AuthActions";
import { diseaseActions } from "../../main/actions/DiseaseActions";
import { errorActions } from "../../main/actions/ErrorActions";
import * as ResponsibilityStore from "../../main/stores/ResponsibilityStore";

describe("MainStore", () => {
    const sandbox = new Sandbox();

    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("is initially blank", () => {
        const state = Store.getState();
        expect(state).to.eql({
            errors: [],
            ready: false,
            diseases: { loaded: false, content: null }
        });
    });

    it("diseaseActions.update sets diseases and triggers ResponsibilityStore.fetchTouchstones", (done: DoneCallback) => {
        const spy = sandbox.sinon.spy(ResponsibilityStore.Store, "fetchTouchstones");
        const disease1 = mockDisease({ id: "d1" });
        const disease2 = mockDisease({ id: "d2" });
        diseaseActions.update([ disease1, disease2 ]);

        const state = Store.getState();
        expect(state).to.eql({
            errors: [],
            ready: true,
            diseases: {
                loaded: true,
                content: {
                    d1: disease1,
                    d2: disease2,
                }
            }
        });
        setTimeout(() => {
            try {
                expect(spy.called).to.be.true;
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it("errorActions.error adds errorMessage", () => {
        errorActions.error("message");

        let state = Store.getState();
        expect(state).to.eql({
            errors: [ "message" ],
            ready: false,
            diseases: { loaded: false, content: null }
        });

        errorActions.error("message 2");

        state = Store.getState();
        expect(state).to.eql({
            errors: [ "message 2", "message" ],
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
        expect(state.errors).to.be.empty;
    });

    it("logIn does set errorMessage if user is inactive", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "",
            roles: "modelling-group:group/member"
        }, "secret");
        authActions.logIn(token);

        const state = Store.getState();
        expect(state.errors[0]).to.contain("Your account has been deactivated");
    });

    it("logIn does set errorMessage if user is not a modeller", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "*/can-login",
            roles: ""
        }, "secret");
        authActions.logIn(token);

        const state = Store.getState();
        expect(state.errors[0]).to.contain("Only members of modelling groups");
    });
});
