import { ExtendedResponsibilitySet } from "../models/ResponsibilitySet";
import { isNullOrUndefined } from "util";
import { ModellingGroup, Touchstone } from "../../shared/models/Generated";

export class ResponsibilitySetManager {
    private sets: ExtendedResponsibilitySet[];

    constructor(initialSets?: ExtendedResponsibilitySet[]) {
        this.sets = initialSets || [];
    }

    addSet(set: ExtendedResponsibilitySet) {
        this.sets.push(set);
    }

    getSet(modellingGroup: ModellingGroup, touchstone: Touchstone): ExtendedResponsibilitySet {
        const set = this.sets.find(s => this.matches(s, modellingGroup, touchstone));
        if (isNullOrUndefined(set)) {
            return null;
        } else {
            return set;
        }
    }

    hasSet(modellingGroup: ModellingGroup, touchstone: Touchstone): boolean {
        const set = this.sets.find(s => this.matches(s, modellingGroup, touchstone));
        return !isNullOrUndefined(set);
    }

    clearSet(modellingGroup: ModellingGroup, touchstone: Touchstone) {
        const index = this.sets.findIndex(s => this.matches(s, modellingGroup, touchstone));
        this.sets.splice(index, 1);
    }

    private matches(set: ExtendedResponsibilitySet, modellingGroup: ModellingGroup, touchstone: Touchstone) {
        if (modellingGroup == null) {
            throw Error("Modelling group was null");
        }
        if (touchstone == null) {
            throw Error("Touchstone was null");
        }
        if (set.modellingGroup == null) {
            throw Error("Cannot perform comparison: Set had null modelling group");
        }
        if (set.touchstone == null) {
            throw Error("Cannot perform comparison: Set had null touchstone");
        }
        return set.modellingGroup.id == modellingGroup.id && set.touchstone.id == touchstone.id;
    }
}
