import {ContribForgottenPasswordPage} from "../../../main/contrib/components/ContribForgottenPasswordPage";
import {Sandbox} from "../../Sandbox";
import {addNavigationTests} from "../../shared/NavigationTests";
import {mockLocation, mockMatch} from "../../mocks/mocks";

describe("ContribForgottenPasswordPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());
    const location = mockLocation();
    const match = mockMatch(undefined);

    const page = new ContribForgottenPasswordPage({location, match, router: null, history: null});
    addNavigationTests(page, sandbox);
});