import {Dispatch} from "redux";

import {ContribAppState} from "../../reducers/contribAppReducers";
import {DownloadDemographicsPageLocationProps} from "../../components/Responsibilities/Demographics/DownloadDemographicsPage";
import {responsibilityOverviewPageActionCreators} from "./responsibilityOverviewPageActionCreators";
import {demographicActionCreators} from "../demographicActionCreators";
import {ContribPageActionCreators} from "./ContribPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";


class DownloadDemographicsPageActionCreators extends ContribPageActionCreators<DownloadDemographicsPageLocationProps> {

    parent = responsibilityOverviewPageActionCreators;

    createBreadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: "Download demographic data sets",
            urlFragment: "demographics/"
        }
    }

    loadData(params: DownloadDemographicsPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>) => {
            await dispatch(demographicActionCreators.getDataSets(params.touchstoneId));
        }
    }

}

export const downloadDemographicsPageActionCreators = new DownloadDemographicsPageActionCreators();