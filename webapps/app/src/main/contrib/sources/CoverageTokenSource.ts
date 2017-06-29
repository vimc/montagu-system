import { coverageTokenActions } from "../actions/CoverageActions";
import { CoverageSource } from "./CoverageSource";
import SourceModel = AltJS.SourceModel;

export class CoverageTokenSource extends CoverageSource {
    fetchOneTimeCoverageToken: () => SourceModel<string>;

    constructor() {
        super();
        this.fetchOneTimeCoverageToken = () => this.doFetch(state => {
            return this.baseURL(state) + "/coverage/get_onetime_link/";
        }, {
            success: coverageTokenActions.update,
            loading: coverageTokenActions.beginFetch,
            isCached: () => false   // Always get a fresh token
        });
    }
}
