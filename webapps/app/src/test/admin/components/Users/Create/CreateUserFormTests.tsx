import * as React from "react";

import {mount, shallow} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {
    CreateUserForm,
    CreateUserFormComponent, suggestUsername
} from "../../../../../main/admin/components/Users/Create/CreateUserForm";

import {mockAdminState} from "../../../../mocks/mockStates";
import {createMockStore} from "../../../../mocks/mockStore";
import {Field} from "redux-form";
import {validations} from "../../../../../main/shared/modules/reduxForm";
import {usersActionCreators} from "../../../../../main/admin/actions/usersActionCreators";
import {Provider} from "react-redux";

describe("CreateUserForm", () => {
    const sandbox = new Sandbox();
    let store: any = null;

    beforeAll(() => {
        store = createMockStore(mockAdminState());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders fields", () => {

        const rendered = shallow(<CreateUserFormComponent errors={[]}
            handleSubmit={() => null} submit={null} changeFieldValue={null}/>);

        const fields = rendered.find(Field);

        expect(fields.at(0).prop("name")).toEqual("name");
        expect(fields.at(0).prop("validate")).toEqual([validations.required]);

        expect(fields.at(1).prop("name")).toEqual("email");
        expect(fields.at(1).prop("validate")).toEqual([validations.required, validations.email]);

        expect(fields.at(2).prop("name")).toEqual("username");
        expect(fields.at(2).prop("validate")).toEqual([validations.required, validations.username]);
    });

    it("sets username to suggestion when name changes", () => {

        let fieldName = "";
        let newValue = "";

        const changeFieldMock = (field: string, value: string) => {
            fieldName = field;
            newValue = value;
        };

        const rendered = shallow(<CreateUserFormComponent errors={[]}
            handleSubmit={() => null} submit={null} changeFieldValue={changeFieldMock}/>);

        const event = {target: {value: "Joe Bloggs"}};
        const field = rendered.find(Field).at(0);

        field.simulate("change", event);

        expect(fieldName).toEqual("username");
        expect(newValue).toEqual("joe.bloggs");
    });

    it("calls creates user on form submission", () => {

        const stub = sandbox.setStubReduxAction(usersActionCreators, "createUser");

        const mounted = mount(
            <Provider store={store}>
                <CreateUserForm />
            </Provider>
        );

        mounted.simulate("submit");
        expect(stub.mock.calls.length).toBe(1);
    });

    describe("username suggestor", () => {
        it("can handle one word", () => {
            expect(suggestUsername("joe")).toEqual("joe");
        });
        it("can handle two words", () => {
            expect(suggestUsername("joe bloggs")).toEqual("joe.bloggs");
        });
        it("can handle many words", () => {
            expect(suggestUsername("joe samuel stephen bloggs")).toEqual("joe.bloggs");
        });
        it("converts to lower case", () => {
            expect(suggestUsername("Joe Bloggs")).toEqual("joe.bloggs");
        });
        it("strips out bad characters", () => {
            expect(suggestUsername("j_1-o=%_e_")).toEqual("joe");
        });
    });
});