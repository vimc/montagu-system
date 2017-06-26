import { expect } from "chai";
import { alt } from "../../../main/shared/alt";
import { Sandbox } from "../../Sandbox";

import { NotificationState, notificationStore } from "../../../main/shared/stores/NotificationStore";
import { notificationActions } from "../../../main/shared/actions/NotificationActions";
import { authActions } from "../../../main/shared/actions/AuthActions";
const jwt = require("jsonwebtoken");

describe("NotificationStore", () => {
    const sandbox = new Sandbox();

    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("is initially blank", () => {
        const state = notificationStore.getState();
        const expected: NotificationState = {
            errors: [],
            infos: []
        };
        expect(state).to.eql(expected);
    });

    it("errorActions.notify with type error adds errorMessage", () => {
        notificationActions.notify({ message: "message 1", type: "error" });

        let state = notificationStore.getState();
        expect(state).to.eql({
            errors: [ "message 1" ],
            infos: []
        });

        notificationActions.notify({ message: "message 2", type: "error" });

        state = notificationStore.getState();
        expect(state).to.eql({
            errors: [ "message 2", "message 1" ],
            infos: []
        });
    });

    it("logIn does not set errorMessage if user is active modeller", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "*/can-login",
            roles: "modelling-group:group/member"
        }, "secret");
        authActions.logIn(token);

        const state = notificationStore.getState();
        expect(state.errors).to.be.empty;
    });

    it("logIn does set errorMessage if user is inactive", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "",
            roles: "modelling-group:group/member"
        }, "secret");
        authActions.logIn(token);

        const state = notificationStore.getState();
        expect(state.errors[0]).to.contain("Your account has been deactivated");
    });

    it("logIn does set errorMessage if user is not a modeller", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "*/can-login",
            roles: ""
        }, "secret");
        authActions.logIn(token);

        const state = notificationStore.getState();
        expect(state.errors[0]).to.contain("Only members of modelling groups");
    });
});
