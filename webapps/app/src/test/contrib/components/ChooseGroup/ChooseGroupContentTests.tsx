import * as React from "react";
import { shallow} from "enzyme";

import { Store } from "redux";

import "../../../helper";
import { mockModellingGroup } from "../../../mocks/mockModels";
import {
    ChooseGroupContentComponent,
    ChooseGroupContent,
    mapStateToProps, ChooseGroupContentProps
} from "../../../../main/contrib/components/ChooseGroup/ChooseGroupContent";
import { GroupList } from "../../../../main/contrib/components/ChooseGroup/GroupList";
import { mockContribState } from "../../../mocks/mockStates";
import { ModellingGroup} from "../../../../main/shared/models/APITypes";
import { Sandbox } from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {ContribAppState} from "../../../../main/contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../../../main/shared/partials/LoadingElement/LoadingElement";

describe("Choose Group Content Component", () => {

    const testGroups = [mockModellingGroup(), mockModellingGroup()];
    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockStore({groups: {userGroups: testGroups}});
    });
    afterEach(() => sandbox.restore());

    it("renders Group Content on connect level", () => {
        const rendered = shallow(<ChooseGroupContent/>, {context: {store}});
        expect(rendered.props().groups).toEqual(testGroups);
    });

    it("renders Group Content on branch level passes", () => {
        const rendered = shallow(<ChooseGroupContent/>, {context: {store}}).dive();
        const props = rendered.props() as ChooseGroupContentProps;
        expect(props.groups).toEqual(testGroups);
        expect(rendered.find(ChooseGroupContentComponent).length).toEqual(1);
    });

    it("renders Group Content on branch level not passes", () => {
        store = createMockStore({groups: {userGroups: []}});
        const rendered = shallow(<ChooseGroupContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).toEqual(1);
    });

    it("renders Group Content on component level", () => {
        const rendered = shallow(<ChooseGroupContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(GroupList).length).toEqual(1);
        expect(rendered.find(GroupList).props().groups).toEqual(testGroups);
    });

    it("maps state to props with groups", () => {
        const groups :ModellingGroup[] = testGroups;
        const contribStateMock = mockContribState({ groups: { userGroups: groups } });
        const props = mapStateToProps(contribStateMock);
        expect(props.groups).toEqual(testGroups);
    });

    it("maps state to props with no groups", () => {
        const groups: ModellingGroup[] = [];
        const contribStateMock = mockContribState({ groups: { userGroups: groups } });
        const props = mapStateToProps(contribStateMock);
        expect(props.groups).toEqual(groups);
    });
});