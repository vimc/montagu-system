import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {mockFetcher} from "../../../../mocks/mockRemote";
import {Form} from "../../../../../main/shared/components/Form";
import {ModelRunParametersForm} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersForm";

describe('ModelRunParameterForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    before(() => mockFetcher(Promise.resolve(null)));

    afterEach(() => sandbox.restore());

    it("renders Form", () => {

        rendered = shallow(<ModelRunParametersForm
            url={"url"}
            disease={"d1"}
        />);

        const form = rendered.find(Form);
        expect(form).to.have.lengthOf(1);
    });

    it("populates hidden disease input", () => {

        rendered = shallow(<ModelRunParametersForm
            url={"url"}
            disease={"d1"}
        />);

        const input = rendered.find('input[name="disease"][type="hidden"]');
        expect(input).to.have.lengthOf(1);
        expect(input.prop("value")).to.eql("d1");

    });

    it("populate hidden description input", () => {

        rendered = shallow(<ModelRunParametersForm
            url={"url"}
            disease={"d1"}
        />);

        const input = rendered.find('input[name="description"][type="hidden"]');
        expect(input).to.have.lengthOf(1);
    });

});