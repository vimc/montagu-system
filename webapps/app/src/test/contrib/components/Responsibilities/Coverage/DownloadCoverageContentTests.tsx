import * as React from "react";
import {shallow} from "enzyme";

import {Store} from "redux";

import "../../../../helper";
import {
    mockCoverageSet,
    mockDisease,
    mockModellingGroup,
    mockResponsibility,
    mockScenario,
    mockTouchstoneVersion
} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import {createMockContribStore} from "../../../../mocks/mockStore";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";
import {
    DownloadCoverageContent,
    DownloadCoverageContentComponent, DownloadCoverageContentProps,
} from "../../../../../main/contrib/components/Responsibilities/Coverage/DownloadCoverageContent";
import {CoverageSetList} from "../../../../../main/contrib/components/Responsibilities/Coverage/CoverageSetList";
import {FormatControl} from "../../../../../main/shared/components/FormatControl";
import {coverageActionCreators} from "../../../../../main/contrib/actions/coverageActionCreators";
import {ConfidentialityAgreementComponent} from "../../../../../main/contrib/components/Responsibilities/Overview/ConfidentialityAgreement";
import {userActionCreators} from "../../../../../main/contrib/actions/userActionCreators";
import {FileDownloadButton} from "../../../../../main/shared/components/FileDownloadLink";
import {UncontrolledTooltip} from "reactstrap";

describe("Download Coverage Content Component", () => {

    const testGroup = mockModellingGroup({id: "group-186"});
    const testDisease = mockDisease();
    const testTouchstone = mockTouchstoneVersion({id: "touchstone-188"});
    const rfpTouchstone = mockTouchstoneVersion({id: "rfp-1"});
    const testScenario = mockScenario({id: "scenario-190", disease: testDisease.id, touchstones: [testTouchstone.id]});
    const testResponsibility = mockResponsibility({scenario: testScenario});
    const testCoverageSet = mockCoverageSet({touchstone_version: testTouchstone.id});

    const testState = {
        groups: {currentUserGroup: testGroup},
        touchstones: {currentTouchstoneVersion: testTouchstone},
        coverage: {dataSets: [testCoverageSet], selectedFormat: "long", token: "test-token"},
        responsibilities: {currentResponsibility: testResponsibility},
        user: {signedConfidentialityAgreement: false}
    };

    let store: Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockContribStore(testState);
        sandbox.setStubReduxAction(userActionCreators, 'getConfidentialityAgreement');

    });
    afterEach(() => sandbox.restore());

    it("renders on connect level", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}});
        expect(rendered.props().touchstone).toEqual(testTouchstone);
        expect(rendered.props().coverageSets).toEqual([testCoverageSet]);
        expect(rendered.props().selectedFormat).toEqual("long");
        expect(rendered.props().scenario).toEqual(testScenario);
        expect(typeof rendered.props().setFormat).toEqual("function");
    });

    it("renders loading element if current touchstone is null", () => {
        store = createMockContribStore({
            groups: {currentUserGroup: mockModellingGroup()},
            touchstones: {currentTouchstoneVersion: null},
            coverage: {dataSets: [testCoverageSet], selectedFormat: "long"},
            responsibilities: {currentResponsibility: testResponsibility},
        });
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).toEqual(1);
    });

    it(
        "does not render loading element if touchstone and scenario are present",
        () => {
            const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive();
            expect(rendered.find(LoadingElement).length).toEqual(0);
        }
    );

    it(
        "renders component on confidentiality level if not rfp touchstone",
        () => {
            const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive().dive()
                .dive().dive();
            expect(rendered.find(CoverageSetList).length).toEqual(1);
        }
    );

    it(
        "renders confidentiality agreement confidentiality level if rfp touchstone",
        () => {
            const anotherState = {...testState, touchstones: {currentTouchstoneVersion: rfpTouchstone}};
            store = createMockContribStore(anotherState);
            const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive().dive()
                .dive().dive();
            expect(rendered.find(ConfidentialityAgreementComponent).length).toEqual(1);
        }
    );

    it("renders on component level touchstone and scenario table", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}})
            .dive().dive().dive().dive().dive().dive();
        const firstTable = rendered.find('table.specialColumn').at(0);
        expect(firstTable.find('tr').at(0).find('div.col').at(1).text()).toBe(testTouchstone.description);
        expect(firstTable.find('tr').at(1).find('div.col').at(1).text()).toBe(testScenario.description);
    });

    it("renders on component level coverage set list and format control", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive()
            .dive().dive().dive();
        expect(rendered.find(CoverageSetList).length).toEqual(1);
        expect(rendered.find(CoverageSetList).props().coverageSets).toEqual([testCoverageSet]);
        expect(rendered.find(FormatControl).length).toEqual(1);
        expect(rendered.find(FormatControl).props().value).toEqual(testState.coverage.selectedFormat);
    });

    it("renders tooltips", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive()
            .dive().dive().dive();
        const tooltips = rendered.find(UncontrolledTooltip);
        expect(tooltips.length).toEqual(2);
        expect(tooltips.first().props().target).toEqual("format-tooltip");
        expect(tooltips.at(1).props().target).toEqual("countries-tooltip");
    });

    it("renders usage warning", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive()
            .dive().dive().dive();
        const p = rendered.find("p.text-danger");
        expect(p.text()).toContain("Reminder: All data on Montagu is confidential and must not be shared outside VIMC");
        expect(p.find("a").props().href).toEqual("mailto:montagu-help@imperial.ac.uk");
    });

    it("calling onSelectFormat triggers set format", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive()
            .dive().dive().dive();
        const downloadCoverageContentComponentInstance = rendered.instance() as DownloadCoverageContentComponent;
        const onFormatSelectStub = sandbox.setStubReduxAction(coverageActionCreators, "setFormat");
        downloadCoverageContentComponentInstance.onSelectFormat("long");
        expect(onFormatSelectStub.mock.calls.length).toBe(1);
    });

    it("does not show format control for prohibited diseases", () => {

        const rendered = shallow(<DownloadCoverageContentComponent
            coverageSets={[testCoverageSet]}
            group={testGroup}
            scenario={{...testScenario, disease: "measles"}}
            selectedFormat={"long"}
            setFormat={() => {
            }}
            touchstone={testTouchstone}/>);

        expect(rendered.find(FormatControl).length).toEqual(0);
    });

    it("filterToExpectations is selected by default", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive()
            .dive().dive().dive();
        expect(rendered.find("#filter-countries").props().checked).toBe(true);
    });

    it("url has all-countries query parameter set to false by default", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive()
            .dive().dive().dive();

        const expected = "/modelling-groups/group-186/responsibilities/touchstone-188/scenario-190/coverage/csv/?format=long&all-countries=false";
        expect(rendered.find(FileDownloadButton).props().href).toEqual(expected)
    });

    it(
        "url has all-countries query parameter set to true when filterToExpectations is de-selected",
        () => {
            const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive()
                .dive().dive().dive();

            rendered.find("#filter-countries").simulate("change");
            const expected = "/modelling-groups/group-186/responsibilities/touchstone-188/scenario-190/coverage/csv/?format=long&all-countries=true";
            expect(rendered.find(FileDownloadButton).props().href).toEqual(expected)
        }
    );

});
