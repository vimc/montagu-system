import { Dispatch } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {ChooseGroupPageComponent} from "../../components/ChooseGroup/ChooseGroupPage";
import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";

export const chooseGroupPageActionCreators = {

    onLoad() {
        return async (dispatch: Dispatch<any>) => {
            await dispatch(this.loadData());
            dispatch(breadcrumbsActions.createBreadcrumbs(ChooseGroupPageComponent.breadcrumb()));
        }
    },

    loadData() {
        return async (dispatch: Dispatch<any>) => {
            await dispatch(modellingGroupsActionCreators.getUserGroups());
        }
    }

};