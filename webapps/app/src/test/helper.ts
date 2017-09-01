import { handleTeamCityEvent } from "./TeamCityIntegration";
import { mockFetcherResponse } from "./mocks/mockRemote";

function fullTestName(test: TestContext): string {
    if (test != null) {
        return (fullTestName(test.parent) + " " + test.title).trim();
    } else {
        return "";
    }
}

before(() => {
    mockFetcherResponse();
});

beforeEach(function () {
    handleTeamCityEvent('before', fullTestName(this.currentTest), null);
});
afterEach(function () {
    if (this.currentTest != null) {
        const testName: string = fullTestName(this.currentTest);
        if (this.currentTest.state == "failed") {
            handleTeamCityEvent('failed', testName, {
                message: this.currentTest.err.toString(),
                details: this.currentTest.err.stack
            });
        }
        handleTeamCityEvent('after', testName, null);
    } else {
        throw Error("Something has gone wrong: 'this.currentTest' is null.");
    }
});