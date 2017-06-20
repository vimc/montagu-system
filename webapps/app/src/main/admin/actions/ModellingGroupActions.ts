import alt from "../../shared/alt";
import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { ModellingGroup, ModellingGroupDetails } from "../../shared/models/Generated";

interface Actions {
    beginFetchGroups(): boolean;
    updateGroups(groups: ModellingGroup[]): ModellingGroup[];

    setCurrentGroup(groupId: string): string;

    beginFetchDetails(id: string): string;
    updateGroupDetails(details: ModellingGroupDetails): ModellingGroupDetails;
}

class ModellingGroupActions extends FetchActions<ModellingGroup[]> implements Actions {
    beginFetchGroups(): boolean {
        return true;
    }
    updateGroups(groups: ModellingGroup[]) {
        return groups;
    }

    setCurrentGroup(groupId: string): string {
        return groupId;
    }

    beginFetchDetails(id: string): string {
        return id;
    }
    updateGroupDetails(details: ModellingGroupDetails) {
        return details;
    }
}

export const modellingGroupActions = alt.createActions<Actions>(ModellingGroupActions);
