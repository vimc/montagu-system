import * as React from "react";
import { shallow} from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../helper";
import {
    mockDemographicDataset,
    mockTouchstone
} from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";

import {
    DownloadDemographicsContent,
    DownloadDemographicsContentComponent
} from "../../../../../main/contrib/components/Responsibilities/Demographics/DownloadDemographicsContent";
import {DemographicOptions} from "../../../../../main/contrib/components/Responsibilities/Demographics/DemographicOptions";
import {TimeBlockerProps} from "../../../../../main/shared/components/OneTimeButton/OneTimeButtonTimeBlocker";

describe("Download Demographic Content Component", () => {

    const testTouchstone = mockTouchstone();
    const testDemographicSet = mockDemographicDataset();

    const testState = {
        touchstones: {currentTouchstone: testTouchstone},
        demographic: {
            dataSets: [testDemographicSet],
            selectedDataSet: testDemographicSet,
            selectedGender: "both",
            selectedFormat: "long",
            token: "test-token"
        }
    };

    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockStore(testState);
    });
    afterEach(() => sandbox.restore());

    it("renders on connect level", () => {
        const rendered = shallow(<DownloadDemographicsContent/>, {context: {store}});
        expect(rendered.props().touchstone).to.eql(testTouchstone);
        expect(rendered.props().dataSets).to.eql([testDemographicSet]);
        expect(rendered.props().selectedDataSet).to.eql(testDemographicSet);
        expect(rendered.props().selectedGender).to.eql("both");
        expect(rendered.props().selectedFormat).to.eql("long");
        expect(rendered.props().token).to.eql("test-token");
    });

    it("renders on branch level, passes", () => {
        const rendered = shallow(<DownloadDemographicsContent/>, {context: {store}}).dive();
        expect(rendered.find(DownloadDemographicsContentComponent).length).to.eql(1);
    });

    it("renders on branch level, not passes", () => {
        store = createMockStore({
            touchstones: {currentTouchstone: null},
            demographic: {
                dataSets: [testDemographicSet],
                selectedDataSet: testDemographicSet,
                selectedGender: "both",
                selectedFormat: "long",
                token: "test-token"
            }
        });
        const rendered = shallow(<DownloadDemographicsContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    it("renders on component level touchstone description and demographic options", () => {
        const rendered = shallow(<DownloadDemographicsContent/>, {context: {store}}).dive().dive();
        expect(rendered.find("div.sectionTitle").text()).to.equal(`Demographic data for ${testTouchstone.description}`);
        expect(rendered.find(DemographicOptions).length).to.equal(1);

    });

    it("renders on component level time blocked button", () => {
        const rendered = shallow(<DownloadDemographicsContent/>, {context: {store}}).dive().dive();
        expect(rendered.find('ButtonTimeBlockerWrapper').length).to.equal(1);
        const buttonTimeBlockedProps = rendered.find('ButtonTimeBlockerWrapper').props() as TimeBlockerProps;
        expect(buttonTimeBlockedProps.token).to.equal("test-token");
        expect(typeof buttonTimeBlockedProps.refreshToken).to.equal('function');
        expect(buttonTimeBlockedProps.disableDuration).to.equal(5000);
        expect(buttonTimeBlockedProps.enabled).to.equal(true);
        expect(buttonTimeBlockedProps.children).to.equal("Download data set");
    });

});