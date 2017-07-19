import { expect } from "chai";
import { alt } from "../../../main/shared/alt";
import { ReportingFetcher } from "../../../main/report/sources/ReportingFetcher";

describe("ReportingFetcher", () => {
    it("can get bearer token from store", () => {
        alt.bootstrap(JSON.stringify({
            ReportingAuthStore: {
                bearerToken: "token"
            }
        }));
        expect(new ReportingFetcher().getBearerToken()).to.equal("token");
    });
});