import { expect } from 'chai';
import { alt } from "../../main/alt";
import { authActions } from "../../main/actions/AuthActions";
import { sampleToken } from "../mocks/mocks";

import * as AuthStore from '../../main/stores/AuthStore';
import * as MainStore from '../../main/stores/MainStore';

describe("AuthStore", () => {
    beforeEach(() => {
        alt.recycle();
    });

    it("handles logIn event", () => {
        authActions.logIn(sampleToken);
        // This state is all encoded within the sampleToken
        const expected: AuthStore.State = {
            loggedIn: true,
            modellingGroups: [ "test.group" ],
            permissions: [ "p1", "p2" ],
            username: "test.user",
            bearerToken: sampleToken
        };
        expect(AuthStore.Store.getState()).to.eql(expected);
    });

    it("clears everything on logOut", () => {
        alt.bootstrap(JSON.stringify({
            AuthStore: {
                loggedIn: true,
                username: "username",
                bearerToken: "TOKEN",
                permissions: [ "p1", "p2" ],
                modellingGroups: [ "group-1" ]
            },
            MainStore: {
                ready: true
            }
        }));
        authActions.logOut();
        expect(AuthStore.Store.getState()).to.eql(AuthStore.initialState());
        expect(MainStore.Store.getState()).to.eql(MainStore.initialState());
    });
});
