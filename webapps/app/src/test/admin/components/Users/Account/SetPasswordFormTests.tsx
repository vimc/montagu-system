import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {SetPasswordForm} from "../../../../../main/admin/components/Users/Account/SetPasswordForm";
import {usersActionCreators} from "../../../../../main/admin/actions/usersActionCreators";
import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mockAdminState} from "../../../../mocks/mockStates";
import {ReduxFormValidationErrors} from "../../../../../main/shared/components/ReduxForm/ReduxFormValidationError";
import {ErrorInfo} from "../../../../../main/shared/models/Generated";
import {Provider} from "react-redux";

describe("SetPasswordForm", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("calls correct action on submit", () => {
        const spy = sandbox.setStubReduxAction(usersActionCreators, "setPassword");
        const store = createMockAdminStore(mockAdminState());
        const rendered = sandbox.mount(<Provider store={store}>
            <SetPasswordForm resetToken="TOKEN" />
        </Provider>);
        rendered.find("form").simulate("submit");
        expect(spy.getCall(0).args).to.eql(["TOKEN", undefined]);
    });

    it("renders errors", () => {
        const error: ErrorInfo = {code: "code", message: "message"};
        const store = createMockAdminStore(mockAdminState({
            users: {
                setPasswordErrors: [error]
            }
        }));
        const rendered = shallow(<SetPasswordForm resetToken="TOKEN"/>, {context: {store}})
            .dive().dive().dive().dive();
        expect(rendered.find(ReduxFormValidationErrors).prop("errors")).to.eql([error]);
    });
});