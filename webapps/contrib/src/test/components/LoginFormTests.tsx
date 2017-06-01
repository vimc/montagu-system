import * as React from "react";
import { Reform } from "alt-reform";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as sinon from "sinon";
import { Sandbox } from "../Sandbox";
import { mockFetcher, promiseJSON } from "../mocks/mockRemote";
import { mockFormProperties, numberOfSubmissionActions } from "../mocks/mockForm";
import { mockEvent } from "../mocks/mocks";
import * as actionHelpers from "../actionHelpers";

import { authStore } from "../../main/stores/AuthStore";
import { LoginFields, loginForm, LoginFormComponent } from "../../main/components/Login/LoginPage";
import { ValidationError } from "../../main/components/Login/ValidationError";

function checkSubmit(
    form: Reform<LoginFields>,
    done: DoneCallback,
    sandbox: Sandbox,
    callback: (spy: sinon.SinonSpy) => void)
{
    const spy = actionHelpers.dispatchSpy(sandbox);
    form.submit(mockEvent()).then(x => {
        callback(spy);
        done();
    }).catch(x => {
        done(Error(x));
    });
}

describe("LoginForm", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders fields", () => {
        loginForm.change({
            email: "an@email",
            password: "not-real"
        });

        const rendered = shallow(<LoginFormComponent {...mockFormProperties(loginForm)} />);
        expect(rendered.find({ name: "email" }).prop("value")).to.equal("an@email");
        expect(rendered.find({ name: "password" }).prop("value")).to.equal("not-real");
    });

    it("renders validation errors", () => {
        const errors = {
            email: "Blah blah"
        };
        const rendered = shallow(<LoginFormComponent {...mockFormProperties(loginForm, errors)} />);
        const validationErrors = rendered.find(ValidationError);
        let hasMessage: boolean = false;
        validationErrors.forEach(x => {
            hasMessage = hasMessage || x.prop("message") == "Blah blah";
        });
        expect(hasMessage).to.equal(true, "Expected there to be at least one ValidationError containing the message 'Blah blah'");
    });

    it("authenticates when form is submitted", (done: DoneCallback) => {
        const token = "TOKEN";
        const spy = sandbox.sinon.spy(authStore, "logIn");

        mockFetcher(new Promise<Response>(function (resolve, reject) {
            resolve(promiseJSON({ access_token: token }));
        }));
        loginForm.change({
            email: "an@email",
            password: "not-real"
        });
        checkSubmit(loginForm, done, sandbox, _ => {
            expect(spy.called).to.be.true;
            expect(spy.args[0][0]).to.equal(token);
            spy.restore();
        });

    });

    it("displays error when credentials are wrong", (done: DoneCallback) => {
        mockFetcher(new Promise<Response>(function (resolve, reject) {
            resolve(promiseJSON({ error: "Wrong password" }));
        }));
        loginForm.change({
            email: "an@email",
            password: "not-real"
        });
        checkSubmit(loginForm, done, sandbox, spy => {
            actionHelpers.expectOrderedActions(
                spy,
                [ { action: "Login/submitFailed", payload: "Your username or password is incorrect" } ],
                numberOfSubmissionActions
            );
        });
    });

    it("displays error when login fails", (done: DoneCallback) => {
        mockFetcher(new Promise<Response>(function (resolve, reject) {
            reject(true);
        }));
        loginForm.change({
            email: "an@email",
            password: "not-real"
        });
        checkSubmit(loginForm, done, sandbox, spy => {
            actionHelpers.expectOrderedActions(
                spy,
                [ { action: "Login/submitFailed", payload: "An error occurred logging in" } ],
                numberOfSubmissionActions
            );
        });
    });
});