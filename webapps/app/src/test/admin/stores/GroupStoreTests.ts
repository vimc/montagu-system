import { alt } from "../../../main/shared/alt";
import { expect } from "chai";
import { modellingGroupActions } from "../../../main/admin/actions/ModellingGroupActions";
import { mockModellingGroup } from "../../mocks/mockModels";
import { groupStore } from "../../../main/admin/stores/GroupStore";

describe("GroupStore", () => {
    beforeEach(() => alt.recycle());

    it("modellingGroupActions.update sets groups", () => {
        const groups = [ mockModellingGroup(), mockModellingGroup() ];
        modellingGroupActions.updateGroups(groups);
        const s = groupStore.getState();
        expect(s.groups).to.eql(groups);
        expect(s.ready).to.be.true;
    });

    it("modellingGroupActions.beginFetch clears groups and set unready", () => {
        modellingGroupActions.updateGroups([ mockModellingGroup() ]);
        modellingGroupActions.beginFetchGroups();
        const s = groupStore.getState();
        expect(s.groups).to.eql([]);
        expect(s.ready).to.be.false;
    });
});
