import { settings } from "../main/shared/Settings";

function fullTestName(test: TestContext): string {
    if (test != null) {
        return (fullTestName(test.parent) + " " + test.title).trim();
    } else {
        return "";
    }
}

export function addTeamCityHooks() {
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
}

interface TestErrorInfo {
    message: string;
    details: string;
}

function handleTeamCityEvent(event: string, testName: string, error: TestErrorInfo) {
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
    // JS string.replace only replaces the first occurence.
    // To replace all occurences you must use a regex with the 'g' option at the end:
    // g means "Global" and causes it to replace all matches
    return text.replace(/\|/g, "||")
        .replace(/'/g, "|'")
        .replace(/\r/g, "|r")
        .replace(/\n/g, "|n")
        .replace(/\[/g, "|[")
        .replace(/]/g, "|]")
}