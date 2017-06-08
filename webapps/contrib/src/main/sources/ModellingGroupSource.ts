import { ModellingGroup } from "../models/Generated";
import { Source } from "./Source";
import { MainState } from "../stores/MainStore";
import { modellingGroupActions } from "../actions/ModellingGroupActions";
import SourceModel = AltJS.SourceModel;

export class ModellingGroupSource extends Source<ModellingGroup[], MainState> {
    fetchModellingGroups: () => SourceModel<ModellingGroup[]>;

    constructor() {
        super({ success: modellingGroupActions.update, loading: modellingGroupActions.beginFetch });
        this.fetchModellingGroups = () => this.doFetch(_ => "/modelling-groups/");
    }
}
