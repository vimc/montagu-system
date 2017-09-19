import { coverageTokenActions } from "../actions/CoverageActions";
import { CoverageSource } from "./CoverageSource";
import SourceModel = AltJS.SourceModel;

export class EstimatesTokenSource extends CoverageSource {
    fetchOneTimeEstimatesToken: () => SourceModel<string>;

    constructor() {
        super();
        this.fetchOneTimeEstimatesToken = () => this.doFetch(state => {
            return this.baseURL(state) + "/estimates/get_onetime_link/";
        }, {
            success: coverageTokenActions.update,
            loading: coverageTokenActions.beginFetch,
            isCached: () => false   // Always get a fresh token
        });
    }
}
