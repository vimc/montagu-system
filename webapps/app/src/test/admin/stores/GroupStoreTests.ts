import { alt } from "../../../main/shared/alt";
import { expect } from "chai";
import { modellingGroupActions } from "../../../main/shared/actions/ModellingGroupActions";
import { mockModellingGroup, mockModellingGroupDetails } from "../../mocks/mockModels";
import { groupStore } from "../../../main/admin/stores/GroupStore";

describe("GroupStore", () => {
    beforeEach(() => alt.recycle());

    it("modellingGroupActions.updateGroups sets groups", () => {
        const groups = [ mockModellingGroup(), mockModellingGroup() ];
        modellingGroupActions.updateGroups(groups);
        const s = groupStore.getState();
        expect(s.groups).to.eql(groups);
        expect(s.ready).to.be.true;
    });

    it("modellingGroupActions.beginFetchGroups clears groups and set unready", () => {
        modellingGroupActions.updateGroups([ mockModellingGroup() ]);
        modellingGroupActions.beginFetchGroups();
        const s = groupStore.getState();
        expect(s.groups).to.eql([]);
        expect(s.ready).to.be.false;
    });

    it("modellingGroupActions.updateGroupDetails sets group details", () => {
        const a = mockModellingGroupDetails({ id: "a" });
        const b1 = mockModellingGroupDetails({ id: "b" });
        const b2 = mockModellingGroupDetails({ id: "b" });

        // Initial set
        modellingGroupActions.updateGroupDetails(a);
        let s = groupStore.getState();
        expect(s.groupDetails["a"]).to.eql(a);
        expect(s.ready).to.be.true;

        // Different id doesn't affect the old one
        modellingGroupActions.updateGroupDetails(b1);
        s = groupStore.getState();
        expect(s.groupDetails["a"]).to.eql(a);
        expect(s.groupDetails["b"]).to.eql(b1);

        // Same id updates in place
        modellingGroupActions.updateGroupDetails(b2);
        s = groupStore.getState();
        expect(s.groupDetails["a"]).to.eql(a);
        expect(s.groupDetails["b"]).to.eql(b2);
    });

    it("modellingGroupActions.beginFetchDetails clears groups and set unready", () => {
        const a = mockModellingGroupDetails({ id: "a" });
        const b = mockModellingGroupDetails({ id: "b" });
        modellingGroupActions.updateGroupDetails(a);
        modellingGroupActions.updateGroupDetails(b);
        modellingGroupActions.beginFetchDetails("a");
        const s = groupStore.getState();
        expect(s.groupDetails["a"]).to.be.undefined;
        expect(s.groupDetails["b"]).to.eql(b);
        expect(s.ready).to.be.false;
    });

    it("getCurrentGroupDetails returns null for unknown group", () => {
        expect(groupStore.getCurrentGroupDetails()).to.be.null;
        modellingGroupActions.setCurrentGroup("a");
        expect(groupStore.getCurrentGroupDetails()).to.be.null;
    });

    it("getCurrentGroupDetails returns null for group without details", () => {
        modellingGroupActions.updateGroups([ mockModellingGroup({ id: "a" }) ]);
        modellingGroupActions.setCurrentGroup("a");
        expect(groupStore.getCurrentGroupDetails()).to.be.null;
    });

    it("getCurrentGroupDetails returns details for group with details", () => {
        const details = mockModellingGroupDetails({ id: "a" });
        modellingGroupActions.updateGroups([ mockModellingGroup({ id: "a" }) ]);
        modellingGroupActions.setCurrentGroup("a");
        modellingGroupActions.updateGroupDetails(details);
        expect(groupStore.getCurrentGroupDetails()).to.be.eql(details);
    });

    it("addMember adds member", () => {const details = mockModellingGroupDetails({ id: "group1", members: [ "user1"] });
        alt.bootstrap(JSON.stringify({
            GroupStore: {
                currentGroupId: "group1",
                groups: [ {id: "group1", description: "some desc"}],
                groupDetails: {"group1": details},
                currentMembers: ["user1"]
            }
        }));

        modellingGroupActions.addMember("username");
        expect(groupStore.getState().currentMembers.indexOf("username")).to.be.greaterThan(-1);
    });

    it("addMember does not add duplicate member", () => {
        const details = mockModellingGroupDetails({ id: "group1", members: [ "user1"] });
        alt.bootstrap(JSON.stringify({
            GroupStore: {
                currentGroupId: "group1",
                groups: [ {id: "group1", description: "some desc"}],
                groupDetails: {"group1": details},
                currentMembers: ["user1"]
            }
        }));
        modellingGroupActions.addMember("user1");
        expect(groupStore.getState().currentMembers.length).to.be.eq(1)
    });

    it("removeMember removes member", () => {
        const details = mockModellingGroupDetails({ id: "group1", members: [ "user1"] });
        alt.bootstrap(JSON.stringify({
            GroupStore: {
                currentGroupId: "group1",
                groups: [ {id: "group1", description: "some desc"}],
                groupDetails: {"group1": details},
                currentMembers: ["user1"]
            }
        }));
        modellingGroupActions.removeMember("user1");
        expect(groupStore.getState().currentMembers.length).to.be.eq(0);
    });
});
