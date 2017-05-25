import { ScenarioTouchstoneAndCoverageSets } from "../models/Generated";
import { Source } from "./Source";
import { State } from "../stores/ResponsibilityStore";
import { responsibilityActions } from "../actions/ResponsibilityActions";
import SourceModel = AltJS.SourceModel;
import fetcher from "./Fetcher";

export class CoverageSetSource extends Source<ScenarioTouchstoneAndCoverageSets, State> {
    fetchCoverageSets: () => SourceModel<ScenarioTouchstoneAndCoverageSets>;

    constructor() {
        super({
            success: responsibilityActions.updateCoverageSets,
            loading: responsibilityActions.beginFetchCoverageSets
        });
        this.fetchCoverageSets = () => this.doFetch(state => {
            return this.baseURL(state) + "/coverage_sets/";
        });
    }

    coverageURL(state: State) {
        return fetcher.buildURL(this.baseURL(state) + "/coverage/");
    }

    private baseURL(state: State): string {
        const k = {
            group: state.currentModellingGroupId,
            touchstone: state.currentTouchstone.id,
            scenario: state.currentResponsibility.scenario.id
        };
        return `/modelling-groups/${k.group}/responsibilities/${k.touchstone}/${k.scenario}`;
    }
}
