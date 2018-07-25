import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {mainMenuPageActionCreators, MainMenuPageActionCreators} from "./MainMenuPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {SetPasswordPageComponent} from "../../components/Users/Account/SetPasswordPage";
import {ChangeSetPasswordErrors, ChangeSetPasswordToken, UsersTypes} from "../../actionTypes/UsersTypes";

export class SetPasswordPageActionCreators extends AdminPageActionCreators<{}>{

    parent: MainMenuPageActionCreators = mainMenuPageActionCreators;

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: SetPasswordPageComponent.title,
            urlFragment: "set-password/"
        }
    }

    loadData() {
        return async (dispatch: Dispatch<AdminAppState>) => {}
    }

    saveToken(token: string) {
        return (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            return dispatch({
                type: UsersTypes.CHANGE_SET_PASSWORD_TOKEN,
                token: token
            } as ChangeSetPasswordToken);
        }
    }
}

export const setPasswordPageActionCreators = new SetPasswordPageActionCreators();
