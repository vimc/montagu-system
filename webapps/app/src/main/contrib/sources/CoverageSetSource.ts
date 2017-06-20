import { ScenarioTouchstoneAndCoverageSets } from "../../shared/models/Generated";
import { coverageSetActions } from "../actions/CoverageSetActions";
import { CoverageSource } from "./CoverageSource";
import SourceModel = AltJS.SourceModel;

export class CoverageSetSource extends CoverageSource {
    fetchCoverageSets: () => SourceModel<ScenarioTouchstoneAndCoverageSets>;

    constructor() {
        super();
        this.fetchCoverageSets = () => this.doFetch(state => {
            return this.baseURL(state) + "/coverage_sets/";
        }, {
            success: coverageSetActions.update,
            loading: coverageSetActions.beginFetch
        });
    }
}
