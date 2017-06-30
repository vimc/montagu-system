import { Source } from "../../shared/sources/Source";
import { ModellingGroup, ModellingGroupDetails } from "../../shared/models/Generated";
import { GroupState } from "../stores/GroupStore";
import SourceModel = AltJS.SourceModel;
import { modellingGroupActions } from "../../shared/actions/ModellingGroupActions";

export class ModellingGroupSource extends Source<GroupState> {
    fetchGroups: () => SourceModel<ModellingGroup[]>;
    fetchGroupDetails: () => SourceModel<ModellingGroupDetails>;

    constructor() {
        super();
        this.fetchGroups = () => this.doFetch(_ => "/modelling-groups/", {
            success: modellingGroupActions.updateGroups,
            loading: modellingGroupActions.beginFetchGroups,
            isCached: s => s.groups && s.groups.length > 0
        });
        this.fetchGroupDetails = () => this.doFetch(s => `/modelling-groups/${s.currentGroupId}/`, {
            success: modellingGroupActions.updateGroupDetails,
            loading: modellingGroupActions.beginFetchDetails,
            isCached: s => s.groupDetails.hasOwnProperty(s.currentGroupId)
        });
    }
}