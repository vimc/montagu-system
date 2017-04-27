import { handleTeamCityEvent } from './TeamCityIntegration'
import * as mocks from './mocks';
import { sources } from '../main/sources/Sources';
import 'isomorphic-fetch'

function fullTestName(test: TestContext): string {
    if (test != null) {
        return (fullTestName(test.parent) + " " + test.title).trim();
    } else {
        return "";
    }
}

before(() => {
    mocks.mockSource(sources.diseases);
    mocks.mockSource(sources.responsibilities);
    mocks.mockSource(sources.touchstones);
});

beforeEach(function() {    
    handleTeamCityEvent('before', fullTestName(this.currentTest), null);
});
afterEach(function() {
    const testName: string = fullTestName(this.currentTest);
    if (this.currentTest.state == "failed") {    
        handleTeamCityEvent('failed', testName, { 
            message: this.currentTest.err.toString(), 
            details: this.currentTest.err.stack  
        });
    }
    handleTeamCityEvent('after', testName, null);
});