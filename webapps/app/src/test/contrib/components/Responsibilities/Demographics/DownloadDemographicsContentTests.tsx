import * as React from "react";
import { expect } from "chai";
import { DemographicState } from "../../../../../main/contrib/stores/DemographicStore";
import { mockDemographicStatisticType, mockTouchstone } from "../../../../mocks/mockModels";
import { Touchstone } from "../../../../../main/shared/models/Generated";
import { alt } from "../../../../../main/shared/alt";
import {
    DownloadDemographicsContent,
    DownloadDemographicsContentComponent, DownloadDemographicsContentProps
} from "../../../../../main/contrib/components/Responsibilities/Demographics/DownloadDemographicsContent";
import { shallow } from "enzyme";
import { DemographicOptions } from "../../../../../main/contrib/components/Responsibilities/Demographics/DemographicOptions";

describe("DownloadDemographicsContent", () => {
    afterEach(() => alt.recycle());

    function setupStore(touchstone: Touchstone, state: DemographicState) {
        alt.bootstrap(JSON.stringify({
            DemographicStore: state,
            ResponsibilityStore: {
                currentTouchstone: touchstone
            }
        }));
    }

    it("can get props from stores when touchstone and data set are present", () => {
        const dataSet = mockDemographicStatisticType();
        const touchstone = mockTouchstone({ id: "tId" });
        setupStore(touchstone, {
            currentTouchstone: touchstone.id,
            selectedGender: "gender",
            dataSets: { tId: [dataSet] },
            selectedDataSet: dataSet,
            token: null
        });
        const props = DownloadDemographicsContentComponent.getPropsFromStores(null);
        expect(props).to.eql({
            ready: true,
            selectedDataSet: dataSet,
            selectedGender: "gender",
            dataSets: [dataSet],
            touchstone: touchstone,
            token: null
        });
    });

    it("can get props from stores when data set is not fetched yet", () => {
        const touchstone = mockTouchstone({ id: "tId" });
        setupStore(touchstone, {
            currentTouchstone: touchstone.id,
            selectedGender: "gender",
            dataSets: { someOtherTouchstone: [ mockDemographicStatisticType() ]},
            selectedDataSet: null,
            token: "token"
        });
        const props = DownloadDemographicsContentComponent.getPropsFromStores(null);
        expect(props).to.eql({
            ready: false,
            selectedDataSet: null,
            selectedGender: "gender",
            dataSets: undefined,
            touchstone: touchstone,
            token: "token"
        });
    });

    it("no props are retrieved from stores when current touchstone is not set", () => {
        setupStore(mockTouchstone(), {
            currentTouchstone: null,
            selectedGender: "gender",
            dataSets: { someOtherTouchstone: [ mockDemographicStatisticType() ]},
            selectedDataSet: null,
            token: "token"
        });
        const props = DownloadDemographicsContentComponent.getPropsFromStores(null);
        expect(props).to.eql({
            ready: false,
            selectedDataSet: null,
            selectedGender: null,
            dataSets: null,
            touchstone: null,
            token: null
        });
    });

    it("renders options", () => {
        const set = mockDemographicStatisticType();
        const rendered = shallow(<DownloadDemographicsContentComponent
            dataSets={[set]}
            touchstone={mockTouchstone()}
            selectedDataSet={set}
            selectedGender="x"
            ready={true}
            token={null}
        />);
        expect(rendered.find(DemographicOptions).props()).to.eql({
            dataSets: [set],
            selectedDataSet: set,
            selectedGender: "x"
        })
    });

    it("can download when all required options are filled", () => {
        const setA = mockDemographicStatisticType({ id: "a", gender_is_applicable: false });
        const setB = mockDemographicStatisticType({ id: "a", gender_is_applicable: true });
        const base: DownloadDemographicsContentProps = {
            dataSets: [setA, setB],
            selectedDataSet: null,
            touchstone: mockTouchstone(),
            ready: true,
            selectedGender: null,
            token: null
        };
        const f = DownloadDemographicsContentComponent.canDownload;

        expect(f(base))
            .to.be.equal(false, "Shouldn't be able to download with no data set selected");
        expect(f(Object.assign({}, base, { selectedDataSet: setA })))
            .to.equal(true, "Should be able to download with set that doesn't required gender selected");
        expect(f(Object.assign({}, base, { selectedDataSet: setB })))
            .to.equal(false, "Shouldn't be able to download with set that requires gender, without selecting gender");
        expect(f(Object.assign({}, base, { selectedDataSet: setB, selectedGender: "x" })))
            .to.be.equal(true, "Should be able to download with set that requires gender, after selecting gender");
    });
});