import { handleTeamCityEvent } from './TeamCityIntegration'

function fullTestName(test: TestContext): string {
	if (test != null) {
		return (fullTestName(test.parent) + " " + test.title).trim();
	} else {
		return "";
	}
}


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