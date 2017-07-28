import { alt } from "../../../main/shared/alt";
import { expect } from "chai";
import { oneTimeTokenActions } from "../../../main/report/actions/OneTimeTokenActions";
import { oneTimeTokenStore } from "../../../main/report/stores/OneTimeTokenStore";
import { ReportingFetcher } from "../../../main/report/sources/ReportingFetcher";
import { decodeOneTimeToken } from "../../../main/report/models/OneTimeToken";
import { bootstrapOneTimeTokenStore } from "../../StoreHelpers";

const jwt = require("jsonwebtoken");

describe("OneTimeTokenStore", () => {
    const url = "/pamplemousse";
    const qualifiedUrl = ReportingFetcher.buildRelativeReportingURL(url);
    const token: string = jwt.sign({ url: qualifiedUrl }, 'secret');
    beforeEach(() => alt.recycle());

    it("handles receiveToken", () => {
        oneTimeTokenActions.receiveToken(token);
        const retrieved = oneTimeTokenStore.getToken(oneTimeTokenStore.getState(), url);
        expect(retrieved).to.not.be.null;
        expect(retrieved.raw).to.eq(token);
        expect(retrieved.data.url).to.eq(qualifiedUrl);
    });

    it("handles beginFetchToken", () => {
        bootstrapOneTimeTokenStore([ decodeOneTimeToken(token) ], qualifiedUrl);
        let retrieved = oneTimeTokenStore.getToken(oneTimeTokenStore.getState(), url);
        expect(retrieved.data.url).to.eq(qualifiedUrl);
        oneTimeTokenActions.beginFetchToken();
        retrieved = oneTimeTokenStore.getToken(oneTimeTokenStore.getState(), url);
        expect(retrieved).to.be.null;
    });

});