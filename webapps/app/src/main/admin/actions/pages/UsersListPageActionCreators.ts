import {Dispatch} from "redux";
import {usersActionCreators} from "../usersActionCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {mainMenuPageActionCreators, MainMenuPageActionCreators} from "./MainMenuPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {UsersListPageComponent} from "../../components/Users/List/UsersListPage";

export class UsersListPageActionCreators extends AdminPageActionCreators<{}>{

    parent: MainMenuPageActionCreators = mainMenuPageActionCreators;

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: UsersListPageComponent.title,
            urlFragment: "users/"
        }
    }

    loadData() {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(usersActionCreators.getAllUsers());
        }
    }

}

export const usersListPageActionCreators = new UsersListPageActionCreators();
