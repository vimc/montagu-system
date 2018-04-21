import * as React from "react";
import { shallow} from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../helper";
import {
    mockCoverageSet,
    mockDisease, mockModellingGroup,
    mockResponsibility,
    mockScenario, mockTouchstone
} from "../../../../mocks/mockModels";
import { mockContribState } from "../../../../mocks/mockStates";
import { Sandbox } from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";
import {
    DownloadCoverageContent, DownloadCoverageContentComponent,
    DownloadCoverageContentProps
} from "../../../../../main/contrib/components/Responsibilities/Coverage/DownloadCoverageContent";
import {CoverageSetList} from "../../../../../main/contrib/components/Responsibilities/Coverage/CoverageSetList";
import {FormatControl} from "../../../../../main/contrib/components/Responsibilities/FormatControl";
import {TimeBlockerProps} from "../../../../../main/shared/components/OneTimeButton/OneTimeButtonTimeBlocker";
import {coverageActionCreators} from "../../../../../main/contrib/actions/coverageActionCreators";

describe("Download Coverage Content Component", () => {

    const testGroup = mockModellingGroup();
    const testDisease = mockDisease();
    const testTouchstone = mockTouchstone();
    const testScenario = mockScenario({disease: testDisease.id, touchstones: [testTouchstone]});
    const testResponsibility = mockResponsibility({scenario: testScenario});
    const testCoverageSet = mockCoverageSet({touchstone: testTouchstone.id});

    const testState = {
        groups: {currentUserGroup: testGroup},
        touchstones: {currentTouchstone: testTouchstone},
        coverage: {dataSets: [testCoverageSet], selectedFormat: "long", token: "test-token"},
        responsibilities: {currentResponsibility: testResponsibility},
    };

    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockStore(testState);
    });
    afterEach(() => sandbox.restore());

    it("renders on connect level", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}});
        expect(rendered.props().touchstone).to.eql(testTouchstone);
        expect(rendered.props().coverageSets).to.eql([testCoverageSet]);
        expect(rendered.props().selectedFormat).to.eql("long");
        expect(rendered.props().scenario).to.eql(testScenario);
        expect(rendered.props().token).to.eql("test-token");
    });

    it("renders on branch level, passes", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive();
        const props = rendered.props() as DownloadCoverageContentProps;
        expect(rendered.find(DownloadCoverageContentComponent).length).to.eql(1);
    });


    it("renders on branch level, not passes", () => {
        store = createMockStore({
            touchstones: {currentTouchstone: null},
            coverage: {dataSets: [testCoverageSet], selectedFormat: "long", token: "test-token"},
            responsibilities: {currentResponsibility: testResponsibility},
        });
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    it("renders on component level touuchstone and scenario table", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive();
        const firstTable = rendered.find('table.specialColumn').at(0);
        expect(firstTable.find('tr').at(0).find('div.col').at(1).text(), testTouchstone.description);
        expect(firstTable.find('tr').at(1).find('div.col').at(1).text(), testScenario.description);
    });

    it("renders on component level coverage set list and format control", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(CoverageSetList).length).to.equal(1);
        expect(rendered.find(CoverageSetList).props().coverageSets).to.eql([testCoverageSet]);
        expect(rendered.find(FormatControl).length).to.equal(1);
        expect(rendered.find(FormatControl).props().value).to.eql(testState.coverage.selectedFormat);
    });

    it("renders on component level time blocked button", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive();
        expect(rendered.find('ButtonTimeBlockerWrapper').length).to.equal(1);
        const buttonTimeBlockedProps = rendered.find('ButtonTimeBlockerWrapper').props() as TimeBlockerProps;
        expect(buttonTimeBlockedProps.token).to.equal("test-token");
        expect(typeof buttonTimeBlockedProps.refreshToken).to.equal('function');
        expect(buttonTimeBlockedProps.disableDuration).to.equal(1000);
        expect(buttonTimeBlockedProps.enabled).to.equal(true);
        expect(buttonTimeBlockedProps.children).to.equal("Download combined coverage set data in CSV format");
    });

    it("can trigger mapped load token", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive();
        const downloadCoverageContentComponentInstance = rendered.instance() as DownloadCoverageContentComponent;
        const onLoadTokenStub = sandbox.setStubReduxAction(coverageActionCreators, "getOneTimeToken");
        downloadCoverageContentComponentInstance.props.loadToken();
        expect(onLoadTokenStub.called).to.equal(true);
    });

    it("can trigger mapped chose format", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive();
        const downloadCoverageContentComponentInstance = rendered.instance() as DownloadCoverageContentComponent;
        const onFormatSelectStub = sandbox.setStubReduxAction(coverageActionCreators, "setFormat");
        downloadCoverageContentComponentInstance.props.setFormat("long");
        expect(onFormatSelectStub.called).to.equal(true);
    });

    it("calling onSelectFormat triggers both get token and set format actions", () => {
        const rendered = shallow(<DownloadCoverageContent/>, {context: {store}}).dive().dive();
        const downloadCoverageContentComponentInstance = rendered.instance() as DownloadCoverageContentComponent;
        const onLoadTokenStub = sandbox.setStubReduxAction(coverageActionCreators, "getOneTimeToken");
        const onFormatSelectStub = sandbox.setStubReduxAction(coverageActionCreators, "setFormat");
        downloadCoverageContentComponentInstance.onSelectFormat("long");
        expect(onLoadTokenStub.called).to.equal(true);
        expect(onFormatSelectStub.called).to.equal(true);
    });

});