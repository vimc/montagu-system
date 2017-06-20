import { expect } from "chai";
import { alt } from "../../../main/shared/alt";
import { ContribFetcher } from "../../../main/contrib/sources/ContribFetcher";

describe("ContribFetcher", () => {
    it("can get bearer token from store", () => {
        alt.bootstrap(JSON.stringify({
            ContribAuthStore: {
                bearerToken: "token"
            }
        }));
        expect(new ContribFetcher().getBearerToken()).to.equal("token");
    });
});