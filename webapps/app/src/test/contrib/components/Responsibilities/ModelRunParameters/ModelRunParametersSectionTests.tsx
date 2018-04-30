import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";

import "../../../../helper";
import {Sandbox} from "../../../../Sandbox";
import {mockFetcher} from "../../../../mocks/mockRemote";
import {ModelRunParametersSection} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersSection";
import {ModelRunParametersForm} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersForm";
import {ModelRunParametersStatus} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersStatus";

describe('Model Run Parameter Section Component tests', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    before(() => mockFetcher(Promise.resolve(null)));

    afterEach(() => sandbox.restore());

    it("renders Form", () => {

        rendered = shallow(<ModelRunParametersSection
            disease={"d1"}
        />);

        const form = rendered.find(ModelRunParametersForm);
        expect(form).to.have.lengthOf(1);
    });

    it("renders status", () => {

        rendered = shallow(<ModelRunParametersSection
            disease={"d1"}
        />);

        const input = rendered.find(ModelRunParametersStatus);
        expect(input).to.have.lengthOf(1);
    });
});