import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {Store} from "redux";

import {mockDemographicDataset, mockTouchstoneVersion} from "../../../mocks/mockModels";
import {ContribAppState} from "../../../../main/contrib/reducers/contribAppReducers";
import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {
    DownloadDemographicsContent,
    DownloadDemographicsContentComponent
} from "../../../../main/shared/components/Demographics/DownloadDemographicsContent";
import {LoadingElement} from "../../../../main/shared/partials/LoadingElement/LoadingElement";
import {DemographicOptions} from "../../../../main/shared/components/Demographics/DemographicOptions";

describe("Download Demographic Content Component", () => {

    const testTouchstone = mockTouchstoneVersion();
    const testDemographicSet = mockDemographicDataset();

    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockContribStore({
            touchstones: {currentTouchstoneVersion: testTouchstone},
            demographics: {
                dataSets: [testDemographicSet],
                selectedDataSet: testDemographicSet,
                selectedGender: "both",
                selectedFormat: "long"
            }
        });
    });
    afterEach(() => sandbox.restore());

    test("renders on connect level", () => {
        const rendered = shallow(<DownloadDemographicsContent/>, {context: {store}});
        expect(rendered.props().touchstone).to.eql(testTouchstone);
        expect(rendered.props().dataSets).to.eql([testDemographicSet]);
        expect(rendered.props().selectedDataSet).to.eql(testDemographicSet);
        expect(rendered.props().selectedGender).to.eql("both");
        expect(rendered.props().selectedFormat).to.eql("long");
    });

    test("renders on branch level, passes", () => {
        const rendered = shallow(<DownloadDemographicsContent/>, {context: {store}}).dive();
        expect(rendered.find(DownloadDemographicsContentComponent).length).to.eql(1);
    });

    test("renders on branch level, not passes", () => {
        store = createMockContribStore({
            touchstones: {currentTouchstoneVersion: null},
            demographics: {
                dataSets: [testDemographicSet],
                selectedDataSet: testDemographicSet,
                selectedGender: "both",
                selectedFormat: "long"
            }
        });
        const rendered = shallow(<DownloadDemographicsContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    test(
        "renders on component level touchstone description and demographic options",
        () => {
            const rendered = shallow(<DownloadDemographicsContent/>, {context: {store}}).dive().dive();
            expect(rendered.find("div.sectionTitle").text()).to.equal(`Demographic data for ${testTouchstone.description}`);
            expect(rendered.find(DemographicOptions).length).to.equal(1);
        }
    );

});