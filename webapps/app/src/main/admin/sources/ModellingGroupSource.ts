import { Source } from "../../shared/sources/Source";
import { ModellingGroup, ModellingGroupDetails } from "../../shared/models/Generated";
import { GroupState } from "../stores/GroupStore";
import SourceModel = AltJS.SourceModel;
import { modellingGroupActions } from "../actions/ModellingGroupActions";

export class ModellingGroupSource extends Source<GroupState>
{
    fetchGroups: () => SourceModel<ModellingGroup[]>;
    fetchGroupDetails: () => SourceModel<ModellingGroupDetails>;

    constructor() {
        super();
        this.fetchGroups = () => this.doFetch(_ => "/modelling-groups/", {
            success: modellingGroupActions.updateGroups,
            loading: modellingGroupActions.beginFetchGroups
        });
        this.fetchGroupDetails = () => this.doFetch(s => `/modelling-groups/${s.currentGroupId}/`, {
            success: modellingGroupActions.updateGroupDetails,
            loading: modellingGroupActions.beginFetchDetails
        });
    }
}