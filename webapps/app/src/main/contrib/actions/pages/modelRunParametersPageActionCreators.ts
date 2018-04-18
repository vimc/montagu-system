import { Dispatch } from "redux";

import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {responsibilityOverviewPageActionCreators} from "./responsibilityOverviewPageActionCreators";
import {
    ModelRunParametersPageComponent,
    ModelRunParametersPageLocationProps
} from "../../components/Responsibilities/ModelRunParameters/ModelRunParametersPage";
import {runParametersActionCreators} from "../runParametersActionCreators";

export const modelRunParametersPageActionCreators = {
    onLoad(props: ModelRunParametersPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(ModelRunParametersPageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: ModelRunParametersPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>) => {
            await dispatch(responsibilityOverviewPageActionCreators.loadData(props));
            await dispatch(runParametersActionCreators.getParameterSets(props.groupId, props.touchstoneId));
        }
    }
};