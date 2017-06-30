import { expect } from "chai";
import { ResponsibilitySetManager } from "../../../main/contrib/stores/ResponsibilitySetManager";
import { mockExtendedResponsibilitySet, mockModellingGroup, mockTouchstone } from "../../mocks/mockModels";
import { ModellingGroup, Touchstone } from "../../../main/shared/models/Generated";

describe("ResponsibilitySetManager", () => {
    let manager: ResponsibilitySetManager;
    let touchstone: Touchstone;
    let group: ModellingGroup;

    beforeEach(() => {
        manager = new ResponsibilitySetManager();
        touchstone = mockTouchstone();
        group = mockModellingGroup();
    });

    it("hasSet only returns true if a matching set has been added", () => {
        manager.addSet(mockExtendedResponsibilitySet(null, null, touchstone, group));
        expect(manager.hasSet(group, touchstone)).to.be.true;
        expect(manager.hasSet(mockModellingGroup(), touchstone)).to.be.false;
        expect(manager.hasSet(group, mockTouchstone())).to.be.false;
    });

    it("getSet returns null if no matching set has been added", () => {
        const set = mockExtendedResponsibilitySet(null, null, touchstone, group);
        manager.addSet(set);
        expect(manager.getSet(group, touchstone)).to.be.equal(set);
        expect(manager.getSet(mockModellingGroup(), touchstone)).to.be.null;
        expect(manager.getSet(group, mockTouchstone())).to.be.null;
    });

    it("clearSet clears the set", () => {
        manager.addSet(mockExtendedResponsibilitySet(null, null, touchstone, group));
        expect(manager.hasSet(group, touchstone)).to.be.true;
        manager.clearSet(group, touchstone);
        expect(manager.hasSet(group, touchstone)).to.be.false;
    });
});
