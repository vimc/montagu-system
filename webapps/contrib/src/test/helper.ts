import { setupVirtualDOM } from "./JSDomHelpers";
import { handleTeamCityEvent } from "./TeamCityIntegration";
import { mockFetcherResponse } from "./mocks/mockRemote";
import "isomorphic-fetch";
import { restoreDispatch } from "./actionHelpers";

function fullTestName(test: TestContext): string {
    if (test != null) {
        return (fullTestName(test.parent) + " " + test.title).trim();
    } else {
        return "";
    }
}

before(() => {
    setupVirtualDOM();
    mockFetcherResponse();
});

beforeEach(function () {
    handleTeamCityEvent('before', fullTestName(this.currentTest), null);
});
afterEach(function () {
    const testName: string = fullTestName(this.currentTest);
    if (this.currentTest.state == "failed") {
        handleTeamCityEvent('failed', testName, {
            message: this.currentTest.err.toString(),
            details: this.currentTest.err.stack
        });
    }
    handleTeamCityEvent('after', testName, null);
    restoreDispatch();
});