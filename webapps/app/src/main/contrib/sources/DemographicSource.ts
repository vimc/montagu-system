import { Source } from "../../shared/sources/Source";
import { DemographicState } from "../stores/DemographicStore";
import { DemographicStatisticType } from "../../shared/models/Generated";
import { demographicActions } from "../actions/DemographicActions";
import SourceModel = AltJS.SourceModel;

export class DemographicSource extends Source<DemographicState> {
    fetchDataSets: () => SourceModel<DemographicStatisticType[]>;
    _fetchOneTimeToken: () => SourceModel<string>;

    constructor() {
        super();
        this.fetchDataSets = () => this.doFetch(s => `/touchstones/${s.currentTouchstone}/demographics/`, {
            success: demographicActions.update,
            loading: demographicActions.beginFetch,
            isCached: state => state.currentTouchstone in state.dataSets
        });
        this._fetchOneTimeToken = () => this.doFetch(s => {
            const dataSet = s.selectedDataSet;
            const source = s.selectedSource;
            const type = dataSet.id;
            return `/touchstones/${s.currentTouchstone}/demographics/${source}/${type}/get_onetime_link/`;
        }, {
            success: demographicActions.updateToken,
            loading: demographicActions.beginFetchToken,
            isCached: state => false
        });
    }
}
