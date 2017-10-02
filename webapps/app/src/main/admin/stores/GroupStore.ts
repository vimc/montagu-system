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
    currentMembers: string[];
}

interface Interface extends AltJS.AltStore<GroupState> {
    fetchGroups(): Promise<ModellingGroup[]>;

    fetchGroupDetails(): Promise<ModellingGroupDetails>;

    getCurrentGroupDetails(): ModellingGroupDetails;
}

export class GroupStore extends AbstractStore<GroupState, Interface> {
    groups: ModellingGroup[];
    groupDetails: ILookup<ModellingGroupDetails>;
    currentGroupId: string;
    currentMembers: string[];
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
            }
        })
    }

    initialState(): GroupState {
        return {
            groups: [],
            groupDetails: {},
            currentGroupId: null,
            ready: false,
            currentMembers: []
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
        if (this.groupDetails.hasOwnProperty(this.currentGroupId)) {
            this.currentMembers = this.groupDetails[groupId].members;
        }
    }

    handleBeginFetchDetails(groupId: string) {
        this.ready = false;
        delete this.groupDetails[groupId];
    }

    handleUpdateGroupDetails(details: ModellingGroupDetails) {
        this.ready = true;
        this.groupDetails[details.id] = details;

        if (this.groupDetails.hasOwnProperty(this.currentGroupId)) {
            this.currentMembers = this.groupDetails[this.currentGroupId].members;
        }
    }

    handleAddMember(username: string) {

        if (this.currentMembers.filter(u => u != username).length == this.currentMembers.length) {
            this.currentMembers.push(username)
        }
    }

    handleRemoveMember(username: string) {

        this.currentMembers
            = this.currentMembers.filter(u => u != username);

    }

}

export const groupStore = alt.createStore<GroupState>(GroupStore as StoreModel<GroupState>) as Interface;
