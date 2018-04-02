import { Dispatch, Action } from "redux";

import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {
    DownloadDemographicsPageComponent,
    DownloadDemographicsPageLocationProps,
} from "../../components/Responsibilities/Demographics/DownloadDemographicsPage";
import {responsibilityOverviewPageActionCreators} from "./responsibilityOverviewPageActionCreators";

export const downloadDemographicsPageActionCreators = {
    onLoad(props: DownloadDemographicsPageLocationProps) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActions.createBreadcrumbs(DownloadDemographicsPageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: DownloadDemographicsPageLocationProps) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
            await dispatch(responsibilityOverviewPageActionCreators.loadData(props));
        }
    }

};