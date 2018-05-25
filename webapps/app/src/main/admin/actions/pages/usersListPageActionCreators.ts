import { Dispatch } from "redux";

import { usersActionCreators } from "../usersActionCreators";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {UsersListPageComponent} from "../../components/Users/List/UsersListPage";

export const usersListPageActionCreators = {

    onLoad() {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(this.loadData());
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(UsersListPageComponent.breadcrumb()));
        }
    },

    loadData() {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(usersActionCreators.getAllUsers());
        }
    }
};
