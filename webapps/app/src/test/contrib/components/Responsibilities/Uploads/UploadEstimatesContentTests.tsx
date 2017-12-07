import * as React from "react";
import {expect} from "chai";
import {
    mockBurdenEstimateSet,
    mockModellingGroup, mockResponsibility, mockScenario,
    mockTouchstone
} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";

import {findLabelledCell} from "../../../../TableHelpers";
import {Sandbox} from "../../../../Sandbox";
import {
    UploadBurdenEstimatesContentComponent,
    UploadBurdenEstimatesContentComponentProps
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesContent";
import {UploadBurdenEstimatesForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {UploadFileForm} from "../../../../../main/shared/components/UploadFileForm";
import {CreateBurdenEstimateSetForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/CreateBurdenEstimateSetForm";
import {CurrentEstimateSetSummary} from "../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";

describe("UploadEstimatesContentComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders the general metadata", () => {
        const touchstone = mockTouchstone();
        const scenario = mockScenario();
        const props = makeProps({touchstone, scenario});
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);
        expect(findLabelledCell(rendered, "Touchstone").text()).to.equal(touchstone.description);
        expect(findLabelledCell(rendered, "Scenario").text()).to.equal(scenario.description);
    });

    it("renders create form when current burden estimate set is null", () => {

        const props = makeProps({});
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm).props()).to.eql({
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1"
        });
    });

    it("does not render upload form when current burden estimate set is null", () => {

        const props = makeProps({});
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);

        const form = rendered.find(UploadFileForm);
        expect(form).to.have.lengthOf(0);
    });

    it("renders create form when current burden estimate set status is complete", () => {

        const props = makeProps({
           responsibility: mockResponsibility({
                current_estimate_set: mockBurdenEstimateSet({
                    status: "complete"
                })
            })
        });
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm).props()).to.eql({
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1"
        });
    });

    it("does not render upload form when current burden estimate set status is complete", () => {

        const props = makeProps({});
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);

        const form = rendered.find(UploadFileForm);
        expect(form).to.have.lengthOf(0);
    });


    it("renders upload form when current burden estimate set is empty", () => {

        const props = makeProps({
            responsibility: mockResponsibility({
                current_estimate_set: mockBurdenEstimateSet({
                    status: "empty"
                })
            })
        });
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);
        expect(rendered.find(UploadFileForm).props()).to.eql({
            token: "TOKEN",
            enableSubmit: true,
            uploadText: "Upload estimates for this set",
            successMessage: "Success! You have uploaded a new set of burden estimates"
        });
    });


    it("does not render create form when current burden estimate set is empty", () => {

        const props = makeProps({
            responsibility: mockResponsibility({
                current_estimate_set: mockBurdenEstimateSet({
                    status: "empty"
                })
            })
        });
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);
        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(0)
    });

    it("renders current burden estimate status", () => {

        const set = mockBurdenEstimateSet({
            status: "empty"
        });

        const props = makeProps({
            responsibility: mockResponsibility({
                current_estimate_set: set
            })
        });
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);

        const element = rendered.find(CurrentEstimateSetSummary);
        expect(element).to.have.length(1);
        expect(element.props()).to.eql({
            estimateSet: set,
            canUpload: true
        });
    });

});

function makeProps(props: any): UploadBurdenEstimatesContentComponentProps {
    const touchstone = mockTouchstone({id : "touchstone-1"});
    const scenario = mockScenario({id: "scenario-1"});
    const group = mockModellingGroup({id: "group-1"});
    const resp = mockResponsibility();
    return {
        ready: true,
        props: Object.assign({
            touchstone,
            scenario,
            responsibilitySetStatus: "incomplete",
            group: group,
            estimatesToken: "TOKEN",
            responsibility: resp
        }, props)
    };
}