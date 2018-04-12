import { Dispatch } from "redux";

import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {
    DownloadDemographicsPageComponent,
    DownloadDemographicsPageLocationProps,
} from "../../components/Responsibilities/Demographics/DownloadDemographicsPage";
import {responsibilityOverviewPageActionCreators} from "./responsibilityOverviewPageActionCreators";
import {demographicActionCreators} from "../demographicActionCreators";

export const downloadDemographicsPageActionCreators = {
    onLoad(props: DownloadDemographicsPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActions.createBreadcrumbs(DownloadDemographicsPageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: DownloadDemographicsPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>) => {
            await dispatch(responsibilityOverviewPageActionCreators.loadData(props));
            await dispatch(demographicActionCreators.getDataSets(props.touchstoneId));
        }
    }

};