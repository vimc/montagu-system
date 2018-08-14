import {Dispatch} from "redux";

import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {demographicActionCreators} from "../../../shared/actions/demographicActionCreators";
import {touchstoneVersionPageActionCreators} from "./touchstoneVersionPageActionCreators";
import {TouchstoneVersionPageLocationProps} from "../../components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";

class DownloadDemographicsAdminPageActionCreators extends AdminPageActionCreators<TouchstoneVersionPageLocationProps> {

    parent = touchstoneVersionPageActionCreators;

    title() {
        return "Download demographic data sets"
    }

    createBreadcrumb(): PageBreadcrumb {
        return {
            name: "Download demographic data sets",
            urlFragment: "demographics/"
        }
    }

    loadData(params: TouchstoneVersionPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(demographicActionCreators.getDataSets(params.touchstoneVersionId));
        }
    }

}

export const downloadDemographicsAdminPageActionCreators = new DownloadDemographicsAdminPageActionCreators();