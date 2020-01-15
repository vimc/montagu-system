import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";

import "../../../../helper";
import {ModelRunParametersSection} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersSection";
import {ModelRunParametersForm} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersForm";
import {ModelRunParametersStatus} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersStatus";

describe('Model Run Parameter Section Component tests', () => {
    let rendered: ShallowWrapper<any, any>;

    test("renders Form", () => {

        rendered = shallow(<ModelRunParametersSection
            disease={"d1"}
        />);

        const form = rendered.find(ModelRunParametersForm);
        expect(form).to.have.lengthOf(1);
    });

    test("renders status", () => {

        rendered = shallow(<ModelRunParametersSection
            disease={"d1"}
        />);

        const input = rendered.find(ModelRunParametersStatus);
        expect(input).to.have.lengthOf(1);
    });
});