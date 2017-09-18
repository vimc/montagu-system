import * as React from "react";
import { expect } from "chai";
import { UploadForm } from "../../../../main/contrib/components/Responsibilities/Overview/UploadForm";
import { shallow, ShallowWrapper } from "enzyme";
import { mockModellingGroup, mockResponsibility, mockScenario, mockTouchstone } from "../../../mocks/mockModels";
import { setupMainStore } from "../../../mocks/mocks";
import { BurdenEstimateSet, ResponsibilitySetStatus } from "../../../../main/shared/models/Generated";
import { Sandbox } from "../../../Sandbox";

const buttonStyles = require("../../../../main/shared/styles/buttons.css");

describe('ResponsibilityComponent', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    function setUpComponent(canUpload: boolean, burdenEstimateSet?: BurdenEstimateSet) {
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

    it("enables choose file button if canUpload is true", () => {
        setUpComponent(true);

        const chooseFileButton = rendered.find(`.${buttonStyles.button}`).first();
        expect(chooseFileButton.text()).to.eq("Choose a new burden estimate set");
        expect(chooseFileButton.hasClass(buttonStyles.disabled)).to.eq(false);
    });

});