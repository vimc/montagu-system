import * as React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";
import { Provider } from "react-redux";

import { ModellingGroupTypeKeys } from "../../../../main/contrib/actionTypes/ModellingGroupsTypes";
import { mockModellingGroup } from "../../../mocks/mockModels";
import {
    ChooseGroupContentComponent,
    ChooseGroupContent,
    mapStateToProps
} from "../../../../main/contrib/components/ChooseGroup/ChooseGroupContent";
import { GroupList } from "../../../../main/contrib/components/ChooseGroup/GroupList";
import { mockContribState } from "../../../mocks/mockStates";
import { ModellingGroup} from "../../../../main/shared/models/Generated";
import { createMockStore } from "../../../mocks/mockStore";
import { Sandbox } from "../../../Sandbox";
import {ModellingGroupsService} from "../../../../main/shared/services/ModellingGroupsService";


describe("ChooseGroupContentComponent", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders GroupList", () => {
        const groups = [mockModellingGroup(), mockModellingGroup()];
        const spy = sandbox.createSpy();
        const rendered = shallow(<ChooseGroupContentComponent groups={groups} ready={true} getUserGroups={spy}/>);
        const list = rendered.find(GroupList);
        expect(list).to.have.length(1);
        expect(list.props()).to.eql({
            groups: groups
        });
    });

    it("gets groups when component mounts", () => {
        const groups = [mockModellingGroup(), mockModellingGroup()];
        const spy = sandbox.createSpy();
        const rendered = shallow(<ChooseGroupContentComponent groups={groups} ready={true} getUserGroups={spy}/>);
        const list = rendered.find(GroupList);
        expect(spy.called).to.be.true;
    });

    it("maps state to props with groups and ready", () => {
        const groups :ModellingGroup[] = [mockModellingGroup()];
        const contribStateMock = mockContribState({ groups: { userGroups: groups } })
        const props = mapStateToProps(contribStateMock);
        expect(props.groups).to.eql(groups);
        expect(props.ready).to.eql(true);
    });

    it("maps state to props with no groups and not ready", () => {
        const groups: ModellingGroup[] = [];
        const contribStateMock = mockContribState({ groups: { userGroups: groups } })
        const props = mapStateToProps(contribStateMock);
        expect(props.groups).to.eql(groups);
        expect(props.ready).to.eql(false);
    });

    it("getGroups dispatches get groups action", (done: DoneCallback) => {
        const mockGroup = mockModellingGroup();
        const contribStateMock = mockContribState({auth: {modellingGroups: [mockGroup.id]}});
        const store = createMockStore(contribStateMock);
        sandbox.setStubFunc(ModellingGroupsService.prototype, "getAllGroups", () => [
            mockGroup
        ]);
        mount(<Provider store={store}><ChooseGroupContent /></Provider>);
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ModellingGroupTypeKeys.USER_GROUPS_FETCHED);
            done();
        });
    });

});