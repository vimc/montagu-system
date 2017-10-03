import * as AltJS from "alt";
import { ModellingGroup, ModellingGroupDetails } from "../../shared/models/Generated";
import { alt } from "../../shared/alt";
import { AbstractStore } from "../../shared/stores/AbstractStore";
import { modellingGroupActions } from "../../shared/actions/ModellingGroupActions";
import { RemoteContent } from "../../shared/models/RemoteContent";
import { ILookup } from "../../shared/models/Lookup";
import { ModellingGroupSource } from "../sources/ModellingGroupSource";
import StoreModel = AltJS.StoreModel;

export interface GroupState extends RemoteContent {
    groups: ModellingGroup[];
    groupDetails: ILookup<ModellingGroupDetails>;
    currentGroupId: string;
    membersLookup: ILookup<string[]>;
}

interface Interface extends AltJS.AltStore<GroupState> {
    fetchGroups(): Promise<ModellingGroup[]>;

    fetchGroupDetails(): Promise<ModellingGroupDetails>;

    getCurrentGroupDetails(): ModellingGroupDetails;

    getCurrentGroupMembers(): string[];
}

export class GroupStore extends AbstractStore<GroupState, Interface> {
    groups: ModellingGroup[];
    groupDetails: ILookup<ModellingGroupDetails>;
    currentGroupId: string;
    membersLookup: ILookup<string[]>;
    ready: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchGroups: modellingGroupActions.beginFetchGroups,
            handleUpdateGroups: modellingGroupActions.updateGroups,

            handleSetCurrentGroup: modellingGroupActions.setCurrentGroup,

            handleBeginFetchDetails: modellingGroupActions.beginFetchDetails,
            handleUpdateGroupDetails: modellingGroupActions.updateGroupDetails,
            handleAddMember: modellingGroupActions.addMember,
            handleRemoveMember: modellingGroupActions.removeMember
        });
        this.registerAsync(new ModellingGroupSource());
        this.exportPublicMethods({
            getCurrentGroupDetails: () => {
                if (this.currentGroupId && this.groupDetails.hasOwnProperty(this.currentGroupId)) {
                    return this.groupDetails[this.currentGroupId]
                } else {
                    return null;
                }
            },

            getCurrentGroupMembers: () => {
                if (this.currentGroupId && this.membersLookup.hasOwnProperty(this.currentGroupId)) {
                    return this.membersLookup[this.currentGroupId]
                } else {
                    return null;
                }
            }
        })
    }

    initialState(): GroupState {
        return {
            groups: [],
            groupDetails: {},
            currentGroupId: null,
            ready: false,
            membersLookup: {}
        };
    }

    handleBeginFetchGroups() {
        this.ready = false;
        this.groups = [];
    }

    handleUpdateGroups(groups: ModellingGroup[]) {
        this.ready = true;
        this.groups = groups;
    }

    handleSetCurrentGroup(groupId: string) {
        this.currentGroupId = groupId;
    }

    handleBeginFetchDetails(groupId: string) {
        this.ready = false;
        delete this.groupDetails[groupId];
    }

    handleUpdateGroupDetails(details: ModellingGroupDetails) {
        this.ready = true;
        this.groupDetails[details.id] = details;
        this.membersLookup[details.id] = details.members;
    }

    handleAddMember(username: string) {

        if (this.filteredMembers(username).length == this.membersLookup[this.currentGroupId].length) {
            this.membersLookup[this.currentGroupId].push(username)
        }
    }

    handleRemoveMember(username: string) {

        this.membersLookup[this.currentGroupId]
            = this.filteredMembers(username);

    }

    filteredMembers(usernameToFilterOut: string){
        return this.membersLookup[this.currentGroupId].filter(u => u != usernameToFilterOut)
    }

}

export const groupStore = alt.createStore<GroupState>(GroupStore as StoreModel<GroupState>) as Interface;
