import * as React from "react";
import { shallow} from "enzyme";
import { expect } from "chai";

import "../../../helper";
import { mockModellingGroup } from "../../../mocks/mockModels";
import {
    ChooseGroupContentComponent,
    mapStateToProps
} from "../../../../main/contrib/components/ChooseGroup/ChooseGroupContent";
import { GroupList } from "../../../../main/contrib/components/ChooseGroup/GroupList";
import { mockContribState } from "../../../mocks/mockStates";
import { ModellingGroup} from "../../../../main/shared/models/Generated";
import { Sandbox } from "../../../Sandbox";


describe("ChooseGroupContentComponent", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders GroupList", () => {
        const groups = [mockModellingGroup(), mockModellingGroup()];
        const rendered = shallow(<ChooseGroupContentComponent groups={groups} />);
        const list = rendered.find(GroupList);
        expect(list).to.have.length(1);
        expect(list.props()).to.eql({
            groups: groups
        });
    });

    it("gets groups when component mounts", () => {
        const groups = [mockModellingGroup(), mockModellingGroup()];
        const rendered = shallow(<ChooseGroupContentComponent groups={groups} />);
        const list = rendered.find(GroupList);
    });

    it("maps state to props with groups", () => {
        const groups :ModellingGroup[] = [mockModellingGroup()];
        const contribStateMock = mockContribState({ groups: { userGroups: groups } })
        const props = mapStateToProps(contribStateMock);
        expect(props.groups).to.eql(groups);
    });

    it("maps state to props with no groups", () => {
        const groups: ModellingGroup[] = [];
        const contribStateMock = mockContribState({ groups: { userGroups: groups } })
        const props = mapStateToProps(contribStateMock);
        expect(props.groups).to.eql(groups);
    });
});