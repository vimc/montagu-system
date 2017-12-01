import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import {mockBurdenEstimateSet, mockResponsibility, mockScenario} from "../../../../mocks/mockModels";
import { setupMainStore } from "../../../../mocks/mocks";
import { BurdenEstimateSet } from "../../../../../main/shared/models/Generated";
import { Sandbox } from "../../../../Sandbox";
import {mockFetcher} from "../../../../mocks/mockRemote";
import {CurrentEstimateSetSummary} from "../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";
import {UploadBurdenEstimatesForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {UploadForm} from "../../../../../main/shared/components/UploadForm";
import {FileDownloadLink} from "../../../../../main/report/components/FileDownloadLink";

const messageStyles = require("../../../../../main/shared/styles/messages.css");

describe('UploadBurdenEstimatesForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();
    before(() => mockFetcher(Promise.resolve(null)));

    function setUpComponent(canUpload: boolean,
                            burdenEstimateSet?: BurdenEstimateSet,
                            token: string = "TOKEN") {
        setupMainStore({
            diseases: [
                { id: "disease-id", name: "Disease name" }
            ]
        });

        const responsibility = mockResponsibility({
            status: "empty",
            current_estimate_set: burdenEstimateSet
        }, mockScenario({
            id: "scenario-1",
            description: "Description",
        }));

        rendered = shallow(<UploadBurdenEstimatesForm
            token={token}
            canUpload={canUpload}
            groupId={"group-1"}
            scenarioId={responsibility.scenario.id}
            currentEstimateSet={responsibility.current_estimate_set}/>);
    }

    afterEach(() => sandbox.restore());

    it("does not show form if canUpload is false", () => {
        setUpComponent(false);
        const form = rendered.find(UploadForm);
        expect(form).to.have.lengthOf(0);
    });

    it("shows form if canUpload is true", () => {
        setUpComponent(true);

        const form = rendered.find(UploadForm);
        expect(form).to.have.lengthOf(1);
    });

    it("renders current burden estimate status", () => {
        const set = mockBurdenEstimateSet();
        setUpComponent(true, set);

        const element = rendered.find(CurrentEstimateSetSummary);
        expect(element).to.have.length(1);
        expect(element.props()).to.eql({
            estimateSet: set,
            canUpload: true
        });
    });
});