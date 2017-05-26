import { ScenarioTouchstoneAndCoverageSets } from "../models/Generated";
import { coverageSetActions } from "../actions/CoverageSetActions";
import { CoverageSource } from "./CoverageSource";
import SourceModel = AltJS.SourceModel;

export class CoverageSetSource extends CoverageSource<ScenarioTouchstoneAndCoverageSets> {
    fetchCoverageSets: () => SourceModel<ScenarioTouchstoneAndCoverageSets>;

    constructor() {
        super({
            success: coverageSetActions.update,
            loading: coverageSetActions.beginFetch
        });
        this.fetchCoverageSets = () => this.doFetch(state => {
            return this.baseURL(state) + "/coverage_sets/";
        });
    }
}
