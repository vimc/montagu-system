import * as React from "react";
import { expect } from "chai";
import { shallow, mount } from "enzyme";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { reducer as formReducer } from "redux-form";
import { combineReducers } from "redux";

import * as enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-15";
enzyme.configure({ adapter: new Adapter() });

import { authReducer } from "../../../../main/shared/reducers/authReducer";
import { Sandbox } from "../../../Sandbox";
import { LoginFormComponent, LoginForm } from "../../../../main/shared/components/Login/LoginForm";
import { ValidationError } from "../../../../main/shared/components/Login/ValidationError";
// import { reduxHelper } from "../../../reduxHelper";

describe("LoginFormComponent unit testing", () => {
    const sandbox = new Sandbox();
    let formWrapper :any = null;
    const submitMock = sandbox.createSpy();
    const dispatchMock = sandbox.createSpy();

    before(() => {
        formWrapper = shallow(<LoginFormComponent handleSubmit={submitMock} dispatch={dispatchMock}/>)
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders form and fields and submits on button click", () => {
        expect(formWrapper.find('Field[name="email"]')).to.have.length(1);
        expect(formWrapper.find('Field[name="password"]')).to.have.length(1);
        expect(formWrapper.find('form')).to.have.length(1);
        expect(formWrapper.find('button[type="submit"]')).to.have.length(1);
        formWrapper.find('button[type="submit"]').simulate('click');
        expect(submitMock.called).to.equal(true);
    });


});

describe("LoginForm connected with redux-form", () => {
    const sandbox = new Sandbox();
    let formWrapper :any = null;
    const submitMock = sandbox.createSpy();
    const dispatchMock = sandbox.createSpy();
    let store : any= null;

    before(() => {
        store = createStore(combineReducers({
            form: formReducer,
            auth: authReducer,
        }));

        formWrapper = mount(<Provider store={store}><LoginForm /></Provider>)
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders fields", () => {
        formWrapper.find('input[name="email"]').simulate('change', {target: {value: 'My new value'}});
        formWrapper.find('input[name="email"]').simulate('keydown');
        console.log(formWrapper.debug());
        console.log('state of store', JSON.stringify( store.getState(), null,2))
        console.log('validation comp debug', formWrapper.find(ValidationError).debug());
        // expect(rendered.find({ name: "email" }).prop("value")).to.equal("an@email");
    });


});