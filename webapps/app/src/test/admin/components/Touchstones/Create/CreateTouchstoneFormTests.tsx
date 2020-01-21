import * as React from "react";

import {mount, shallow} from "enzyme";
import {Sandbox} from "../../../../Sandbox";

import {mockAdminState} from "../../../../mocks/mockStates";
import {createMockStore} from "../../../../mocks/mockStore";
import {Field} from "redux-form";
import {validations} from "../../../../../main/shared/modules/reduxForm";
import {Provider} from "react-redux";
import {
    CreateTouchstoneForm,
    CreateTouchstoneFormComponent
} from "../../../../../main/admin/components/Touchstones/Create/CreateTouchstoneForm";
import {adminTouchstoneActionCreators} from "../../../../../main/admin/actions/adminTouchstoneActionCreators";
import {ReduxFormValidationErrors} from "../../../../../main/shared/components/ReduxForm/ReduxFormValidationError";

describe("CreateTouchstoneForm", () => {
    const sandbox = new Sandbox();
    let store: any = null;

    beforeAll(() => {
        store = createMockStore(mockAdminState());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders fields", () => {

        const rendered = shallow(<CreateTouchstoneFormComponent errors={[]}
                                                                handleSubmit={() => null} submit={null}
                                                                changeFieldValue={null}/>);

        const fields = rendered.find(Field);

        expect(fields.at(0).prop("name")).toEqual("id");
        expect(fields.at(0).prop("validate")).toEqual([validations.required, validations.id]);

        expect(fields.at(1).prop("name")).toEqual("description");
        expect(fields.at(1).prop("validate")).toEqual([validations.required]);

        expect(fields.at(2).prop("name")).toEqual("comment");
        expect(fields.at(2).prop("validate")).toBeUndefined();
    });

    it("calls creates touchstone on form submission", () => {

        const stub = sandbox.setStubReduxAction(adminTouchstoneActionCreators, "createTouchstone");

        const mounted = mount(
            <Provider store={store}>
                <CreateTouchstoneForm/>
            </Provider>
        );

        mounted.simulate("submit");
        expect(stub.mock.calls.length).toBe(1);
    });

    it("renders createTouchstoneErrors from state", () => {
        const errors = [{
            code: "e",
            message: "error message"
        }];

        store = createMockStore(mockAdminState({
            touchstones: {
                createTouchstoneErrors: errors
            }
        }));

        const rendered = shallow(<CreateTouchstoneForm/>, {context: {store}}).dive().dive().dive().dive();
        expect(rendered.find(ReduxFormValidationErrors).prop("errors")).toEqual(errors);

    });
});