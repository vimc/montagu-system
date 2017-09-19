import { CoverageSource } from "./CoverageSource";
import SourceModel = AltJS.SourceModel;
import { estimateTokenActions } from "../actions/EstimateActions";

export class EstimatesTokenSource extends CoverageSource {
    fetchOneTimeEstimatesToken: () => SourceModel<string>;

    constructor() {
        super();
        this.fetchOneTimeEstimatesToken = () => this.doFetch(state => {
            return this.baseURL(state) + "/estimates/get_onetime_link/";
        }, {
            success: estimateTokenActions.update,
            loading: estimateTokenActions.beginFetch,
            isCached: () => false   // Always get a fresh token
        });
    }
}
