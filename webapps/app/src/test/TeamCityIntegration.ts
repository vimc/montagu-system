import { settings } from "../main/shared/Settings";

interface TestErrorInfo {
    message: string;
    details: string;
}

export function handleTeamCityEvent(event: string, testName: string, error: TestErrorInfo) {
    if (settings.teamcityServiceMessages) {
        switch (event) {
            case "before":
                console.log(`##teamcity[testStarted name='${testName}']`);
                break;
            case "after":
                console.log(`##teamcity[testFinished name='${testName}']`);
                break;
            case "failed":
                const details = error.details.replace("\n", " ");
                console.log(`##teamcity[testFailed name='${testName}' message='${error.message}' details='${error.details}']`);
                break;
            default:
                throw Error(`Unknown TeamCity event '${event}'`);
        }
    }
}