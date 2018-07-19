import { alt } from "../../../main/shared/alt";
import { expect } from "chai";
import { oneTimeTokenActions } from "../../../main/report/actionCreators/OneTimeTokenActions";
import { oneTimeTokenStore } from "../../../main/report/stores/OneTimeTokenStore";
import { ReportingFetcher } from "../../../main/report/sources/ReportingFetcher";
import { decodeOneTimeToken } from "../../../main/report/models/OneTimeToken";
import { bootstrapOneTimeTokenStore } from "../../StoreHelpers";
import {compress} from "../../shared/helpers/TokenHelpers";
import {sign} from "jsonwebtoken";

describe("OneTimeTokenStore", () => {
    const url = "/pamplemousse";
    const qualifiedUrl = ReportingFetcher.buildRelativeReportingURL(url);
    const uncompressedToken: string = sign({ url: qualifiedUrl }, 'secret');
    const compressedToken = compress(uncompressedToken);
    beforeEach(() => alt.recycle());

    it("handles receiveToken", () => {
        oneTimeTokenActions.receiveToken(compressedToken);
        const retrieved = oneTimeTokenStore.getToken(oneTimeTokenStore.getState(), url);
        expect(retrieved).to.not.be.null;
        expect(retrieved.raw).to.eq(compressedToken);
        expect(retrieved.data.url).to.eq(qualifiedUrl);
    });

    it("handles beginFetchToken", () => {
        bootstrapOneTimeTokenStore([ decodeOneTimeToken(compressedToken) ], qualifiedUrl);
        let retrieved = oneTimeTokenStore.getToken(oneTimeTokenStore.getState(), url);
        expect(retrieved.data.url).to.eq(qualifiedUrl);
        oneTimeTokenActions.beginFetchToken();
        retrieved = oneTimeTokenStore.getToken(oneTimeTokenStore.getState(), url);
        expect(retrieved).to.be.null;
    });

    it("handles clearUsedToken", () => {
        bootstrapOneTimeTokenStore([ decodeOneTimeToken(compressedToken) ]);
        let retrieved = oneTimeTokenStore.getToken(oneTimeTokenStore.getState(), url);
        expect(retrieved.data.url).to.eq(qualifiedUrl);
        oneTimeTokenActions.clearUsedToken(url);
        retrieved = oneTimeTokenStore.getToken(oneTimeTokenStore.getState(), url);
        expect(retrieved).to.be.null;
    });

});