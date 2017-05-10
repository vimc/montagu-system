import { setupVirtualDOM } from "./JSDomHelpers";
import { handleTeamCityEvent } from "./TeamCityIntegration";
import { mockSource } from "./mocks/mockRemote";
import { sources } from "../main/sources/Sources";
import "isomorphic-fetch";

function fullTestName(test: TestContext): string {
    if (test != null) {
        return (fullTestName(test.parent) + " " + test.title).trim();
    } else {
        return "";
    }
}

before(() => {
    setupVirtualDOM();
    mockSource(sources.diseases);
    mockSource(sources.responsibilities);
    mockSource(sources.touchstones);
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
});