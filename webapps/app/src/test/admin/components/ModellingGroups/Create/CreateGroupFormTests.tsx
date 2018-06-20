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
    CreateModellingGroupForm,
    CreateModellingGroupFormComponent, suggestId
} from "../../../../../main/admin/components/ModellingGroups/Create/CreateModellingGroupForm";
import {modellingGroupsActionCreators} from "../../../../../main/admin/actions/modellingGroupsActionCreators";

describe("CreateGroupForm", () => {
    const sandbox = new Sandbox();
    let store: any = null;

    before(() => {
        store = createMockStore(mockAdminState());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders fields", () => {

        const rendered = shallow(<CreateModellingGroupFormComponent pi={""} institution={""} errors={[]}
                                                          handleSubmit={() => null} submit={null} changeFieldValue={null}/>);

        const fields = rendered.find(Field);

        expect(fields.at(0).prop("name")).to.eq("institution");
        expect(fields.at(0).prop("validate")).to.have.members([validations.required]);

        expect(fields.at(1).prop("name")).to.eq("pi");
        expect(fields.at(1).prop("validate")).to.have.members([validations.required]);

        expect(fields.at(2).prop("name")).to.eq("id");
        expect(fields.at(2).prop("validate")).to.have.members([validations.required, validations.id]);

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

        expect(fieldName).to.eq("id");
        expect(newValue).to.eq("I-Bloggs");
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

        expect(fieldName).to.eq("id");
        expect(newValue).to.eq("I-Bloggs");
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

        expect(fieldName).to.eq("");
        expect(newValue).to.eq("");
    });

    it("doesnt set id to suggestion if instititution is null on pi change", () => {

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

        expect(fieldName).to.eq("");
        expect(newValue).to.eq("");
    });

    it("calls creates group on form submission", () => {

        const stub = sandbox.setStubReduxAction(modellingGroupsActionCreators, "createModellingGroup");

        const mounted = mount(
            <Provider store={store}>
                <CreateModellingGroupForm />
            </Provider>
        );

        mounted.simulate("submit");
        expect(stub.called).to.be.true;
    });

    describe("id suggestor", () => {
        it("can handle one word", () => {
            expect(suggestId("joe", "imperial")).to.equal("I-Joe");
        });
        it("can handle two words", () => {
            expect(suggestId("joe bloggs", "imperial college")).to.equal("IC-Bloggs");
        });
        it("can handle many words", () => {
            expect(suggestId("joe samuel stephen bloggs", "london school of public health")).to.equal("LSOPH-Bloggs");
        });
        it("strips out bad characters", () => {
            expect(suggestId("j_1-o=%_e_", "imper=-i_al")).to.equal("I-Joe");
        });
        it("strips out numbers", () => {
            expect(suggestId("1jo32e", "imperial3123l")).to.equal("I-Joe");
        });
        it("returns null if one input is null", () => {
            expect(suggestId(null, "imperial")).to.be.null;
            expect(suggestId("joe", null)).to.be.null;
        });
    });
});