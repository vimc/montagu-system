import { Dispatch } from "redux";

import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {responsibilityOverviewPageActionCreators} from "./responsibilityOverviewPageActionCreators";
import {
    DownloadCoveragePageComponent,
    DownloadCoveragePageLocationProps
} from "../../components/Responsibilities/Coverage/DownloadCoveragePage";
import {responsibilitiesActionCreators} from "../responsibilitiesActionCreators";
import {coverageActionCreators} from "../coverageActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {userActionCreators} from "../userActionCreators";
import {
    ExpectationsPageComponent,
    ExpectationsPageLocationProps
} from "../../components/Responsibilities/Expectations/ExpectationsPage";

export const expectationsPageActionCreators = {
    onLoad(props: ExpectationsPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(ExpectationsPageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: ExpectationsPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>) => {
            await dispatch(responsibilityOverviewPageActionCreators.loadData(props));
        }
    }

};