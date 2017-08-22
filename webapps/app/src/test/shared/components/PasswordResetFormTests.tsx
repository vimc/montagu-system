import * as React from "react";
import { Reform } from "alt-reform";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as sinon from "sinon";
import { PasswordResetFields, passwordResetForm } from "../../../main/shared/components/Login/PasswordResetForm";
import { PasswordResetFormComponent } from "../../../main/shared/components/Login/PasswordResetFormComponent";
import { Sandbox } from "../../Sandbox";
import { mockEvent } from "../../mocks/mocks";
import { mockFormProperties, numberOfSubmissionActions } from "../../mocks/mockForm";
import { mockFetcher, mockResponse, mockResult } from "../../mocks/mockRemote";
import { ValidationError } from "../../../main/shared/components/Login/ValidationError";
import { expectOrderedActions } from "../../actionHelpers";

function checkSubmit(form: Reform<PasswordResetFields>,
                     done: DoneCallback,
                     sandbox: Sandbox,
                     callback: (spy: sinon.SinonSpy) => void) {
    const spy = sandbox.dispatchSpy();
    form.submit(mockEvent()).then(() => {
        callback(spy);
        done();
    }).catch(x => {
        done(Error(x));
    });
}

describe("PasswordResetForm", () => {
    const sandbox = new Sandbox();
    let form: Reform<PasswordResetFields>;

    before(() => {
        form = passwordResetForm("test");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders fields", () => {
        form.change({
            email: "saruman@isengard"
        });

        const rendered = shallow(<PasswordResetFormComponent {...mockFormProperties(form)} />);
        expect(rendered.find({ name: "email" }).prop("value")).to.equal("saruman@isengard");
    });

    it("renders validation errors", () => {
        const errors = {
            email: "Blah blah"
        };
        const rendered = shallow(<PasswordResetFormComponent {...mockFormProperties(form, errors)} />);
        const validationErrors = rendered.find(ValidationError);
        let hasMessage: boolean = false;
        validationErrors.forEach(x => {
            hasMessage = hasMessage || x.prop("message") == "Blah blah";
        });
        expect(hasMessage).to.equal(true, "Expected there to be at least one ValidationError containing the message 'Blah blah'");
    });

    it("posts when form is submitted", (done: DoneCallback) => {
        mockFetcher(mockResponse(mockResult("")));
        const spy = sandbox.fetcherSpy();
        const data = {
            email: "email@example.com"
        };
        form.change(data);
        checkSubmit(form, done, sandbox, _ => {
            expect(spy.called).to.be.true;
            expect(spy.args[0][0]).to.equal("/password/request_link/?email=email@example.com");
            expect(spy.args[0][1]).to.eql({
                method: "post"
            });
        });
    });

    it("displays error when post fails", (done: DoneCallback) => {
        mockFetcher(Promise.reject(true));
        form.change({
            email: "email@example.com"
        });
        checkSubmit(form, done, sandbox, spy => {
            expectOrderedActions(
                spy,
                [{ action: "Password_reset_test/submitFailed", payload: "An error occurred sending password reset email" }],
                numberOfSubmissionActions
            );
        });
    });
});