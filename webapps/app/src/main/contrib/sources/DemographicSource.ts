import { Source } from "../../shared/sources/Source";
import { DemographicState } from "../stores/DemographicStore";
import { DemographicStatisticType } from "../../shared/models/Generated";
import { demographicActions } from "../actions/DemographicActions";
import SourceModel = AltJS.SourceModel;

export class DemographicSource extends Source<DemographicState> {
    fetchDataSets: () => SourceModel<DemographicStatisticType[]>;

    constructor() {
        super();
        this.fetchDataSets = () => this.doFetch(s => `/touchstones/${s.currentTouchstone}/demographics/`, {
            success: demographicActions.update,
            loading: demographicActions.beginFetch,
            isCached: state => state.currentTouchstone in state.dataSets
        });
    }
}
