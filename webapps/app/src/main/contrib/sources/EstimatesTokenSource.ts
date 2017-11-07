import { CoverageSource } from "./CoverageSource";
import SourceModel = AltJS.SourceModel;
import { estimateTokenActions } from "../actions/EstimateActions";
import {appSettings} from "../../shared/Settings";
import { settings } from "../../shared/Settings";

export class EstimatesTokenSource extends CoverageSource {
    fetchOneTimeEstimatesToken: () => SourceModel<string>;

    constructor() {
        super();
        this.fetchOneTimeEstimatesToken = () => this.doFetch(state => {
            const redirectUrl = encodeURI(settings.montaguUrl() + appSettings.publicPath + state.redirectUrl);
            return this.baseURL(state) + `/estimates/get_onetime_link/?redirectUrl=${redirectUrl}/`;
        }, {
            success: estimateTokenActions.update,
            loading: estimateTokenActions.beginFetch,
            isCached: () => false   // Always get a fresh token
        });
    }
}
