import { settings } from "../main/shared/Settings";

interface TestErrorInfo {
    message: string;
    details: string;
}

export function handleTeamCityEvent(event: string, testName: string, error: TestErrorInfo) {
    testName = escape(testName)
    if (settings.teamcityServiceMessages) {
        switch (event) {
            case "before":
                console.log(`##teamcity[testStarted name='${testName}']`);
                break;
            case "after":
                console.log(`##teamcity[testFinished name='${testName}']`);
                break;
            case "failed":
                const message = escape(error.message);
                const details = escape(error.details);
                console.log(`##teamcity[testFailed name='${testName}' message='${message}' details='${details}']`);
                break;
            default:
                throw Error(`Unknown TeamCity event '${event}'`);
        }
    }
}

function escape(text: string) {
        return text.replace("|", "||")
            .replace("'", "|'")
            .replace("\r", "|r")
            .replace("\n", "|n")
            .replace("[", "|[")
            .replace("]", "|]")
}