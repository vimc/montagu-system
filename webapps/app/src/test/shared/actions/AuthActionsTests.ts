import 'babel-polyfill';
import { expect } from "chai";
const configureReduxMockStore  = require('redux-mock-store');

import { Sandbox } from "../../Sandbox";
import { authActions } from "../../../main/shared/actions/authActions";
import { AuthService } from "../../../main/shared/services/AuthService";
import { mainStore as contribMainStore } from "../../../main/contrib/stores/MainStore";
import { TypeKeys } from "../../../main/shared/actionTypes/AuthTypes";

import thunk from 'redux-thunk';

describe("Modelling groups actions tests", () => {
    const sandbox = new Sandbox();
    const middlewares: any = [thunk]
    let store: any = null;
    const initialState = {}
    const mockStore = configureReduxMockStore(middlewares);


    before(() => {
        store = mockStore(initialState)
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches authenticated action if service returned proper token", (done) => {
        const testToken = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0ZXN0LnVzZXIiLCJwZXJtaXNzaW9ucyI6IipcL2Nhbi1sb2dpbiwqXC9jb3VudHJpZXMucmVhZCwqXC9kZW1vZ3JhcGhpY3MucmVhZCwqXC9lc3RpbWF0ZXMucmVhZCwqXC9tb2RlbGxpbmctZ3JvdXBzLnJlYWQsKlwvbW9kZWxzLnJlYWQsKlwvcmVzcG9uc2liaWxpdGllcy5yZWFkLCpcL3NjZW5hcmlvcy5yZWFkLCpcL3RvdWNoc3RvbmVzLnJlYWQsKlwvdXNlcnMucmVhZCxtb2RlbGxpbmctZ3JvdXA6SUMtR2Fyc2tlXC9jb3ZlcmFnZS5yZWFkLG1vZGVsbGluZy1ncm91cDpJQy1HYXJza2VcL2VzdGltYXRlcy5yZWFkLXVuZmluaXNoZWQsbW9kZWxsaW5nLWdyb3VwOklDLUdhcnNrZVwvZXN0aW1hdGVzLndyaXRlLCpcL21vZGVsbGluZy1ncm91cHMubWFuYWdlLW1lbWJlcnMsKlwvbW9kZWxsaW5nLWdyb3Vwcy53cml0ZSwqXC9yb2xlcy5yZWFkLCpcL3JvbGVzLndyaXRlLCpcL3VzZXJzLmNyZWF0ZSwqXC91c2Vycy5lZGl0LWFsbCwqXC9yZXBvcnRzLnJlYWQsbW9kZWxsaW5nLWdyb3VwOklDLUdhcnNrZVwvZXN0aW1hdGVzLndyaXRlLG1vZGVsbGluZy1ncm91cDpJQy1HYXJza2VcL21vZGVsbGluZy1ncm91cHMubWFuYWdlLW1lbWJlcnMsbW9kZWxsaW5nLWdyb3VwOklDLUdhcnNrZVwvcm9sZXMud3JpdGUsbW9kZWxsaW5nLWdyb3VwOklDLUdhcnNrZVwvdXNlcnMuY3JlYXRlLG1vZGVsbGluZy1ncm91cDp0ZXN0LWdyb3VwXC9jb3ZlcmFnZS5yZWFkLG1vZGVsbGluZy1ncm91cDp0ZXN0LWdyb3VwXC9lc3RpbWF0ZXMucmVhZC11bmZpbmlzaGVkLG1vZGVsbGluZy1ncm91cDp0ZXN0LWdyb3VwXC9lc3RpbWF0ZXMud3JpdGUsbW9kZWxsaW5nLWdyb3VwOnRlc3QtZ3JvdXBcL2VzdGltYXRlcy53cml0ZSxtb2RlbGxpbmctZ3JvdXA6dGVzdC1ncm91cFwvbW9kZWxsaW5nLWdyb3Vwcy5tYW5hZ2UtbWVtYmVycyxtb2RlbGxpbmctZ3JvdXA6dGVzdC1ncm91cFwvcm9sZXMud3JpdGUsbW9kZWxsaW5nLWdyb3VwOnRlc3QtZ3JvdXBcL3VzZXJzLmNyZWF0ZSIsInJvbGVzIjoiKlwvdXNlcixtb2RlbGxpbmctZ3JvdXA6SUMtR2Fyc2tlXC9tZW1iZXIsKlwvdXNlci1tYW5hZ2VyLCpcL3JlcG9ydHMtcmVhZGVyLG1vZGVsbGluZy1ncm91cDpJQy1HYXJza2VcL3VwbG9hZGVyLG1vZGVsbGluZy1ncm91cDpJQy1HYXJza2VcL3VzZXItbWFuYWdlcixtb2RlbGxpbmctZ3JvdXA6dGVzdC1ncm91cFwvbWVtYmVyLG1vZGVsbGluZy1ncm91cDp0ZXN0LWdyb3VwXC91cGxvYWRlcixtb2RlbGxpbmctZ3JvdXA6dGVzdC1ncm91cFwvdXNlci1tYW5hZ2VyIiwiaXNzIjoidmFjY2luZWltcGFjdC5vcmciLCJleHAiOjE1MTc3MzIyMzh9.DQYHCYPJLd9E-Da_cGdQEUtZ4Lyl7ydQY6H8cLBwKMo9zfsxvf2LqindmY3NXTevHyuG7aHJd6-45I3XJrgXLvf5YYwmsKJbZOjU5QOqgk4a1QwJAmjjpRS1tO2y135xp-cJm9UnA8Ryar4hFquH1f46Fy147tEvTT1JWFa-kRN1UyDr6gqgNJRk1mHpe0y69JUreaQJtUsVvMU8ewh0ILOAEOVoLGRY7WBc3ItArJgKZV7DOSIoKaRU6tJHM9yAHCZubeeXOr0gCp9hXT-I4ABqw6g9KM2dMYpAZKFaPx3jMVjOHtpuJPiSJ9W7BPbtxNW8mEJD8DSUTbvKVyv1cg";
        sandbox.setStubFunc(AuthService.prototype, "logIn", ()=>{
            return Promise.resolve({data:{access_token: testToken}});
        });
        sandbox.setStub(contribMainStore, "load");
        store.dispatch(authActions.logIn('test', 'test'))
        setTimeout(() => {
            const actions = store.getActions()
            console.log(actions);
            expect(actions[0].type).to.eql(TypeKeys.AUTHENTICATED)
            done();
        });
    });

});
