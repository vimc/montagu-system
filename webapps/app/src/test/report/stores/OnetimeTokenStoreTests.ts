import {alt} from "../../../main/shared/alt";
import {expect} from "chai";
import {reportStore} from "../../../main/report/stores/ReportStore";
import {onetimeTokenActions} from "../../../main/report/actions/OnetimeTokenActions";
import {onetimeTokenStore} from "../../../main/report/stores/OnetimeTokenStore";

describe("OnetimeTokenStore", () => {
    beforeEach(() => alt.recycle());

    it("has reports onetimeTokenActions.updateToken", () => {
        const tokens = { "testurl" : "testtoken"};

        onetimeTokenActions.updateToken("testtoken", "testurl");

        expect(onetimeTokenStore.getState().tokens).to.eql(tokens);
        expect(reportStore.getState().ready).to.be.true;
    });

});