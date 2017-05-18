import { ScenarioTouchstoneAndCoverageSets } from "../models/Generated";
import { Source } from "./Source";
import { State } from "../stores/ResponsibilityStore";
import { responsibilityActions } from "../actions/ResponsibilityActions";
import SourceModel = AltJS.SourceModel;

export class CoverageSetSource extends Source<ScenarioTouchstoneAndCoverageSets, State> {
    fetchCoverageSets: () => SourceModel<ScenarioTouchstoneAndCoverageSets>;

    constructor() {
        super({
            success: responsibilityActions.updateCoverageSets,
            loading: responsibilityActions.beginFetchCoverageSets
        });
        this.fetchCoverageSets = () => this.doFetch(s => {
            const group = s.currentModellingGroupId;
            const touchstone = s.currentTouchstone.id;
            const scenario = s.currentResponsibility.scenario.id;
            return `/modelling-groups/${group}/responsibilities/${touchstone}/${scenario}/coverage_sets/`;
        });
    }
}
