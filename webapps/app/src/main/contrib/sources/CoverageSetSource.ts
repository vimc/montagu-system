import { ScenarioTouchstoneAndCoverageSets } from "../../shared/models/Generated";
import { coverageSetActions } from "../actions/CoverageSetActions";
import { CoverageSource } from "./CoverageSource";
import SourceModel = AltJS.SourceModel;
import { responsibilityStore } from "../stores/ResponsibilityStore";

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
                const set = responsibilityStore.getCurrentResponsibilitySet();
                if (set != null) {
                    const coverageSets = set.getCoverageSets(state.currentResponsibility.scenario.id);
                    return coverageSets != null && coverageSets.length > 0;
                }
                return false;
            }
        });
    }
}
