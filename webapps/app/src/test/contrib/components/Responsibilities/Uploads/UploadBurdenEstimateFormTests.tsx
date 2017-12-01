import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import {  mockResponsibility, mockScenario } from "../../../../mocks/mockModels";
import { setupMainStore } from "../../../../mocks/mocks";
import { BurdenEstimateSet } from "../../../../../main/shared/models/Generated";
import { Sandbox } from "../../../../Sandbox";
import {UploadBurdenEstimatesForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {UploadForm} from "../../../../../main/shared/components/UploadForm";
import {FileDownloadLink} from "../../../../../main/report/components/FileDownloadLink";

const messageStyles = require("../../../../../main/shared/styles/messages.css");

describe('UploadBurdenEstimatesForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

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