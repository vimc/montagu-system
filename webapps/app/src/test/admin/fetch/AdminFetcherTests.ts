import { expect } from "chai";
import { alt } from "../../../main/shared/alt";
import { AdminFetcher } from "../../../main/admin/sources/AdminFetcher";

describe("AdminFetcher", () => {
    it("can get bearer token from store", () => {
        alt.bootstrap(JSON.stringify({
            AdminAuthStore: {
                bearerToken: "token"
            }
        }));
        expect(new AdminFetcher().getBearerToken()).to.equal("token");
    });
});