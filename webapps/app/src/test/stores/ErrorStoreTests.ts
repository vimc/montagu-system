import { expect } from "chai";
import { alt } from "../../main/shared/alt";
import { Sandbox } from "../Sandbox";

import { errorStore } from "../../main/shared/stores/ErrorStore";
import { errorActions } from "../../main/shared/actions/ErrorActions";
import { authActions } from "../../main/shared/actions/AuthActions";
const jwt = require("jsonwebtoken");

describe("ErrorStore", () => {
    const sandbox = new Sandbox();

    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("is initially blank", () => {
        const state = errorStore.getState();
        expect(state).to.eql({
            errors: []
        });
    });

    it("errorActions.error adds errorMessage", () => {
        errorActions.error("message 1");

        let state = errorStore.getState();
        expect(state).to.eql({
            errors: [ "message 1" ]
        });

        errorActions.error("message 2");

        state = errorStore.getState();
        expect(state).to.eql({
            errors: [ "message 2", "message 1" ]
        });
    });

    it("logIn does not set errorMessage if user is active modeller", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "*/can-login",
            roles: "modelling-group:group/member"
        }, "secret");
        authActions.logIn(token);

        const state = errorStore.getState();
        expect(state.errors).to.be.empty;
    });

    it("logIn does set errorMessage if user is inactive", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "",
            roles: "modelling-group:group/member"
        }, "secret");
        authActions.logIn(token);

        const state = errorStore.getState();
        expect(state.errors[0]).to.contain("Your account has been deactivated");
    });

    it("logIn does set errorMessage if user is not a modeller", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "*/can-login",
            roles: ""
        }, "secret");
        authActions.logIn(token);

        const state = errorStore.getState();
        expect(state.errors[0]).to.contain("Only members of modelling groups");
    });
});
