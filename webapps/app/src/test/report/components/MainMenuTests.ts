import {MainMenu} from "../../../main/report/components/MainMenu/MainMenu";
import {addNavigationTests} from "../../shared/NavigationTests";
import {Sandbox} from "../../Sandbox";
import {successResult} from "../../mocks/mockRemote";
import {mockReport} from "../../mocks/mockModels";
import {APIType, mockFetcherForMultipleResponses} from "../../mocks/mockMultipleEndpoints";

describe("Reporting MainMenu", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const page = new MainMenu();
    addNavigationTests(page, sandbox, () => {
        mockFetcherForMultipleResponses([
            {
                urlFragment: new RegExp("/reports/"),
                result: successResult([ mockReport() ]),
                api: APIType.Reporting
            }
        ]);
    });
});