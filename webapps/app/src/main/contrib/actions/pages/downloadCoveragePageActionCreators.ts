import { Dispatch, Action } from "redux";

import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";
import {responsibilityOverviewPageActionCreators} from "./responsibilityOverviewPageActionCreators";
import {
    DownloadCoveragePageComponent,
    DownloadCoveragePageLocationProps
} from "../../components/Responsibilities/Coverage/DownloadCoveragePage";
import {responsibilitiesActionCreators} from "../responsibilitiesActionCreators";
import {coverageActionCreators} from "../coverageActionCreators";

export const downloadCoveragePageActionCreators = {
    onLoad(props: DownloadCoveragePageLocationProps) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActions.createBreadcrumbs(DownloadCoveragePageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: DownloadCoveragePageLocationProps) {
        return async (dispatch: Dispatch<any>) => {
            await dispatch(responsibilityOverviewPageActionCreators.loadData(props));
            dispatch(responsibilitiesActionCreators.setCurrentResponsibility(props.scenarioId));
            await dispatch(coverageActionCreators.getOneTimeToken());
            await dispatch(coverageActionCreators.getDataSets());
        }
    }

};