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
import {UploadFileForm} from "../../../../../main/shared/components/UploadFileForm";
import {CreateBurdenEstimateSetForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/CreateBurdenEstimateSetForm";
import {CurrentEstimateSetSummary} from "../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";
import {UploadBurdenEstimatesForm} from "../../../../../../../app/src/main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";

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

    it("canCreate is false when responsibility set status is complete", () => {

        const props = makeProps({
            responsibilitySetStatus: "complete"
        });

        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);

        expect(rendered.find(UploadBurdenEstimatesForm).prop("canCreate")).to.equal(false);
    });

    it("canCreate is true when current burden estimate set is null", () => {

        const props = makeProps({});
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);

        expect(rendered.find(UploadBurdenEstimatesForm).prop("canCreate")).to.equal(true);
    });

    it("canUpload is false when current burden estimate set is null", () => {

        const props = makeProps({});
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);

        expect(rendered.find(UploadBurdenEstimatesForm).prop("canUpload")).to.equal(false);
    });

    it("canUpload is false when current burden estimate set status is complete", () => {

        const props = makeProps({
            responsibility: mockResponsibility({
                current_estimate_set: mockBurdenEstimateSet({
                    status: "complete"
                })
            })
        });
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);

        expect(rendered.find(UploadBurdenEstimatesForm).prop("canUpload")).to.equal(false);
    });

    it("canCreate is true when current burden estimate set is null", () => {

        const props = makeProps({});
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);

        expect(rendered.find(UploadBurdenEstimatesForm).prop("canCreate")).to.equal(true);
    });


    it("canUpload is true when current burden estimate set is empty", () => {

        const props = makeProps({
            responsibility: mockResponsibility({
                current_estimate_set: mockBurdenEstimateSet({
                    status: "empty"
                })
            })
        });
        const rendered = shallow(<UploadBurdenEstimatesContentComponent {...props} />);

        expect(rendered.find(UploadBurdenEstimatesForm).prop("canUpload")).to.equal(true);
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
    const touchstone = mockTouchstone({id: "touchstone-1"});
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