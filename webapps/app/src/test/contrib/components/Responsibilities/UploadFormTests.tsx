import * as React from "react";
import { expect } from "chai";
import { UploadForm } from "../../../../main/contrib/components/Responsibilities/Overview/UploadForm";
import { shallow, ShallowWrapper } from "enzyme";
import { mockModellingGroup, mockResponsibility, mockScenario, mockTouchstone } from "../../../mocks/mockModels";
import { setupMainStore } from "../../../mocks/mocks";
import { BurdenEstimateSet, ResponsibilitySetStatus } from "../../../../main/shared/models/Generated";
import { Sandbox } from "../../../Sandbox";

const styles = require("../../../../main/contrib/components/Responsibilities/Responsibilities.css");

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
            responsibility={responsibility}/>);
    }

    afterEach(() => sandbox.restore());

    it("disables the upload button if canUpload is false", () => {
        setUpComponent(false);
        expect(rendered.find(`button`).first().text()).to.eq("No more burden estimates can be uploaded");
        expect(rendered.find(`button`).first().prop("disabled")).to.eq(true);
    });

    it("allows uploads if canUpload is true", () => {
        setUpComponent(true);
        expect(rendered.find(`button`).first().text()).to.eq("Upload a new burden estimate set");
        expect(rendered.find(`button`).first().prop("disabled")).to.eq(false);
    });

});