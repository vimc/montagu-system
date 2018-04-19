import * as React from "react";
import { shallow} from "enzyme";
import { expect } from "chai";

import "../../../helper";
import { mockModellingGroup } from "../../../mocks/mockModels";
import {
    ChooseGroupContentComponent,
    ChooseGroupContent,
    mapStateToProps, ChooseGroupContentProps
} from "../../../../main/contrib/components/ChooseGroup/ChooseGroupContent";
import { GroupList } from "../../../../main/contrib/components/ChooseGroup/GroupList";
import { mockContribState } from "../../../mocks/mockStates";
import { ModellingGroup} from "../../../../main/shared/models/Generated";
import { Sandbox } from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";


describe("Choose Group Content Component", () => {

    const testGroups = [mockModellingGroup(), mockModellingGroup()];

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders Group Content on connect level", () => {
        let store = createMockStore({groups: {userGroups: testGroups}});
        const rendered = shallow(<ChooseGroupContent/>, {context: {store}});
        expect(rendered.props().groups).to.eql(testGroups);
    });

    it("renders Group Content on branch level", () => {
        let store = createMockStore({groups: {userGroups: testGroups}});
        const rendered = shallow(<ChooseGroupContent/>, {context: {store}}).dive();
        const props = rendered.props() as ChooseGroupContentProps;
        expect(props.groups).to.eql(testGroups);
        expect(rendered.find(ChooseGroupContentComponent).length).to.eql(1);
    });

    it("renders Group Content on component level", () => {
        let store = createMockStore({groups: {userGroups: testGroups}});
        const rendered = shallow(<ChooseGroupContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(GroupList).length).to.eql(1);
        expect(rendered.find(GroupList).props().groups).to.eql(testGroups);
    });

    it("maps state to props with groups", () => {
        const groups :ModellingGroup[] = testGroups;
        const contribStateMock = mockContribState({ groups: { userGroups: groups } })
        const props = mapStateToProps(contribStateMock);
        expect(props.groups).to.eql(testGroups);
    });

    it("maps state to props with no groups", () => {
        const groups: ModellingGroup[] = [];
        const contribStateMock = mockContribState({ groups: { userGroups: groups } })
        const props = mapStateToProps(contribStateMock);
        expect(props.groups).to.eql(groups);
    });
});