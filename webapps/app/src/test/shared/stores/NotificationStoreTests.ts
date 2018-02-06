import { expect } from "chai";
import { alt } from "../../../main/shared/alt";
import { Sandbox } from "../../Sandbox";

import { NotificationState, notificationStore } from "../../../main/shared/stores/NotificationStore";
import { notificationActions } from "../../../main/shared/actions/NotificationActions";
import { authActions } from "../../../main/shared/actions/authActions";
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

    it("notificationActions.notify with type error adds error message (LIFO)", () => {
        // LIFO = Last in, first out: This collection is a stack
        notificationActions.notify({ message: "message 1", type: "error" });

        let state = notificationStore.getState();
        expect(state).to.eql({
            errors: ["message 1"],
            infos: []
        });

        notificationActions.notify({ message: "message 2", type: "error" });

        state = notificationStore.getState();
        expect(state).to.eql({
            errors: ["message 2", "message 1"],
            infos: []
        });
    });

    it("notificationActions.notify with type info adds info message (FIFO)", () => {
        // FIFO = First in, first out: This collection is a queue
        notificationActions.notify({ message: "message 1", type: "info" });

        let state = notificationStore.getState();
        expect(state).to.eql({
            infos: ["message 1"],
            errors: []
        });

        notificationActions.notify({ message: "message 2", type: "info" });

        state = notificationStore.getState();
        expect(state).to.eql({
            infos: ["message 1", "message 2"],
            errors: []
        });
    });

    it("notificationActions.clear with type info removes first message from queue", () => {
        notificationActions.notify({ message: "1", type: "info" });
        notificationActions.notify({ message: "2", type: "info" });
        notificationActions.notify({ message: "3", type: "info" });
        expect(notificationStore.getState().infos).to.eql(["1", "2", "3"]);
        notificationActions.clear("info");
        expect(notificationStore.getState().infos).to.eql(["2", "3"]);
        notificationActions.clear("info");
        expect(notificationStore.getState().infos).to.eql(["3"]);
        notificationActions.clear("info");
        expect(notificationStore.getState().infos).to.eql([]);
    });

    it("notificationActions.clear with type error removes all errors messages", () => {
        notificationActions.notify({ message: "1", type: "error" });
        notificationActions.notify({ message: "2", type: "error" });
        notificationActions.notify({ message: "3", type: "error" });
        expect(notificationStore.getState().errors).to.eql(["3", "2", "1"]);
        notificationActions.clear("error");
        expect(notificationStore.getState().errors).to.eql([]);
    });

    // it("logIn does not set errorMessage if user is active modeller", () => {
    //     const token = jwt.sign({
    //         sub: "user",
    //         permissions: "*/can-login",
    //         roles: "modelling-group:group/member"
    //     }, "secret");
    //     authActions.logIn(token, false);
    //
    //     const state = notificationStore.getState();
    //     expect(state.errors).to.be.empty;
    // });

    // it("logIn does set errorMessage if user is inactive", () => {
    //     const token = jwt.sign({
    //         sub: "user",
    //         permissions: "",
    //         roles: "modelling-group:group/member"
    //     }, "secret");
    //     authActions.logIn(token, false);
    //
    //     const state = notificationStore.getState();
    //     expect(state.errors[0]).to.contain("Your account has been deactivated");
    // });
    //
    // it("logIn does set errorMessage if user is not a modeller", () => {
    //     const token = jwt.sign({
    //         sub: "user",
    //         permissions: "*/can-login",
    //         roles: ""
    //     }, "secret");
    //     authActions.logIn(token, false);
    //
    //     const state = notificationStore.getState();
    //     expect(state.errors[0]).to.contain("Only members of modelling groups");
    // });
});
