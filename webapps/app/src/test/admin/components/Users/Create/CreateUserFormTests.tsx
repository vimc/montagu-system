import * as React from "react";
import {expect} from "chai";
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

    before(() => {
        store = createMockStore(mockAdminState());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders fields", () => {

        const rendered = shallow(<CreateUserFormComponent errors={[]}
            handleSubmit={() => null} submit={null} changeFieldValue={null}/>);

        const fields = rendered.find(Field);

        expect(fields.at(0).prop("name")).to.eq("name");
        expect(fields.at(0).prop("validate")).to.have.members([validations.required]);

        expect(fields.at(1).prop("name")).to.eq("email");
        expect(fields.at(1).prop("validate")).to.have.members([validations.required, validations.email]);

        expect(fields.at(2).prop("name")).to.eq("username");
        expect(fields.at(2).prop("validate")).to.have.members([validations.required, validations.username]);
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

        expect(fieldName).to.eq("username");
        expect(newValue).to.eq("joe.bloggs");
    });

    it("calls creates user on form submission", () => {

        const stub = sandbox.setStubReduxAction(usersActionCreators, "createUser");

        const mounted = mount(
            <Provider store={store}>
                <CreateUserForm />
            </Provider>
        );

        mounted.simulate("submit");
        expect(stub.called).to.be.true;
    });

    describe("username suggestor", () => {
        it("can handle one word", () => {
            expect(suggestUsername("joe")).to.equal("joe");
        });
        it("can handle two words", () => {
            expect(suggestUsername("joe bloggs")).to.equal("joe.bloggs");
        });
        it("can handle many words", () => {
            expect(suggestUsername("joe samuel stephen bloggs")).to.equal("joe.bloggs");
        });
        it("converts to lower case", () => {
            expect(suggestUsername("Joe Bloggs")).to.equal("joe.bloggs");
        });
        it("strips out bad characters", () => {
            expect(suggestUsername("j_1-o=%_e_")).to.equal("joe");
        });
    });
});