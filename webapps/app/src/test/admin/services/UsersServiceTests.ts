

import {createMockStore} from "../../mocks/mockStore";
import {UsersService} from "../../../main/admin/services/UsersService";
import {Sandbox} from "../../Sandbox";

describe('Users service tests', () => {
    const sandbox = new Sandbox();

    const store = createMockStore();

    afterEach(() => {
        sandbox.restore();
    });

    it('fetches users', () => {
        const usersService = new UsersService(store.dispatch, store.getState);

        const setOptionsSpy = sandbox.setSpy(usersService, "setOptions");
        const getStub = sandbox.setStubFunc(usersService, "get", ()=>{
            return Promise.resolve();
        });

        usersService.getAllUsers();

        expect(getStub.mock.calls[0][0])
            .toEqual("/users/");
        expect(setOptionsSpy.mock.calls[0][0]).toEqual({ cacheKey: 'users' });
    });

    it("sets password", () => {
        const usersService = new UsersService(store.dispatch, store.getState);
        const postStub = sandbox.setStubFunc(usersService, "post", ()=>{
            return Promise.resolve();
        });
        usersService.setPassword("TOKEN", "password");
        expect(postStub.mock.calls[0]).toEqual(["/password/set/?access_token=TOKEN", `{"password":"password"}`]);
    });
});