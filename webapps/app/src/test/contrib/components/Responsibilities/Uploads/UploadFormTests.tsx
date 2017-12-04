import * as React from "react";
import {expect} from "chai";
import {UploadForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadForm";
import {shallow, ShallowWrapper} from "enzyme";
import {mockBurdenEstimateSet, mockResponsibility} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import {mockFetcher} from "../../../../mocks/mockRemote";
import {CurrentEstimateSetSummary} from "../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";

const buttonStyles = require("../../../../../main/shared/styles/buttons.css");

describe('UploadForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();
    before(() => mockFetcher(Promise.resolve(null)));

    afterEach(() => sandbox.restore());

    it("disables the choose file button if canUpload is false", () => {

        rendered = shallow(<UploadForm
            token={"token"}
            canUpload={false}
            currentEstimateSet={null}/>);

        const chooseFileButton = rendered.find(`.${buttonStyles.button}`).first();
        expect(chooseFileButton.text()).to.eq("No more burden estimates can be uploaded");
        expect(chooseFileButton.hasClass(buttonStyles.disabled)).to.eq(true);
    });

    it("disables the choose file button if token is null", () => {

        rendered = shallow(<UploadForm
            token={null}
            canUpload={true}
            currentEstimateSet={null}/>);

        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(true);
    });

    it("enables choose file button if canUpload is true", () => {

        rendered = shallow(<UploadForm
            token={"token"}
            canUpload={true}
            currentEstimateSet={null}/>);

        const chooseFileButton = rendered.find(`.${buttonStyles.button}`).first();
        expect(chooseFileButton.text()).to.eq("Choose a new burden estimate set");
        expect(chooseFileButton.hasClass(buttonStyles.disabled)).to.eq(false);
    });

    it("renders current burden estimate status", () => {

        const set = mockBurdenEstimateSet();
        const responsibility = mockResponsibility(
            {
                current_estimate_set: set
            });

        rendered = shallow(<UploadForm
            token={"token"}
            canUpload={true}
            currentEstimateSet={responsibility.current_estimate_set}/>);

        const element = rendered.find(CurrentEstimateSetSummary);
        expect(element).to.have.length(1);
        expect(element.props()).to.eql({
            estimateSet: set,
            canUpload: true
        });
    });
});