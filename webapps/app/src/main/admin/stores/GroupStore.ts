import * as AltJS from "alt";
import { ModellingGroup, ModellingGroupDetails } from "../../shared/models/Generated";
import { alt } from "../../shared/alt";
import { AbstractStore } from "../../shared/stores/AbstractStore";
import { modellingGroupActions } from "../../shared/actions/ModellingGroupActions";
import { RemoteContent } from "../../shared/models/RemoteContent";
import { ILookup } from "../../shared/models/Lookup";
import StoreModel = AltJS.StoreModel;
import {ModellingGroupSource} from "../sources/ModellingGroupSource";

export interface GroupState extends RemoteContent {
    groups: ModellingGroup[];
    groupDetails: ILookup<ModellingGroupDetails>;
    currentGroupId: string;
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
    ready: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchGroups: modellingGroupActions.beginFetchGroups,
            handleUpdateGroups: modellingGroupActions.updateGroups,

            handleSetCurrentGroup: modellingGroupActions.setCurrentGroup,

            handleBeginFetchDetails: modellingGroupActions.beginFetchDetails,
            handleUpdateGroupDetails: modellingGroupActions.updateGroupDetails,
            handleAddMember: modellingGroupActions.addMember
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
            ready: false
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
    }

    handleAddMember(username: string){
        this.groupDetails[this.currentGroupId].members.push(username)
    }
}

export const groupStore = alt.createStore<GroupState>(GroupStore as StoreModel<GroupState>) as Interface;
