import { handleTeamCityEvent } from './TeamCityIntegration'

function fullTestName(test) {
	if (test != null) {
		return (fullTestName(test.parent) + " " + test.title).trim();
	} else {
		return "";
	}
}


beforeEach(function() {
	handleTeamCityEvent('before', fullTestName(this.currentTest));
});
afterEach(function() {
	const testName = fullTestName(this.currentTest);
	if (this.currentTest.state == "failed") {	
		handleTeamCityEvent('failed', testName, { 
			message: this.currentTest.err.toString(), 
			details: this.currentTest.err.stack  
		});
	}
	handleTeamCityEvent('after', testName);
});