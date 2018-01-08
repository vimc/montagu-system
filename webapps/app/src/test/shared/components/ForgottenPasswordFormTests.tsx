import * as React from "react";
import { Reform } from "alt-reform";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as sinon from "sinon";
import { Sandbox } from "../../Sandbox";
import { mockEvent } from "../../mocks/mocks";
import { mockFormProperties, numberOfSubmissionActions } from "../../mocks/mockForm";
import { mockFetcher, mockResponse, mockResult, promiseJSON } from "../../mocks/mockRemote";
import { ValidationError } from "../../../main/shared/components/Login/ValidationError";
import { expectOrderedActions } from "../../actionHelpers";
import { ForgottenPasswordFormComponent } from "../../../main/shared/components/Login/ForgottenPasswordForm";
import {
    ForgottenPasswordFields,
    forgottenPasswordFormStore
} from "../../../main/shared/components/Login/ForgottenPasswordFormStore";
import { makeNotification, notificationActions } from "../../../main/shared/actions/NotificationActions";

function checkSubmit(form: Reform<ForgottenPasswordFields>,
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

describe("ForgottenPasswordForm", () => {
    const sandbox = new Sandbox();
    let form: Reform<ForgottenPasswordFields>;

    before(() => {
        form = forgottenPasswordFormStore("test");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders fields", () => {
        form.change({
            email: "saruman@isengard"
        });

        const rendered = shallow(<ForgottenPasswordFormComponent {...mockFormProperties(form)} />);
        expect(rendered.find({ name: "email" }).prop("value")).to.equal("saruman@isengard");
    });

    it("renders validation errors", () => {
        const errors = {
            email: "Blah blah"
        };
        const rendered = shallow(<ForgottenPasswordFormComponent {...mockFormProperties(form, errors)} />);
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
            expect(spy.args[0][0]).to.equal("/password/request-link/?email=email@example.com");
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
                [{ action: "ForgottenPassword_test/submitFailed", payload: "An error occurred sending password reset email" }],
                numberOfSubmissionActions
            );
        });
    });

    it("notifies when response is success", (done: DoneCallback) => {

        const spy = sandbox.sinon.spy(notificationActions, "notify");

        mockFetcher(Promise.resolve(promiseJSON({status: "success", errors: [], data: "OK"})));
        form.change({
            email: "an@email"
        });

        const expectedNotification = makeNotification("Thank you. If we have an account registered for this email address you will receive a reset password link", "info")

        checkSubmit(form, done, sandbox, _ => {
            expect(spy.calledWith(expectedNotification)).to.be.true;
        });

    });

    it("displays error when response is failure", (done: DoneCallback) => {

        mockFetcher(Promise.resolve(promiseJSON({status: "failure", errors: [{code: "code", message: "some error message"}], data: null})));
        form.change({
            email: "an@email"
        });

        checkSubmit(form, done, sandbox, spy => {
            expectOrderedActions(
                spy,
                [{ action: "ForgottenPassword_test/submitFailed", payload: "some error message" }],
                numberOfSubmissionActions
            );
        });
    });
});