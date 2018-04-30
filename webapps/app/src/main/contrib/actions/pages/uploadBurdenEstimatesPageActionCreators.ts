import { Dispatch } from "redux";

import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {responsibilityOverviewPageActionCreators} from "./responsibilityOverviewPageActionCreators";

import {
    UploadBurdenEstimatesPageComponent,
    UploadBurdenEstimatesPageLocationProps,
} from "../../components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";
import {responsibilitiesActionCreators} from "../responsibilitiesActionCreators";
import {estimatesActionCreators} from "../estimatesActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";

export const uploadBurdenEstimatesPageActionCreators = {
    onLoad(props: UploadBurdenEstimatesPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(UploadBurdenEstimatesPageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: UploadBurdenEstimatesPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>) => {
            await dispatch(responsibilityOverviewPageActionCreators.loadData(props));
            dispatch(responsibilitiesActionCreators.setCurrentResponsibility(props.scenarioId));
            await dispatch(estimatesActionCreators.getOneTimeToken());
        }
    },



};