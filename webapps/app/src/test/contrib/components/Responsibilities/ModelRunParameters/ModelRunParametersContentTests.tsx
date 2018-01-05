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

describe("ModelRunParameterUploadSectionTests", () => {
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
            parametersToken: "token",
            sets: sets,
            ready: true
        })

    });

    it("can get props from stores when token is not fetched yet", () => {

        const group = mockModellingGroup();
        const touchstone = mockTouchstone();

        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                currentTouchstone: touchstone,
                currentModellingGroup: group,
                parametersOneTimeToken: null,
                responsibilitySets: [mockResponsibilitySet(), mockResponsibilitySet()],
                ready: true
            }
        }));

        const props = ModelRunParametersContentComponent.getPropsFromStores();
        expect(props).to.eql({
            diseases: [],
            group: null,
            touchstone: null,
            parametersToken: null,
            sets: [],
            ready: false
        })
    });

    it("renders UploadModelRunParametersSection for each disease", () => {
        const props = {
            touchstone: mockTouchstone({id: "touchstone-1"}),
            group: mockModellingGroup({id: "group-1"}),
            parametersToken: "TOKEN",
            diseases: ["disease-1", "disease-2"],
            sets: [mockModelRunParameterSet()],
            ready: true
        };

        const rendered = shallow(<ModelRunParametersContentComponent {...props} />);
        expect(rendered.find(ModelRunParametersSection).length).to.eq(3);
    });

});