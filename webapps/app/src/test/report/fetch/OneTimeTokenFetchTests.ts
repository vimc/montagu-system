import { ReportingFetchHelper } from "./ReportingFetchHelper";
import { alt } from "../../../main/shared/alt";
import { ReportingFetcher } from "../../../main/report/sources/ReportingFetcher";
import { oneTimeTokenStore } from "../../../main/report/stores/OneTimeTokenStore";
import { decodeOneTimeToken, OneTimeToken } from "../../../main/report/models/OneTimeToken";
import { mockOneTimeTokenData } from "../../mocks/mocks";
const jwt = require("jsonwebtoken");

describe("OneTimeTokenStore.fetchToken", () => {
    const url = "/some/url";
    const qualifiedUrl = ReportingFetcher.buildRelativeReportingURL(url);
    const data = mockOneTimeTokenData({ url: qualifiedUrl });
    const token = jwt.sign(data, "secret");
    const decodedToken = decodeOneTimeToken(token);

    new ReportingFetchHelper<string, OneTimeToken>({
        makePayload: () => token,
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
                raw: token,
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

