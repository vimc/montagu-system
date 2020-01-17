import * as React from "react";

import {mount, shallow} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {mockAdminState} from "../../../../mocks/mockStates";
import {createMockStore} from "../../../../mocks/mockStore";
import {Field} from "redux-form";
import {validations} from "../../../../../main/shared/modules/reduxForm";
import {Provider} from "react-redux";
import {
    CreateModellingGroupForm,
    CreateModellingGroupFormComponent, suggestId
} from "../../../../../main/admin/components/ModellingGroups/Create/CreateModellingGroupForm";
import {modellingGroupsActionCreators} from "../../../../../main/admin/actions/modellingGroupsActionCreators";

describe("CreateGroupForm", () => {
    const sandbox = new Sandbox();
    let store: any = null;

    beforeAll(() => {
        store = createMockStore(mockAdminState());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders fields", () => {

        const rendered = shallow(<CreateModellingGroupFormComponent pi={""} institution={""} errors={[]}
                                                          handleSubmit={() => null} submit={null} changeFieldValue={null}/>);

        const fields = rendered.find(Field);

        expect(fields.at(0).prop("name")).toEqual("institution");
        expect(fields.at(0).prop("validate")).toEqual([validations.required]);

        expect(fields.at(1).prop("name")).toEqual("pi");
        expect(fields.at(1).prop("validate")).toEqual([validations.required]);

        expect(fields.at(2).prop("name")).toEqual("id");
        expect(fields.at(2).prop("validate")).toEqual([validations.required, validations.id]);

    });

    it("sets id to suggestion when pi changes", () => {

        let fieldName = "";
        let newValue = "";

        const changeFieldMock = (field: string, value: string) => {
            fieldName = field;
            newValue = value;
        };

        const rendered = shallow(<CreateModellingGroupFormComponent pi={""} institution={"Imperial"} errors={[]}
                                                                    handleSubmit={() => null} submit={null}
                                                                    changeFieldValue={changeFieldMock}/>);

        const event = {target: {value: "Joe Bloggs"}};
        const field = rendered.find(Field).at(1);

        field.simulate("change", event);

        expect(fieldName).toEqual("id");
        expect(newValue).toEqual("I-Bloggs");
    });

    it("sets id to suggestion when instiution changes", () => {

        let fieldName = "";
        let newValue = "";

        const changeFieldMock = (field: string, value: string) => {
            fieldName = field;
            newValue = value;
        };

        const rendered = shallow(<CreateModellingGroupFormComponent pi={"Joe Bloggs"} institution={""} errors={[]}
                                                                    handleSubmit={() => null} submit={null}
                                                                    changeFieldValue={changeFieldMock}/>);

        const event = {target: {value: "Imperial"}};
        const field = rendered.find(Field).at(0);

        field.simulate("change", event);

        expect(fieldName).toEqual("id");
        expect(newValue).toEqual("I-Bloggs");
    });

    it("doesnt set id to suggestion if pi is null on instiution changes", () => {

        let fieldName = "";
        let newValue = "";

        const changeFieldMock = (field: string, value: string) => {
            fieldName = field;
            newValue = value;
        };

        const rendered = shallow(<CreateModellingGroupFormComponent pi={null} institution={""} errors={[]}
                                                                    handleSubmit={() => null} submit={null}
                                                                    changeFieldValue={changeFieldMock}/>);

        const event = {target: {value: "Imperial"}};
        const field = rendered.find(Field).at(0);

        field.simulate("change", event);

        expect(fieldName).toEqual("");
        expect(newValue).toEqual("");
    });

    it(
        "doesnt set id to suggestion if instititution is null on pi change",
        () => {

            let fieldName = "";
            let newValue = "";

            const changeFieldMock = (field: string, value: string) => {
                fieldName = field;
                newValue = value;
            };

            const rendered = shallow(<CreateModellingGroupFormComponent pi={""} institution={null} errors={[]}
                                                                        handleSubmit={() => null} submit={null}
                                                                        changeFieldValue={changeFieldMock}/>);

            const event = {target: {value: "Joe Bloggs"}};
            const field = rendered.find(Field).at(1);

            field.simulate("change", event);

            expect(fieldName).toEqual("");
            expect(newValue).toEqual("");
        }
    );

    it("calls creates group on form submission", () => {

        const stub = sandbox.setStubReduxAction(modellingGroupsActionCreators, "createModellingGroup");

        const mounted = mount(
            <Provider store={store}>
                <CreateModellingGroupForm />
            </Provider>
        );

        mounted.simulate("submit");
        expect(stub.mock.calls.length).toBe(1);
    });

    describe("id suggestor", () => {
        it("can handle one word", () => {
            expect(suggestId("joe", "imperial")).toEqual("I-Joe");
        });
        it("can handle two words", () => {
            expect(suggestId("joe bloggs", "imperial college")).toEqual("IC-Bloggs");
        });
        it("can handle many words", () => {
            expect(suggestId("joe samuel stephen bloggs", "london school of public health")).toEqual("LSOPH-Bloggs");
        });
        it("strips out bad characters", () => {
            expect(suggestId("j_1-o=%_e_", "imper=-i_al")).toEqual("I-Joe");
        });
        it("strips out numbers", () => {
            expect(suggestId("1jo32e", "imperial3123l")).toEqual("I-Joe");
        });
        it("returns null if one input is null", () => {
            expect(suggestId(null, "imperial")).toBe(null);
            expect(suggestId("joe", null)).toBe(null);
        });
    });
});