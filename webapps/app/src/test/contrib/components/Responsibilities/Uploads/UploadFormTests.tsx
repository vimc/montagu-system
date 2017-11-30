import * as React from "react";
import { expect } from "chai";
import { UploadForm } from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadForm";
import { shallow, ShallowWrapper } from "enzyme";
import {mockBurdenEstimateSet, mockResponsibility, mockScenario} from "../../../../mocks/mockModels";
import { setupMainStore } from "../../../../mocks/mocks";
import { BurdenEstimateSet } from "../../../../../main/shared/models/Generated";
import { Sandbox } from "../../../../Sandbox";
import {mockFetcher} from "../../../../mocks/mockRemote";
import {CurrentEstimateSetSummary} from "../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";

const buttonStyles = require("../../../../../main/shared/styles/buttons.css");
const messageStyles = require("../../../../../main/shared/styles/messages.css");

describe('UploadForm', () => {
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

        rendered = shallow(<UploadForm
            token={token}
            canUpload={canUpload}
            groupId={"group-1"}
            scenarioId={responsibility.scenario.id}
            currentEstimateSet={responsibility.current_estimate_set}/>);
    }

    afterEach(() => sandbox.restore());

    it("disables the choose file button if canUpload is false", () => {
        setUpComponent(false);
        const chooseFileButton = rendered.find(`.${buttonStyles.button}`).first();
        expect(chooseFileButton.text()).to.eq("No more burden estimates can be uploaded");
        expect(chooseFileButton.hasClass(buttonStyles.disabled)).to.eq(true);
    });

    it("disables the choose file button if token is null", () => {
        setUpComponent(true, null, null);
        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(true);
    });

    it("enables choose file button if canUpload is true", () => {
        setUpComponent(true);

        const chooseFileButton = rendered.find(`.${buttonStyles.button}`).first();
        expect(chooseFileButton.text()).to.eq("Choose a new burden estimate set");
        expect(chooseFileButton.hasClass(buttonStyles.disabled)).to.eq(false);
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