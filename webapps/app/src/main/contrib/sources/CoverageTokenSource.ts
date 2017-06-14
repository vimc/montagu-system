import { coverageTokenActions } from "../actions/CoverageActions";
import { CoverageSource } from "./CoverageSource";
import SourceModel = AltJS.SourceModel;

export class CoverageTokenSource extends CoverageSource<string> {
    fetchOneTimeCoverageToken: () => SourceModel<string>;

    constructor() {
        super({
            success: coverageTokenActions.update,
            loading: coverageTokenActions.beginFetch
        });
        this.fetchOneTimeCoverageToken = () => this.doFetch(state => {
            return this.baseURL(state) + "/coverage/get_onetime_link/";
        });
    }
}
