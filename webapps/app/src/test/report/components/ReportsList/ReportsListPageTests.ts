import {ReportsListPage} from "../../../../main/report/components/ReportsList/ReportsListPage";
import {addNavigationTests} from "../../../shared/NavigationTests";
import {Sandbox} from "../../../Sandbox";
import {mockReport} from "../../../mocks/mockModels";
import {mockFetcherForMultipleResponses} from "../../../mocks/mockMultipleEndpoints";
import {mockReportsEndpoint} from "../../../mocks/mockEndpoints";
import {mockLocation, mockMatch} from "../../../mocks/mocks";

describe("Reporting MainMenu", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const page = new ReportsListPage({location: mockLocation(), router: null, match: mockMatch()});
    addNavigationTests(page, sandbox, () => {
        mockFetcherForMultipleResponses([
            mockReportsEndpoint([mockReport()])
        ]);
    });
});