import { expect } from 'chai';
import { Sandbox } from "../Sandbox";
const jwt = require("jsonwebtoken");

import { authActions, LogInProperties } from "../../main/shared/actions/AuthActions";

function getPayload(tokenProperties: any): LogInProperties {
    const token = jwt.sign(tokenProperties, "secret");
    const sandbox = new Sandbox();
    try {
        const spy = sandbox.dispatchSpy();
        authActions.logIn(token);
        return spy.args[0][1] as LogInProperties;
    } finally {
        sandbox.restore();
    }
}

describe("AuthActions", () => {
    it("retrieves username from token", () => {
        const payload = getPayload({ sub: "username", permissions: "", roles: "" });
        expect(payload.username).to.equal("username");
    });

    it("retrieves permissions from token", () => {
        const payload = getPayload({ sub: "username", permissions: "p1,p2", roles: "" });
        expect(payload.permissions).to.eql([ "p1", "p2" ]);
    });

    it("retrieves modelling groups from token", () => {
        const roles = "modelling-group:g1/member,modelling-group:g2/wrong-name,wrong-scope:g3/member";
        const payload = getPayload({ sub: "username", permissions: "", roles: roles });
        expect(payload.modellingGroups).to.eql([ "g1" ]);
    });

    it("retrieves isAccountActive from token", () => {
        const a = getPayload({ sub: "username", permissions: "p1", roles: "" });
        expect(a.isAccountActive).to.be.false;
        const b = getPayload({ sub: "username", permissions: "*/can-login", roles: "" });
        expect(b.isAccountActive).to.be.true;
    });

    it("retrieves isModeller from token", () => {
        const a = getPayload({ sub: "username", permissions: "", roles: "*/member" });
        expect(a.isModeller).to.be.false;
        const b = getPayload({ sub: "username", permissions: "", roles: "modelling-group:g1/member" });
        expect(b.isModeller).to.be.true;
    });
});