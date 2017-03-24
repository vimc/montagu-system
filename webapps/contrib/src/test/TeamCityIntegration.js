export function handleTeamCityEvent(event, testName, error=null) {
	switch (event) {
		case "before":
			console.log(`##teamcity[testStarted name='${testName}']`);
			break;
		case "after":
			console.log(`##teamcity[testFinished name='${testName}']`);
			break;
		case "failed":
			console.log(`##teamcity[testFailed name='${testName}' message='${error.message}' details='${error.details}']`);
			break;
		default:
			throw Exception(`Unknown TeamCity event '${event}'`);
	}
}