import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import {mockBurdenEstimateSet} from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import {mockFetcher} from "../../../../mocks/mockRemote";
import {CurrentEstimateSetSummary} from "../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";
import {UploadBurdenEstimatesForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {UploadForm} from "../../../../../main/shared/components/UploadForm";

describe('UploadBurdenEstimatesForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();
    before(() => mockFetcher(Promise.resolve(null)));

    afterEach(() => sandbox.restore());

    it("does not show form if canUpload is false", () => {

        rendered = shallow(<UploadBurdenEstimatesForm
            token={"token"}
            canUpload={false}
            currentEstimateSet={null}/>);

        const form = rendered.find(UploadForm);
        expect(form).to.have.lengthOf(0);
    });

    it("shows form if canUpload is true", () => {

        rendered = shallow(<UploadBurdenEstimatesForm
            token={"token"}
            canUpload={true}
            currentEstimateSet={null}/>);

        const form = rendered.find(UploadForm);
        expect(form).to.have.lengthOf(1);
    });

    it("renders current burden estimate status", () => {

        const set = mockBurdenEstimateSet();
        rendered = shallow(<UploadBurdenEstimatesForm
            token={"token"}
            canUpload={true}
            currentEstimateSet={set}/>);

        const element = rendered.find(CurrentEstimateSetSummary);
        expect(element).to.have.length(1);
        expect(element.props()).to.eql({
            estimateSet: set,
            canUpload: true
        });
    });
});