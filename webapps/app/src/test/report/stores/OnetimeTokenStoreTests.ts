import { alt } from "../../../main/shared/alt";
import { expect } from "chai";
import { onetimeTokenActions } from "../../../main/report/actions/OnetimeTokenActions";
import { onetimeTokenStore } from "../../../main/report/stores/OnetimeTokenStore";
import { ReportingFetcher } from "../../../main/report/sources/ReportingFetcher";

const jwt = require("jsonwebtoken");

describe("OnetimeTokenStore", () => {
    const url = "/pamplemousse";
    const qualifiedUrl = ReportingFetcher.buildRelativeReportingURL(url);
    const token: string = jwt.sign({ url: qualifiedUrl }, 'secret');
    beforeEach(() => alt.recycle());

    it("handles receiveToken", () => {
        onetimeTokenActions.receiveToken(token);
        const retrieved = onetimeTokenStore.getToken(onetimeTokenStore.getState(), url);
        expect(retrieved).to.not.be.null;
        expect(retrieved.raw).to.eq(token);
        expect(retrieved.data.url).to.eq(qualifiedUrl);
    });

    it("handles beginFetchToken", () => {
        const setupStore = () => {
            const lookup: any = {};
            lookup[qualifiedUrl] = {
                raw: token,
                data: { url: qualifiedUrl }
            };
            alt.bootstrap(JSON.stringify({
                OnetimeTokenStore: {
                    tokens: lookup,
                    urlToFetchTokenFor: qualifiedUrl
                }
            }));
        };
        
        setupStore();
        let retrieved = onetimeTokenStore.getToken(onetimeTokenStore.getState(), url);
        expect(retrieved.data.url).to.eq(qualifiedUrl);
        onetimeTokenActions.beginFetchToken();
        retrieved = onetimeTokenStore.getToken(onetimeTokenStore.getState(), url);
        expect(retrieved).to.be.null;
    });

});