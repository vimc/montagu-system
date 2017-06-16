import * as AltJS from "alt";
import { ModellingGroup } from "../../shared/models/Generated";
import { alt } from "../../shared/alt";
import { AbstractStore } from "../../shared/stores/AbstractStore";
import { modellingGroupActions } from "../actions/ModellingGroupActions";
import { RemoteContent } from "../../shared/models/RemoteContent";
import { ModellingGroupSource } from "../sources/ModellingGroupSource";

export interface GroupState extends RemoteContent {
    groups: ModellingGroup[];
}

interface Interface extends AltJS.AltStore<GroupState> {
    fetch(): Promise<ModellingGroup[]>;
}

export class GroupStore extends AbstractStore<GroupState, Interface> {
    groups: ModellingGroup[];
    ready: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleFetch: modellingGroupActions.beginFetch,
            handleUpdate: modellingGroupActions.update
        });
        this.registerAsync(new ModellingGroupSource());
    }

    initialState(): GroupState {
        return {
            groups: null,
            ready: false
        };
    }

    handleFetch() {
        this.ready = false;
        this.groups = null;
    }
    handleUpdate(groups: ModellingGroup[]) {
        this.ready = true;
        this.groups = groups;
    }
}

export const groupStore = alt.createStore<GroupState>(GroupStore) as Interface;
