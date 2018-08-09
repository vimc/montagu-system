import {Dispatch} from "redux";

import {ContribAppState} from "../../reducers/contribAppReducers";
import {responsibilityOverviewPageActionCreators} from "./responsibilityOverviewPageActionCreators";
import {
    ModelRunParametersPageComponent,
    ModelRunParametersPageLocationProps
} from "../../components/Responsibilities/ModelRunParameters/ModelRunParametersPage";
import {runParametersActionCreators} from "../runParametersActionCreators";
import {ContribPageActionCreators} from "./ContribPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";

export const modelRunParametersPageName = "Upload parameters";

export class ModelRunParametersPageActionCreators extends ContribPageActionCreators<ModelRunParametersPageLocationProps> {

    parent = responsibilityOverviewPageActionCreators;

    createBreadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: modelRunParametersPageName,
            urlFragment: "parameters/"
        }
    }

    loadData(params: ModelRunParametersPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>) => {
            await dispatch(runParametersActionCreators.getParameterSets(params.groupId, params.touchstoneId));
        }
    }

}

export const modelRunParametersPageActionCreators = new ModelRunParametersPageActionCreators();