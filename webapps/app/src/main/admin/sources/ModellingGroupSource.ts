import { Source } from "../../shared/sources/Source";
import { ModellingGroup } from "../../shared/models/Generated";
import { GroupState } from "../stores/GroupStore";
import SourceModel = AltJS.SourceModel;
import { modellingGroupActions } from "../actions/ModellingGroupActions";

export class ModellingGroupSource extends Source<ModellingGroup[], GroupState> {
    fetch: () => SourceModel<ModellingGroup[]>;

    constructor() {
        super({ success: modellingGroupActions.update, loading: modellingGroupActions.beginFetch });
        this.fetch = () => this.doFetch(_ => "/modelling-groups/");
    }
}