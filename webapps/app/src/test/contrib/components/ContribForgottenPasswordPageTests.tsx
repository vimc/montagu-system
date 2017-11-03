import {ContribForgottenPasswordPage} from "../../../main/contrib/components/ContribForgottenPasswordPage";
import {Sandbox} from "../../Sandbox";
import {addNavigationTests} from "../../shared/NavigationTests";

describe("ContribForgottenPasswordPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    addNavigationTests(new ContribForgottenPasswordPage(), sandbox);
});