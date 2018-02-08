import {ContribForgottenPasswordPage} from "../../../main/contrib/components/ContribForgottenPasswordPage";
import {Sandbox} from "../../Sandbox";
import {addNavigationTests} from "../../shared/NavigationTests";
import {mockLocation} from "../../mocks/mocks";

describe("ContribForgottenPasswordPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const page = new ContribForgottenPasswordPage({location: mockLocation(), router: null});
    addNavigationTests(page, sandbox);
});