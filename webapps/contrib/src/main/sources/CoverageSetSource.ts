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
        this.fetchCoverageSets = () => {
            return this.doFetch(s => `/touchstones/${s.currentTouchstone.id}/scenarios/${s.currentResponsibility.scenario.id}/`);
        };
    }
}
