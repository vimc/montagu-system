import * as React from "react";
import {expect} from "chai";
import {Sandbox} from "../../../../Sandbox";
import {shallow} from "enzyme";
import {
    mockModellingGroup,
    mockModelRunParameterSet,
    mockResponsibilitySet,
    mockTouchstone
} from "../../../../mocks/mockModels";
import alt from "../../../../../main/shared/alt";
import {ModelRunParametersSection} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersSection";
import {ModelRunParametersContentComponent} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersContent";

describe("ModelRunParameterContentTests", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("can get props from stores", () => {

        const group = mockModellingGroup();
        const touchstone = mockTouchstone();
        const sets = [mockModelRunParameterSet()];

        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                currentTouchstone: touchstone,
                currentModellingGroup: group,
                responsibilitySets: [mockResponsibilitySet(), mockResponsibilitySet()],
                ready: true
            },
            RunParametersStore: {
                oneTimeToken: "token",
                parameterSets: sets

            }
        }));

        const props = ModelRunParametersContentComponent.getPropsFromStores();
        expect(props).to.eql({
            diseases: ["disease-id"],
            group: group,
            touchstone: touchstone,
            ready: true
        })

    });

    it("renders UploadModelRunParametersSection for each disease", () => {
        const props = {
            touchstone: mockTouchstone({id: "touchstone-1"}),
            group: mockModellingGroup({id: "group-1"}),
            diseases: ["disease-1", "disease-2"],
            ready: true
        };

        const rendered = shallow(<ModelRunParametersContentComponent {...props} />);
        const sections = rendered.find(ModelRunParametersSection);
        expect(sections.length).to.eq(2);
        expect(sections.first().prop("url")).to.eq("/modelling-groups/group-1/model-run-parameters/touchstone-1/")
    });

});