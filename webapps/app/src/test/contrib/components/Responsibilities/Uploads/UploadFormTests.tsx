import * as React from "react";
import { expect } from "chai";
import { UploadForm } from "../../../../main/contrib/components/Responsibilities/Overview/UploadForm";
import { shallow, ShallowWrapper } from "enzyme";
import {  mockResponsibility, mockScenario } from "../../../mocks/mockModels";
import { setupMainStore } from "../../../mocks/mocks";
import { BurdenEstimateSet } from "../../../../main/shared/models/Generated";
import { Sandbox } from "../../../Sandbox";

const buttonStyles = require("../../../../main/shared/styles/buttons.css");
const messageStyles = require("../../../../main/shared/styles/messages.css");

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

    it("shows helper message if canUpload is false", () => {
        setUpComponent(false);

        const helperText = rendered.find(`.${messageStyles.info} p`).text();
        expect(helperText).to.eq("The burden estimates uploaded by your modelling group have been reviewed" +
            " and approved. " +
            "You cannot upload any new estimates. If you need to upload new estimates (e.g. for corrections) please" +
            " contact us here.")
    });


    it("does not show helper message if canUpload is true", () => {
        setUpComponent(true);

        const helperBlock= rendered.find(`.${messageStyles.info} p`);
        expect(helperBlock.length).to.eq(0)
    });

});