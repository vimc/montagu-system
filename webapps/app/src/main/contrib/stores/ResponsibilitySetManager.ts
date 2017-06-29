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
        // Include all the elements that *don't* match the given modelling group and touchstone
        this.sets = this.sets.filter(s => !this.matches(s, modellingGroup, touchstone));
    }

    private matches(set: ExtendedResponsibilitySet, modellingGroup: ModellingGroup, touchstone: Touchstone) {
        return set.modellingGroup.id == modellingGroup.id && set.touchstone.id == touchstone.id;
    }
}
