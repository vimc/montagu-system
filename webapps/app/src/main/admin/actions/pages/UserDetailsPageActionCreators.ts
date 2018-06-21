import {Dispatch} from "redux";

import {usersActionCreators} from "../usersActionCreators";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {
    UserDetailsPageComponent,
    UserDetailsPageLocationProps
} from "../../components/Users/SingleUser/UserDetailsPage";
import {usersListPageActionCreators} from "./UsersListPageActionCreators";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {AbstractPageActionCreators} from "../../../shared/actions/AbstractPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";

export class UserDetailsPageActionCreators extends AdminPageActionCreators<UserDetailsPageLocationProps> {

    parent: AbstractPageActionCreators<AdminAppState, any> = usersListPageActionCreators;

    createBreadcrumb(state: AdminAppState): PageBreadcrumb {
        return {
            name: state.users.currentUser.username,
            urlFragment: `${state.users.currentUser.username}/`
        }
    }

    loadData(params: UserDetailsPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {

            dispatch(usersActionCreators.setCurrentUser(params.username));
            if (getState().auth.permissions.indexOf("*/roles.read") > -1) {
                dispatch(usersActionCreators.getGlobalRoles())
            }
        }
    }
}

export const userDetailsPageActionCreators = new UserDetailsPageActionCreators();