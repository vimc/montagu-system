import { Source } from "../../shared/sources/Source";
import { DemographicState } from "../stores/DemographicStore";
import { DemographicDataset } from "../../shared/models/Generated";
import { demographicActions } from "../actions/DemographicActions";
import SourceModel = AltJS.SourceModel;

export class DemographicSource extends Source<DemographicState> {
    fetchDataSets: () => SourceModel<DemographicDataset[]>;
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
            const source = s.selectedDataSet.source;
            const type = dataSet.id;
            let url = `/touchstones/${s.currentTouchstone}/demographics/${source}/${type}/get_onetime_link/?format=${s.selectedFormat}`;
            if (dataSet.gender_is_applicable) {
                url += `&gender=${s.selectedGender}`
            }
            return url;
        }, {
            success: demographicActions.updateToken,
            loading: demographicActions.beginFetchToken,
            isCached: state => false
        });
    }
}
