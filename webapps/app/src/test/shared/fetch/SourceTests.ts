import {expect} from "chai";
import {processEncodedResultAndNotifyOnErrors} from "../../../main/shared/sources/Source";
import {Sandbox} from "../../Sandbox";
import {jwtDecoder} from "../../../main/shared/sources/JwtDecoder";
import {mockResult} from "../../mocks/mockRemote";
import {makeNotificationException} from "../../../main/shared/actions/NotificationActions";
import {expectNoActions, expectOneAction} from "../../actionHelpers";

describe("processEncodedResultAndNotifyOnErrors", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("returns result", () => {

        const decodedResult = mockResult("OK");

        sandbox.sinon.stub(jwtDecoder, "jwtDecode").returns({result: JSON.stringify(decodedResult)});

        const result = processEncodedResultAndNotifyOnErrors<string>({result: "encodedstring"});

        expect(result).to.equal("OK")
    });

    it("notifies of error if result status is failure", () => {

        const decodedResult = mockResult(null, [{code: "e1", message: "an error"}], "failure");

        sandbox.sinon.stub(jwtDecoder, "jwtDecode").returns({result: JSON.stringify(decodedResult)});

        const spy = sandbox.dispatchSpy();

        processEncodedResultAndNotifyOnErrors<string>({result: "encodedstring"});

        expectOneAction(spy, {
            action: "NotificationActions.notify",
            payload: { type: "error", message: "an error" }
        });
    });

    it("does nothing if result does not exist", () => {
        const spy = sandbox.dispatchSpy();

        const obj = {} as any;
        processEncodedResultAndNotifyOnErrors<string>(obj);

        expectNoActions(spy);
    });

});