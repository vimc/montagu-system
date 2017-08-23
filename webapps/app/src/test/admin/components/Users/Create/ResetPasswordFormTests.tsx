import * as React from "react";
import { Reform } from "alt-reform";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as sinon from "sinon";
import { Sandbox } from "../../../../Sandbox";
import { mockFormProperties, numberOfSubmissionActions } from "../../../../mocks/mockForm";
import { ValidationError } from "../../../../../main/shared/components/Login/ValidationError";
import { mockFetcher, mockFetcherNonJson, mockResponse, mockResult, promiseJSON } from "../../../../mocks/mockRemote";
import { mockEvent } from "../../../../mocks/mocks";
import { expectOrderedActions } from "../../../../actionHelpers";
import {
    ResetPasswordFields,
    resetPasswordForm
} from "../../../../../main/admin/components/Users/Account/ResetPasswordForm";
import { ResetPasswordFormComponent } from "../../../../../main/admin/components/Users/Account/ResetPasswordFormComponent";
import { makeNotification, notificationActions } from "../../../../../main/shared/actions/NotificationActions";
import { accountStore } from "../../../../../main/admin/stores/AccountStore";
import { accountActions } from "../../../../../main/admin/actions/AccountActions";

function checkSubmit(form: Reform<ResetPasswordFields>,
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

describe("ResetPasswordForm", () => {
    const sandbox = new Sandbox();
    let form: Reform<ResetPasswordFields>;

    before(() => {
        form = resetPasswordForm(accountStore, "test");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders fields", () => {
        form.change({
            password: "somenewpassword"
        });

        const rendered = shallow(<ResetPasswordFormComponent {...mockFormProperties(form)} />);
        expect(rendered.find({ name: "password" }).prop("value")).to.equal("somenewpassword");
    });

    it("renders validation errors", () => {
        const errors = {
            password: "Blah blah"
        };
        const rendered = shallow(<ResetPasswordFormComponent {...mockFormProperties(form, errors)} />);
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
            password: "sometestpassword"
        };

        accountActions.setPasswordResetToken("testtoken");
        form.change(data);
        checkSubmit(form, done, sandbox, _ => {
            expect(spy.called).to.be.true;
            expect(spy.args[0][0]).to.equal("/onetime_link/testtoken/");
            expect(spy.args[0][1]).to.eql({
                method: "post",
                body: JSON.stringify(data)
            });
        });
    });

    it("displays error when post fails", (done: DoneCallback) => {
        mockFetcher(Promise.reject(true));
        form.change({
            password: "sometestpassword"
        });
        checkSubmit(form, done, sandbox, spy => {
            expectOrderedActions(
                spy,
                [{ action: "ResetPassword_test/submitFailed", payload: "An error occurred setting the password" }],
                numberOfSubmissionActions
            );
        });
    });

    it("notifies when response is success", (done: DoneCallback) => {

        const spy = sandbox.sinon.spy(notificationActions, "notify");

        mockFetcher(Promise.resolve(promiseJSON({status: "success", errors: [], data: "OK"})));
        form.change({
            password: "sometestpassword"
        });

        const expectedNotification = makeNotification("Your password has been set. Please log in with your new password to continue", "info")

        checkSubmit(form, done, sandbox, _ => {
            expect(spy.calledWith(expectedNotification)).to.be.true;
        });

    });

    it("displays error when response is failure", (done: DoneCallback) => {

        mockFetcher(Promise.resolve(promiseJSON({status: "failure", errors: [{code: "code", message: "some error message"}], data: null})));
        form.change({
            password: "sometestpassword"
        });

        checkSubmit(form, done, sandbox, spy => {
            expectOrderedActions(
                spy,
                [{ action: "ResetPassword_test/submitFailed", payload: "some error message" }],
                numberOfSubmissionActions
            );
        });
    });

    it("displays error when response is not json", (done: DoneCallback) => {

        mockFetcherNonJson(Promise.resolve(promiseJSON("arbitrarytext")));
        form.change({
            password: "sometestpassword"
        });

        checkSubmit(form, done, sandbox, spy => {
            expectOrderedActions(
                spy,
                [{ action: "ResetPassword_test/submitFailed", payload: "An error occurred setting the password" }],
                numberOfSubmissionActions
            );
        });
    });

    it("displays message when token is invalid", (done: DoneCallback) => {

        mockFetcher(Promise.resolve(promiseJSON({status: "failure", errors: [{code: "invalid-token-used", message: "some error message"}], data: null})));
        form.change({
            password: "sometestpassword"
        });

        checkSubmit(form, done, sandbox, spy => {
            expectOrderedActions(
                spy,
                [{action: "AccountActions.passwordResetTokenExpired"},
                    { action: "ResetPassword_test/submitFailed", payload: "This password reset link has expired. Please request a new one." }],
                numberOfSubmissionActions
            );
        });
    });
});