import {Dispatch} from "redux";

import {responsibilityOverviewPageActionCreators} from "./responsibilityOverviewPageActionCreators";
import {UploadBurdenEstimatesPageLocationProps} from "../../components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";
import {responsibilitiesActionCreators} from "../responsibilitiesActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {ContribPageActionCreators} from "./ContribPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";

class UploadBurdenEstimatesPageActionCreators extends ContribPageActionCreators<UploadBurdenEstimatesPageLocationProps> {
    parent = responsibilityOverviewPageActionCreators;

    createBreadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: `Upload burden estimates for ${state.responsibilities.currentResponsibility.scenario.description}`,
            urlFragment: `burdens/${state.responsibilities.currentResponsibility.scenario.id}`
        }
    }

    loadData(params: UploadBurdenEstimatesPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>) => {
            dispatch(responsibilitiesActionCreators.setCurrentResponsibility(params.scenarioId));
        }
    }
}

export const uploadBurdenEstimatesPageActionCreators = new UploadBurdenEstimatesPageActionCreators();