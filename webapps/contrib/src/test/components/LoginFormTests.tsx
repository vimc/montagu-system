import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as sinon from "sinon";
import { LoginFields, loginForm, LoginFormComponent } from "../../main/components/Login/LoginPage";
import { mockFormProperties, numberOfSubmissionActions } from "../mocks/mockForm";
import { mockFetcher, promiseJSON } from "../mocks/mockRemote";
import { ValidationError } from "../../main/components/Login/ValidationError";
import * as actionHelpers from "../actionHelpers";
import { mockEvent } from "../mocks/mocks";
import { Reform } from "alt-reform";
const jwt = require("jsonwebtoken");

function checkSubmit(
    form: Reform<LoginFields>,
    done: DoneCallback,
    callback: (spy: sinon.SinonSpy) => void)
{
    const spy = actionHelpers.dispatchSpy();
    form.submit(mockEvent()).then(x => {
        callback(spy);
        done();
    }).catch(x => {
        done(Error(x));
    });
}

describe("LoginForm", () => {
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
        const token = jwt.sign({
            sub: "username",
            permissions: "",
            roles: ""
        }, "secret");
        mockFetcher(new Promise<Response>(function (resolve, reject) {
            resolve(promiseJSON({ access_token: token }));
        }));
        loginForm.change({
            email: "an@email",
            password: "not-real"
        });
        checkSubmit(loginForm, done, spy => {
            actionHelpers.expectOrderedActions(
                spy,
                [ { action: "AuthActions.logIn" } ],
                numberOfSubmissionActions
            );
            actionHelpers.expectFetchActions(spy, "MainActions", numberOfSubmissionActions + 1);
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
        checkSubmit(loginForm, done, spy => {
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
        checkSubmit(loginForm, done, spy => {
            actionHelpers.expectOrderedActions(
                spy,
                [ { action: "Login/submitFailed", payload: "An error occurred logging in" } ],
                numberOfSubmissionActions
            );
        });
    });

    afterEach(() => {
        actionHelpers.restoreDispatch();
    });
});