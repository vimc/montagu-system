import * as React from "react";
import { shallow} from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../helper";
import {mockModellingGroup, mockTouchstone} from "../../../mocks/mockModels";
import { mockContribState } from "../../../mocks/mockStates";
import { ModellingGroup} from "../../../../main/shared/models/Generated";
import { Sandbox } from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {ContribAppState} from "../../../../main/contrib/reducers/contribAppReducers";
import {
    ChooseActionContentComponent, ChooseActionContent,
    ChooseActionContentProps, mapStateToProps
} from "../../../../main/contrib/components/ChooseAction/ChooseActionContent";
import {TouchstoneList} from "../../../../main/contrib/components/ChooseAction/TouchstoneList";


describe("Choose Action Content Component", () => {

    const testCurrentGroup = mockModellingGroup();
    const testTouchstones = [mockTouchstone(), mockTouchstone()];
    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockStore({
            groups: {currentUserGroup: testCurrentGroup},
            touchstones: {touchstones: testTouchstones}
        });
    });
    afterEach(() => sandbox.restore());

    it("renders Action Content on connect level", () => {
        const rendered = shallow(<ChooseActionContent/>, {context: {store}});
        expect(rendered.props().group).to.eql(testCurrentGroup);
        expect(rendered.props().touchstones).to.eql(testTouchstones);
    });

    it("renders Action Content on branch level", () => {
        const rendered = shallow(<ChooseActionContent/>, {context: {store}}).dive();
        const props = rendered.props() as ChooseActionContentProps;
        expect(props.group).to.eql(testCurrentGroup);
        expect(props.touchstones).to.eql(testTouchstones);
        expect(rendered.find(ChooseActionContentComponent).length).to.eql(1);
    });

    it("renders Group Content on component level", () => {
        const rendered = shallow(<ChooseActionContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(TouchstoneList).length).to.eql(1);
        expect(rendered.find(TouchstoneList).props().group).to.eql(testCurrentGroup);
        expect(rendered.find(TouchstoneList).props().touchstones).to.eql(testTouchstones);
    });

    it("maps state to props with current group and touchstone", () => {
        const contribStateMock = mockContribState({
            groups: { currentUserGroup: testCurrentGroup },
            touchstones: {touchstones: testTouchstones}
        });
        const props = mapStateToProps(contribStateMock);
        expect(props.group).to.eql(testCurrentGroup);
        expect(props.touchstones).to.eql(testTouchstones);
    });

    it("maps state to props with no group", () => {
        const emptyGroup: ModellingGroup = null;
        const contribStateMock = mockContribState({
            group: { userGroups: emptyGroup },
            touchstones: {touchstones: testTouchstones}
        });
        const props = mapStateToProps(contribStateMock);
        expect(props.group).to.eql(emptyGroup);
        expect(props.touchstones).to.eql(testTouchstones);
    });
});