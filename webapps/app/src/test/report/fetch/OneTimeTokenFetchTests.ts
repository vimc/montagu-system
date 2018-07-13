import { ReportingFetchHelper } from "./ReportingFetchHelper";
import { alt } from "../../../main/shared/alt";
import { ReportingFetcher } from "../../../main/report/sources/ReportingFetcher";
import { oneTimeTokenStore } from "../../../main/report/stores/OneTimeTokenStore";
import { decodeOneTimeToken, OneTimeToken } from "../../../main/report/models/OneTimeToken";
import { mockOneTimeTokenData } from "../../mocks/mocks";
import {compress, signAndCompress} from "../../shared/helpers/TokenHelpers";
import {sign} from "jsonwebtoken";
const jwt = require("jsonwebtoken");

describe("OneTimeTokenStore.fetchToken", () => {
    const url = "/some/url";
    const qualifiedUrl = ReportingFetcher.buildRelativeReportingURL(url);
    const data = mockOneTimeTokenData({ url: qualifiedUrl });
    const token = sign(data, "secret");
    const compressedToken = compress(token);
    const decodedToken = decodeOneTimeToken(compressedToken);

    new ReportingFetchHelper<string, OneTimeToken>({
        makePayload: () => compressedToken,
        prepareForFetch: () => {
            alt.bootstrap(JSON.stringify({
                OneTimeTokenStore: {
                    tokens: {}
                }
            }));
        },
        prepareForCachedFetch: () => {
            const tokens: any = {};
            tokens[qualifiedUrl] = {
                raw: compressedToken,
                data: data
            };
            alt.bootstrap(JSON.stringify({
                OneTimeTokenStore: {
                    tokens: tokens
                }
            }))
        },
        triggerFetch: () => oneTimeTokenStore.fetchToken(url),
        expectedSuccessResult: {
            action: "OneTimeTokenActions.receiveToken",
            payload: decodedToken
        },
        expectedURL: "/onetime_token/?url=" + qualifiedUrl
    }).addTestsToMocha();
});

