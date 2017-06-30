import { ModellingGroup } from "../../shared/models/Generated";
import { Source } from "../../shared/sources/Source";
import { MainState } from "../stores/MainStore";
import { modellingGroupActions } from "../actions/ModellingGroupActions";
import SourceModel = AltJS.SourceModel;

export class ModellingGroupSource extends Source<MainState> {
    fetchModellingGroups: () => SourceModel<ModellingGroup[]>;

    constructor() {
        super();
        this.fetchModellingGroups = () => this.doFetch(_ => "/modelling-groups/", {
            success: modellingGroupActions.update,
            loading: modellingGroupActions.beginFetch,
            isCached: state => state.modellingGroups.loaded
        });
    }
}
