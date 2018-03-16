import * as React from "react";
import { expect } from "chai";
import { shallow, mount } from "enzyme";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { reducer as formReducer } from "redux-form";
import { combineReducers } from "redux";
import thunk from 'redux-thunk';
import { MemoryRouter as Router } from 'react-router-dom';

import "../../helper";
import { Sandbox } from "../../Sandbox";
import { mockEvent } from "../../mocks/mocks";
import { mockFormProperties, numberOfSubmissionActions } from "../../mocks/mockForm";
import { mockFetcher, mockResponse, mockResult, promiseJSON } from "../../mocks/mockRemote";
import { ValidationError } from "../../../main/shared/components/Login/ValidationError";
import { expectOrderedActions } from "../../actionHelpers";
import { ForgottenPasswordFormComponent, ForgottenPasswordForm } from "../../../main/shared/components/Login/ForgottenPasswordForm";
import { makeNotification, notificationActions } from "../../../main/shared/actions/NotificationActions";
import {authReducer} from "../../../main/shared/reducers/authReducer";
import {authActions} from "../../../main/shared/actions/authActions";


describe("ForgottenPasswordFormComponent unit testing", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders form and fields elements and submits on button click", () => {
        const spy = sandbox.sinon.spy();
        const submitMock = sandbox.createSpy();
        const formWrapper = shallow(<ForgottenPasswordFormComponent handleSubmit={submitMock} submit={spy}/>)
        expect(formWrapper.find('Field[name="email"]')).to.have.length(1);
        expect(formWrapper.find('form')).to.have.length(1);
        expect(formWrapper.find('button[type="submit"]')).to.have.length(1);
        formWrapper.find('button[type="submit"]').simulate('click');
        expect(submitMock.called).to.equal(true);
    });
});

describe("ForgottenPasswordForm connected with redux-form", () => {
    const sandbox = new Sandbox();
    let formWrapper :any = null;
    let store : any= null;

    before(() => {
        store = createStore(combineReducers({
            form: formReducer,
            auth: authReducer,
        }), applyMiddleware(thunk));

        formWrapper = mount(<Provider store={store}><Router><ForgottenPasswordForm /></Router></Provider>);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("validates email field while typing", () => {
        // initially validation box is empty
        expect(formWrapper.find(ValidationError).at(0).props().message).to.equal(null);
        // this sets field as touched
        formWrapper.find('input[name="email"]').simulate('focus');
        // this triggers validation
        formWrapper.find('input[name="email"]').simulate('blur');
        // validation box will show that email is required if we touch input field and keep it empty
        // check validation block prop
        expect(formWrapper.find(ValidationError).at(0).props().message).to.equal("Email address is required");
        // check if validation block rendered error
        expect(formWrapper.find(ValidationError).at(0).text()).to.equal("Email address is required");
        // trigger change of email field with invalid value
        formWrapper.find('input[name="email"]').simulate('change', {target: {value: 'abc'}});
        expect(formWrapper.find(ValidationError).at(0).props().message).to.equal("Email address is invalid");
        expect(formWrapper.find(ValidationError).at(0).text()).to.equal("Email address is invalid");
        // enter right value
        formWrapper.find('input[name="email"]').simulate('change', {target: {value: 'abc@abc.com'}});
        expect(formWrapper.find(ValidationError).at(0).props().message).to.equal(null);
    });

    it("submits email for forgotten password", () => {
        formWrapper.find('input[name="email"]').simulate('focus');
        formWrapper.find('input[name="email"]').simulate('change', {target: {value: 'abc@abc.com'}});
        const logInActionSpy = sandbox.setStubFunc(authActions, "forgotPassword", ()=>({type: 'test'}));
        // simulate form submit
        formWrapper.find('form.form').simulate('submit');
        expect(logInActionSpy.callCount).to.equal(1);
        expect(logInActionSpy.getCall(0).args[0]).to.equal('abc@abc.com');
    });
});