import {AbstractPageActionCreators} from "./AbstractPageActionCreators";
import {CommonState} from "../reducers/CommonState";
import {PageBreadcrumb} from "../components/PageWithHeader/PageProperties";
import {authActionCreators} from "./authActionCreators";
import {Dispatch} from "redux";

export class LoginPageActionCreators extends AbstractPageActionCreators<CommonState, {}> {

    parent: AbstractPageActionCreators<CommonState, {}> = null;

    title () {
        return "Logging in"
    }

    createBreadcrumb(state?: CommonState): PageBreadcrumb {
        return {
            name: this.title(),
            urlFragment: "/",
            parent: null
        }
    }

    loadData() {
        return async (dispatch: Dispatch<CommonState>) => {
            await dispatch(authActionCreators.loadAuthenticatedUser());
        }
    }
}

export const loginPageActionCreators = new LoginPageActionCreators();
