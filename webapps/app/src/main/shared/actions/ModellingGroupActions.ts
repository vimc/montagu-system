import alt from "../alt";
import { FetchActions, FetchActionsInterface } from "./FetchActions";
import { ModellingGroup, ModellingGroupDetails } from "../models/Generated";

interface Actions {
    beginFetchGroups(): boolean;
    updateGroups(groups: ModellingGroup[]): ModellingGroup[];

    setCurrentGroup(groupId: string): string;

    beginFetchDetails(id: string): string;
    updateGroupDetails(details: ModellingGroupDetails): ModellingGroupDetails;

    addMember(username: string): string;
    removeMember(username: string): string;
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

    addMember(username: string){
        return username;
    }

    removeMember(username: string){
        return username;
    }
}

export const modellingGroupActions = alt.createActions<Actions>(ModellingGroupActions);
