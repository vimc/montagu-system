import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {mockFetcher} from "../../../../mocks/mockRemote";
import {ModelRunParametersSection} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersSection";
import {Form} from "../../../../../main/shared/components/Form";

describe('ModelRunParameterSection', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    before(() => mockFetcher(Promise.resolve(null)));

    afterEach(() => sandbox.restore());

    it("renders Form", () => {

        rendered = shallow(<ModelRunParametersSection
            url={"url"}
            sets={[]}
            disease={"d1"}
        />);

        const form = rendered.find(Form);
        expect(form).to.have.lengthOf(1);
    });

    it("populates hidden disease input", () => {

        rendered = shallow(<ModelRunParametersSection
            url={"url"}
            sets={[]}
            disease={"d1"}
        />);

        const input = rendered.find('input[name="disease"][type="hidden"]');
        expect(input).to.have.lengthOf(1);
        expect(input.prop("value")).to.eql("d1");

    });

    it("populate hidden description input", () => {

        rendered = shallow(<ModelRunParametersSection
            url={"url"}
            sets={[]}
            disease={"d1"}
        />);

        const input = rendered.find('input[name="description"][type="hidden"]');
        expect(input).to.have.lengthOf(1);
    });

});