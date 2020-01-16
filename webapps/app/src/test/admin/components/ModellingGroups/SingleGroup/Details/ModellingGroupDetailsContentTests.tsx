import * as React from "react";
import { shallow} from "enzyme";


import "../../../../../helper";
import {mockModellingGroup, mockModellingGroupDetails, mockUser} from "../../../../../mocks/mockModels";
import { Sandbox } from "../../../../../Sandbox";
import {createMockStore} from "../../../../../mocks/mockStore";
import {
    ModellingGroupDetailsContent,
    ModellingGroupDetailsContentComponent
} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Details/ModellingGroupDetailsContent";
import {ModellingGroupDetailsMembers} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Details/ModellingGroupDetailsMembers";


describe("Modelling Group Details Content Component tests", () => {

    const testGroup = mockModellingGroup();
    const testGroupDetails = mockModellingGroupDetails({id: testGroup.id});
    const testUser = mockUser();
    const testUser2 = mockUser();

    describe("Connected", () => {

        const sandbox = new Sandbox();
        afterEach(() => sandbox.restore());

        it("props on connect level, can manage", () => {
            const testState = {
                groups: { currentGroupDetails: testGroupDetails, currentGroupMembers: [testUser, testUser2]},
                auth: { permissions: ["*/modelling-groups.manage-members"] }
            };
            const store = createMockStore(testState);
            const rendered = shallow(<ModellingGroupDetailsContent/>, {context: {store}});
            expect(rendered.props().group).toEqual(testGroupDetails);
            expect(rendered.props().members).toEqual([testUser, testUser2]);
            expect(rendered.props().canManageGroupMembers).toBe(true);
        });

        it("props on connect level, can not manage", () => {
            const testState = {
                groups: { currentGroupDetails: testGroupDetails},
                users: { users: [testUser, testUser2]},
                auth: { permissions: ["test"] }
            };
            const store = createMockStore(testState);
            const rendered = shallow(<ModellingGroupDetailsContent/>, {context: {store}});
            expect(rendered.props().canManageGroupMembers).toBe(false);
        });

    });

    describe("Component", () => {
        it("renders group details content", () => {
            const rendered = shallow(<ModellingGroupDetailsContentComponent
                group={testGroupDetails}
                members={[testUser]}
                canManageGroupMembers={true}
            />);
            const rows = rendered.find('tr');
            expect(rows.at(0).find('td').at(1).text()).toEqual(testGroupDetails.id);
            const summary = rows.at(1).find(ModellingGroupDetailsMembers);
            expect(summary.length).toEqual(1);
            expect(summary.props().group).toEqual(testGroupDetails);
            expect(summary.props().members).toEqual([testUser]);
            expect(summary.props().canEdit).toBe(true);
        });

    });

});