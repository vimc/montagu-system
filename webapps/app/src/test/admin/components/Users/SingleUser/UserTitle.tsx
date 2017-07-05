import { expect } from "chai";
import { mockUser} from "../../../../mocks/mockModels";
import { alt } from "../../../../../main/shared/alt";
import {UserTitle} from "../../../../../main/admin/components/Users/SingleUser/UserTitle";

describe("UserTitle", () => {
    it("can get props from stores", () => {
        const user = mockUser();
        alt.bootstrap(JSON.stringify({
            UserStore: {
                currentUsername: "testuser",
                usersLookup: {
                    "testuser": user,
                }
            }
        }));
        const props = UserTitle.getPropsFromStores();
        expect(props).to.eql({
            ready: true,
            user: user
        });
    });
});