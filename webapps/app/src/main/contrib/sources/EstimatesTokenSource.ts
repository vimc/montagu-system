import {CoverageSource} from "./CoverageSource";
import SourceModel = AltJS.SourceModel;
import {estimateTokenActions} from "../actions/EstimateActions";
import {appSettings} from "../../shared/Settings";
import {settings} from "../../shared/Settings";

export class EstimatesTokenSource extends CoverageSource {
    fetchOneTimeEstimatesToken: () => SourceModel<string>;

    constructor() {
        super();
        this.fetchOneTimeEstimatesToken = () => this.doFetch(state => {
            let queryString = "";
            if (state.redirectPath && state.redirectPath.length > 0) {
                queryString = "?redirectUrl=" + encodeURI(settings.montaguUrl() + appSettings.publicPath + state.redirectPath);
            }
            return this.baseURL(state) + `/estimates/get_onetime_link/${queryString}`;
        }, {
            success: estimateTokenActions.update,
            loading: estimateTokenActions.beginFetch,
            isCached: () => false   // Always get a fresh token
        });
    }
}
