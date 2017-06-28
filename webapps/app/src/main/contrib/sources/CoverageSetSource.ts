import { ScenarioTouchstoneAndCoverageSets } from "../../shared/models/Generated";
import { coverageSetActions } from "../actions/CoverageSetActions";
import { CoverageSource } from "./CoverageSource";
import SourceModel = AltJS.SourceModel;
import { getCurrentResponsibilitySet } from "../stores/ResponsibilityStore";

export class CoverageSetSource extends CoverageSource {
    fetchCoverageSets: () => SourceModel<ScenarioTouchstoneAndCoverageSets>;

    constructor() {
        super();
        this.fetchCoverageSets = () => this.doFetch<ScenarioTouchstoneAndCoverageSets>(state => {
            return this.baseURL(state) + "/coverage_sets/";
        }, {
            success: coverageSetActions.update,
            loading: coverageSetActions.beginFetch,
            isCached: state => {
                const sets = getCurrentResponsibilitySet(state).getCoverageSets(state.currentResponsibility.scenario.id);
                return sets != null && sets.length > 0;
            }
        });
    }
}
