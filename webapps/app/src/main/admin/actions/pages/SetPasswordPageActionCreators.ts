import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {mainMenuPageActionCreators, MainMenuPageActionCreators} from "./MainMenuPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {ChangeSetPasswordToken, UsersTypes} from "../../actionTypes/UsersTypes";
import {SetPasswordPageComponent} from "../../components/Users/Account/SetPasswordPage";

export class SetPasswordPageActionCreators extends AdminPageActionCreators<{}> {

    parent: MainMenuPageActionCreators = mainMenuPageActionCreators;

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: SetPasswordPageComponent.title,
            urlFragment: "set-password/"
        }
    }

    loadData() {
        return async (dispatch: Dispatch<AdminAppState>) => {
        }
    }

    saveToken(token: string): ChangeSetPasswordToken {
        return {
            type: UsersTypes.CHANGE_SET_PASSWORD_TOKEN,
            token: token
        };
    }
}

export const setPasswordPageActionCreators = new SetPasswordPageActionCreators();
