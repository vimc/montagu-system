import * as React from "react";
import {expect} from "chai";
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

    test("renders fields", () => {

        const rendered = shallow(<CreateTouchstoneFormComponent errors={[]}
                                                                handleSubmit={() => null} submit={null}
                                                                changeFieldValue={null}/>);

        const fields = rendered.find(Field);

        expect(fields.at(0).prop("name")).to.eq("id");
        expect(fields.at(0).prop("validate")).to.have.members([validations.required, validations.id]);

        expect(fields.at(1).prop("name")).to.eq("description");
        expect(fields.at(1).prop("validate")).to.have.members([validations.required]);

        expect(fields.at(2).prop("name")).to.eq("comment");
        expect(fields.at(2).prop("validate")).to.be.undefined;
    });

    test("calls creates touchstone on form submission", () => {

        const stub = sandbox.setStubReduxAction(adminTouchstoneActionCreators, "createTouchstone");

        const mounted = mount(
            <Provider store={store}>
                <CreateTouchstoneForm/>
            </Provider>
        );

        mounted.simulate("submit");
        expect(stub.called).to.be.true;
    });

    test("renders createTouchstoneErrors from state", () => {
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
        expect(rendered.find(ReduxFormValidationErrors).prop("errors")).to.have.members(errors);

    });
});