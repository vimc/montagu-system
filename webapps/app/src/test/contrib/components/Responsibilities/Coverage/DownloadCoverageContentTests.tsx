import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
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
import {createMockContribStore, createMockStore} from "../../../../mocks/mockStore";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";
import {
    DownloadCoverageContent,
    DownloadCoverageContentComponent,
} from "../../../../../main/contrib/components/Responsibilities/Coverage/DownloadCoverageContent";
import {CoverageSetList} from "../../../../../main/contrib/components/Responsibilities/Coverage/CoverageSetList";
import {FormatControl} from "../../../../../main/contrib/components/Responsibilities/FormatControl";
import {coverageActionCreators} from "../../../../../main/contrib/actions/coverageActionCreators";
import {ConfidentialityAgreementComponent} from "../../../../../main/contrib/components/Responsibilities/Overview/ConfidentialityAgreement";
import {userActionCreators} from "../../../../../main/contrib/actions/userActionCreators";

describe("Download Coverage Content Component", () => {

    const testGroup = mockModellingGroup();
    const testDisease = mockDisease();
    const testTouchstone = mockTouchstoneVersion();
    const rfpTouchstone = mockTouchstoneVersion({id: "rfp-1"});
    const testScenario = mockScenario({disease: testDisease.id, touchstones: [testTouchstone]});
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
        expect(rendered.props().touchstone).to.eql(testTouchstone);
        expect(rendered.props().coverageSets).to.eql([testCoverageSet]);
        expect(rendered.props().selectedFormat).to.eql("long");
        expect(rendered.props().scenario).to.eql(testScenario);
        expect(typeof rendered.props().setFormat).to.eql("function");
    });

    it("renders on branch level, passes", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive();
        // rendered.props() as DownloadCoverageContentProps;
        // console.log(rendered.debug())
        expect(rendered.find('Connect').length).to.eql(1);
    });


    it("renders on branch level, not passes", () => {
        store = createMockContribStore({
            groups: {currentUserGroup: mockModellingGroup()},
            touchstones: {currentTouchstoneVersion: null},
            coverage: {dataSets: [testCoverageSet], selectedFormat: "long"},
            responsibilities: {currentResponsibility: testResponsibility},
        });
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    it("renders component on confidentiality level if not rfp touchstone", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive().dive()
            .dive().dive();
        expect(rendered.find(CoverageSetList).length).to.eql(1);
    });

    it("renders confidentiality agreement confidentiality level if rfp touchstone", () => {
        const anotherState = {...testState, touchstones: {currentTouchstoneVersion: rfpTouchstone}};
        store = createMockContribStore(anotherState);
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive().dive()
            .dive().dive();
        expect(rendered.find(ConfidentialityAgreementComponent).length).to.eql(1);
    });

    it("renders on component level touchstone and scenario table", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}})
            .dive().dive().dive().dive().dive().dive();
        const firstTable = rendered.find('table.specialColumn').at(0);
        expect(firstTable.find('tr').at(0).find('div.col').at(1).text(), testTouchstone.description);
        expect(firstTable.find('tr').at(1).find('div.col').at(1).text(), testScenario.description);
    });

    it("renders on component level coverage set list and format control", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive()
            .dive().dive().dive();
        expect(rendered.find(CoverageSetList).length).to.equal(1);
        expect(rendered.find(CoverageSetList).props().coverageSets).to.eql([testCoverageSet]);
        expect(rendered.find(FormatControl).length).to.equal(1);
        expect(rendered.find(FormatControl).props().value).to.eql(testState.coverage.selectedFormat);
    });

    it("can trigger mapped chose format", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive().dive().dive();
        const downloadCoverageContentComponentInstance = rendered.instance() as DownloadCoverageContentComponent;
        const onFormatSelectStub = sandbox.setStubReduxAction(coverageActionCreators, "setFormat");
        downloadCoverageContentComponentInstance.props.setFormat("long");
        expect(onFormatSelectStub.called).to.equal(true);
    });

    it("calling onSelectFormat triggers set format", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive().dive()
            .dive().dive().dive();
        const downloadCoverageContentComponentInstance = rendered.instance() as DownloadCoverageContentComponent;
        const onFormatSelectStub = sandbox.setStubReduxAction(coverageActionCreators, "setFormat");
        downloadCoverageContentComponentInstance.onSelectFormat("long");
        expect(onFormatSelectStub.called).to.equal(true);
    });
});