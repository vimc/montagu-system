import * as React from "react";
import {shallow} from "enzyme";

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

    it("renders on connect level", () => {
        const rendered = shallow(<DownloadDemographicsContent/>, {context: {store}});
        expect(rendered.props().touchstone).toEqual(testTouchstone);
        expect(rendered.props().dataSets).toEqual([testDemographicSet]);
        expect(rendered.props().selectedDataSet).toEqual(testDemographicSet);
        expect(rendered.props().selectedGender).toEqual("both");
        expect(rendered.props().selectedFormat).toEqual("long");
    });

    it("renders on branch level, passes", () => {
        const rendered = shallow(<DownloadDemographicsContent/>, {context: {store}}).dive();
        expect(rendered.find(DownloadDemographicsContentComponent).length).toEqual(1);
    });

    it("renders on branch level, not passes", () => {
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
        expect(rendered.find(LoadingElement).length).toEqual(1);
    });

    it(
        "renders on component level touchstone description and demographic options",
        () => {
            const rendered = shallow(<DownloadDemographicsContent/>, {context: {store}}).dive().dive();
            expect(rendered.find("div.sectionTitle").text()).toEqual(`Demographic data for ${testTouchstone.description}`);
            expect(rendered.find(DemographicOptions).length).toEqual(1);
        }
    );

});