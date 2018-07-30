import {Dispatch} from "redux";

import {responsibilityOverviewPageActionCreators} from "./responsibilityOverviewPageActionCreators";
import {DownloadCoveragePageLocationProps} from "../../components/Responsibilities/Coverage/DownloadCoveragePage";
import {coverageActionCreators} from "../coverageActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {ContribPageActionCreators} from "./ContribPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {responsibilitiesActionCreators} from "../responsibilitiesActionCreators";

class DownloadCoveragePageActionCreators extends ContribPageActionCreators<DownloadCoveragePageLocationProps> {
    parent = responsibilityOverviewPageActionCreators;

    createBreadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: `Download coverage for ${state.responsibilities.currentResponsibility.scenario.description}`,
            urlFragment: `coverage/${state.responsibilities.currentResponsibility.scenario.id}/`
        }
    }

    loadData(params: DownloadCoveragePageLocationProps): (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => void {
        return async (dispatch: Dispatch<ContribAppState>) => {
            dispatch(responsibilitiesActionCreators.setCurrentResponsibility(params.scenarioId));
            await dispatch(coverageActionCreators.getOneTimeToken());
            await dispatch(coverageActionCreators.getDataSets());
        }
    }

}

export const downloadCoveragePageActionCreators = new DownloadCoveragePageActionCreators();