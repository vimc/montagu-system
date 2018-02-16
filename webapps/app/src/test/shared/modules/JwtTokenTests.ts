import { expect } from "chai";
import * as jwt from "jsonwebtoken";

import { jwtTokenAuth } from "../../../main/shared/modules/jwtTokenAuth";
import {AuthState} from "../../../main/shared/reducers/authReducer";

describe('JwtTokenAuth Module Tests', () => {

    const roles = "*/user,modelling-group:IC-Garske/member,*/user-manager,*/reports-reader,modelling-group:IC-Garske/uploader,modelling-group:IC-Garske/user-manager,modelling-group:test-group/member,modelling-group:test-group/uploader,modelling-group:test-group/user-manager";
    const permissions = "*/can-login,*/countries.read,*/demographics.read,*/estimates.read,*/modelling-groups.read,*/models.read,*/responsibilities.read,*/scenarios.read,*/touchstones.read,*/users.read,modelling-group:IC-Garske/coverage.read,modelling-group:IC-Garske/estimates.read-unfinished,modelling-group:IC-Garske/estimates.write,*/modelling-groups.manage-members,*/modelling-groups.write,*/roles.read,*/roles.write,*/users.create,*/users.edit-all,*/reports.read,modelling-group:IC-Garske/estimates.write,modelling-group:IC-Garske/modelling-groups.manage-members,modelling-group:IC-Garske/roles.write,modelling-group:IC-Garske/users.create,modelling-group:test-group/coverage.read,modelling-group:test-group/estimates.read-unfinished,modelling-group:test-group/estimates.write,modelling-group:test-group/estimates.write,modelling-group:test-group/modelling-groups.manage-members,modelling-group:test-group/roles.write,modelling-group:test-group/users.create";
    const permissionsCannotLogin = "*/countries.read,*/demographics.read,*/estimates.read,*/modelling-groups.read,*/models.read,*/responsibilities.read,*/scenarios.read,*/touchstones.read,*/users.read,modelling-group:IC-Garske/coverage.read,modelling-group:IC-Garske/estimates.read-unfinished,modelling-group:IC-Garske/estimates.write,*/modelling-groups.manage-members,*/modelling-groups.write,*/roles.read,*/roles.write,*/users.create,*/users.edit-all,*/reports.read,modelling-group:IC-Garske/estimates.write,modelling-group:IC-Garske/modelling-groups.manage-members,modelling-group:IC-Garske/roles.write,modelling-group:IC-Garske/users.create,modelling-group:test-group/coverage.read,modelling-group:test-group/estimates.read-unfinished,modelling-group:test-group/estimates.write,modelling-group:test-group/estimates.write,modelling-group:test-group/modelling-groups.manage-members,modelling-group:test-group/roles.write,modelling-group:test-group/users.create";

    it('checks is expired', () => {
        expect(jwtTokenAuth.isExpired(0)).to.equal(true);
        expect(jwtTokenAuth.isExpired(Math.round(Date.now() / 1000))).to.equal(true);
        const now = new Date();
        const expired = new Date(now.getTime() + (5 * 60 * 1000) + 1000).getTime();
        expect(jwtTokenAuth.isExpired(Math.round( expired / 1000))).to.equal(false);
    });

    it('fails to decode token, returns default empty token data', () => {
        expect(jwtTokenAuth.decodeToken('malformed-token')).to.eql(jwtTokenAuth.emptyTokenData());
    });

    it('decodes token data', () => {
        const testData = {
            sub: "test.user",
            permissions: "test.permissions",
            roles: "test.roles",
            iss: "test.iss",
            exp: Math.round(Date.now() / 1000) + 1000
        }
        const testToken = jwt.sign(testData, "secret");
        const decoded = jwtTokenAuth.decodeToken(testToken);
        expect(decoded.sub).to.eql(testData.sub);
        expect(decoded.permissions).to.eql(testData.permissions);
        expect(decoded.sub).to.eql(testData.sub);
        expect(decoded.roles).to.eql(testData.roles);
    });

    it('parses roles to modelling groups', () => {
        const modellingGroups = jwtTokenAuth.parseModellingGroups(roles);
        expect(modellingGroups).to.eql([ 'IC-Garske', 'test-group' ]);
    });

    it('decodes token data and formats it as AuthState, account active, modeller', () => {
        const testData = {
            sub: "test.user",
            permissions,
            roles,
            iss: "test.iss",
            exp: Math.round(Date.now() / 1000) + 1000
        }
        const testToken = jwt.sign(testData, "secret");
        const authData :AuthState = jwtTokenAuth.getDataFromToken(testToken);

        expect(authData.loggedIn).to.eql(true);
        expect(authData.bearerToken).to.eql(testToken);
        expect(authData.isAccountActive).to.eql(true);
        expect(authData.isModeller).to.eql(true);
        expect(authData.username).to.eql(testData.sub);
        expect(Array.isArray(authData.permissions)).to.eql(true);
        expect(authData.permissions.length).to.eql(31);

    });

    it('decodes token data and formats it as AuthState, account not active, not modeller', () => {
        const testData = {
            sub: "test.user",
            permissions: permissionsCannotLogin,
            roles: "",
            iss: "test.iss",
            exp: Math.round(Date.now() / 1000) + 1000
        }
        const testToken = jwt.sign(testData, "secret");
        const authData :AuthState = jwtTokenAuth.getDataFromToken(testToken);

        expect(authData.isAccountActive).to.eql(false);
        expect(authData.isModeller).to.eql(false);
    });

});