import { Dispatch } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {ChooseGroupPageComponent} from "../../components/ChooseGroup/ChooseGroupPage";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";

export const chooseGroupPageActionCreators = {

    onLoad() {
        return async (dispatch: Dispatch<ContribAppState>) => {
            await dispatch(this.loadData());
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(ChooseGroupPageComponent.breadcrumb()));
        }
    },

    loadData() {
        return async (dispatch: Dispatch<ContribAppState>) => {
            await dispatch(modellingGroupsActionCreators.getUserGroups());
        }
    }

};