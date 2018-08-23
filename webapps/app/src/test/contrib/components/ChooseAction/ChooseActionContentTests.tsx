import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {Store} from "redux";

import "../../../helper";
import {mockModellingGroup, mockTouchstone} from "../../../mocks/mockModels";
import {mockContribState} from "../../../mocks/mockStates";
import {ModellingGroup} from "../../../../main/shared/models/Generated";
import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {ContribAppState} from "../../../../main/contrib/reducers/contribAppReducers";
import {
    ChooseActionContent,
    ChooseActionContentComponent,
    ChooseActionContentProps,
    mapStateToProps
} from "../../../../main/contrib/components/ChooseAction/ChooseActionContent";
import {TouchstoneList} from "../../../../main/contrib/components/ChooseAction/TouchstoneList";
import {LoadingElement} from "../../../../main/shared/partials/LoadingElement/LoadingElement";
import {concatArrays} from "../../../../main/shared/ArrayHelpers";


describe("Choose Action Content Component", () => {

    const testCurrentGroup = mockModellingGroup();
    const testTouchstones = [mockTouchstone(), mockTouchstone()];
    const testVersions = concatArrays(testTouchstones[0].versions, testTouchstones[1].versions);
    let store: Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockContribStore({
            groups: {currentUserGroup: testCurrentGroup},
            touchstones: {touchstones: testTouchstones}
        });
    });
    afterEach(() => sandbox.restore());

    it("renders on connect level", () => {
        const rendered = shallow(<ChooseActionContent/>, {context: {store}});
        const props = rendered.props() as ChooseActionContentProps;
        expect(props.group).to.eql(testCurrentGroup);
        expect(props.touchstoneVersions).to.eql(testVersions);
    });

    it("renders on branch level, passes", () => {
        const rendered = shallow(<ChooseActionContent/>, {context: {store}}).dive();
        const props = rendered.props() as ChooseActionContentProps;
        expect(props.group).to.eql(testCurrentGroup);
        expect(props.touchstoneVersions).to.eql(testVersions);
        expect(rendered.find(ChooseActionContentComponent).length).to.eql(1);
    });

    it("renders on branch level, not passes", () => {
        store = createMockContribStore({
            groups: {currentUserGroup: null},
            touchstones: {touchstones: []}
        });
        const rendered = shallow(<ChooseActionContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    it("renders on component level", () => {
        const rendered = shallow(<ChooseActionContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(TouchstoneList).length).to.eql(1);
        expect(rendered.find(TouchstoneList).props().group).to.eql(testCurrentGroup);
        expect(rendered.find(TouchstoneList).props().touchstones).to.eql(testVersions);
    });

    it("maps state to props with current group and touchstone", () => {
        const contribStateMock = mockContribState({
            groups: {currentUserGroup: testCurrentGroup},
            touchstones: {touchstones: testTouchstones}
        });
        const props = mapStateToProps(contribStateMock);
        expect(props.group).to.eql(testCurrentGroup);
        expect(props.touchstoneVersions).to.eql(testVersions);
    });

    it("maps state to props with no group", () => {
        const emptyGroup: ModellingGroup = null;
        const contribStateMock = mockContribState({
            groups: {currentUserGroup: emptyGroup},
            touchstones: {touchstones: testTouchstones}
        });
        const props = mapStateToProps(contribStateMock);
        expect(props.group).to.eql(emptyGroup);
        expect(props.touchstoneVersions).to.eql(testVersions);
    });
});