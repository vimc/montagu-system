import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {mockFetcher} from "../../../../mocks/mockRemote";
import {UploadModelRunParametersForm} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/UploadModelRunParametersForm";
import {UploadForm} from "../../../../../main/shared/components/UploadForm";

describe('UploadModelRunParametersForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    before(() => mockFetcher(Promise.resolve(null)));

    afterEach(() => sandbox.restore());

    it("renders UploadForm", () => {

        rendered = shallow(<UploadModelRunParametersForm
            token={"token"}
            groupId={"group-1"}
            touchstoneId={"touchstone-id"}
            diseases={["d1"]}
        />);

        const form = rendered.find(UploadForm);
        expect(form).to.have.lengthOf(1);

    });

    it("renders disease select input", () => {

        rendered = shallow(<UploadModelRunParametersForm
            token={"token"}
            groupId={"group-1"}
            touchstoneId={"touchstone-id"}
            diseases={["d1"]}
        />);

        const select = rendered.find('select[name="disease"]');
        expect(select).to.have.lengthOf(1);

        const options = select.find("option");
        expect(options).to.have.lengthOf(2);

        expect(options.first().text()).to.equal("-- Select a disease --");
        expect(options.first().prop("value")).to.be.empty;

        expect(options.last().text()).to.equal("d1");
        expect(options.last().prop("value")).to.equal("d1");

    });

    it("renders description text input", () => {

        rendered = shallow(<UploadModelRunParametersForm
            token={"token"}
            groupId={"group-1"}
            touchstoneId={"touchstone-id"}
            diseases={["d1"]}
        />);

        const input = rendered.find('input[name="description"]');
        expect(input).to.have.lengthOf(1);
    });

    it("enables submit is false if no description", () => {

        rendered = shallow(<UploadModelRunParametersForm
            token={"token"}
            groupId={"group-1"}
            touchstoneId={"touchstone-id"}
            diseases={["d1"]}
        />);

        const select = rendered.find('select[name="disease"]');
        select.simulate("change", { target: { value: "some disease"}});

        const form = rendered.find(UploadForm);
        expect(form.prop("enableSubmit")).to.be.false;
    });

    it("enables submit is false if no disease", () => {

        rendered = shallow(<UploadModelRunParametersForm
            token={"token"}
            groupId={"group-1"}
            touchstoneId={"touchstone-id"}
            diseases={["d1"]}
        />);

        const input = rendered.find('input[name="description"]');
        input.simulate("change", { target: { value: "some description"}});

        const form = rendered.find(UploadForm);
        expect(form.prop("enableSubmit")).to.be.false;
    });

    it("enables submit is true if disease and description selected", () => {

        rendered = shallow(<UploadModelRunParametersForm
            token={"token"}
            groupId={"group-1"}
            touchstoneId={"touchstone-id"}
            diseases={["d1"]}
        />);

        const input = rendered.find('input[name="description"]');
        input.simulate("change", { target: { value: "some description"}});

        const select = rendered.find('select[name="disease"]');
        select.simulate("change", { target: { value: "some disease"}});

        const form = rendered.find(UploadForm);
        expect(form.prop("enableSubmit")).to.be.true;

    });


});