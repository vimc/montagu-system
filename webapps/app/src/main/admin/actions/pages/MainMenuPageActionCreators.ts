import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {AbstractPageActionCreators} from "./AbstractPageActionCreators";
import {unitOfTime} from "moment";
import {MainMenuNew} from "../../components/MainMenu/MainMenuNew";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";

class MainMenuPageActionCreators extends AbstractPageActionCreators<AdminAppState, {}>{

    createBreadcrumb(): PageBreadcrumb {
        return {
            name: MainMenuNew.title,
            urlFragment: "/",
            parent: null
        }
    }

    loadData(params?: {}): (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => void {
        return () => { return }
    }

}

export const mainMenuPageActionCreators = new MainMenuPageActionCreators();