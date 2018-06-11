import { Dispatch } from "redux";

import { usersActionCreators } from "../usersActionCreators";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {
    UserDetailsPageComponent,
    UserDetailsPageLocationProps
} from "../../components/Users/SingleUser/UserDetailsPage";
import {usersListPageActionCreators} from "./usersListPageActionCreators";

export const userDetailsPageActionCreators = {

    onLoad(params: UserDetailsPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            await dispatch(this.loadData(params));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(UserDetailsPageComponent.breadcrumb(getState())));
        }
    },

    loadData(params: UserDetailsPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(usersListPageActionCreators.loadData());
            dispatch(usersActionCreators.setCurrentUser(params.username));
            dispatch(usersActionCreators.getAllUserRoles());
        }
    }
};