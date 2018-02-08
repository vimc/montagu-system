import {MainMenu} from "../../../main/report/components/MainMenu/MainMenu";
import {addNavigationTests} from "../../shared/NavigationTests";
import {Sandbox} from "../../Sandbox";
import {mockReport} from "../../mocks/mockModels";
import {mockFetcherForMultipleResponses} from "../../mocks/mockMultipleEndpoints";
import {mockReportsEndpoint} from "../../mocks/mockEndpoints";
import {mockLocation} from "../../mocks/mocks";

describe("Reporting MainMenu", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const page = new MainMenu({location: mockLocation(), router: null});
    addNavigationTests(page, sandbox, () => {
        mockFetcherForMultipleResponses([
            mockReportsEndpoint([mockReport()])
        ]);
    });
});