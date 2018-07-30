import {AdminAppState} from "../../reducers/adminAppReducers";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {MainMenuNew} from "../../components/MainMenu/MainMenuNew";

export class MainMenuPageActionCreators extends AdminPageActionCreators<{}> {

    parent: AdminPageActionCreators<{}> = null;

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: MainMenuNew.title,
            urlFragment: "/",
            parent: null
        }
    }

    loadData() {
        return () => {}
    }
}

export const mainMenuPageActionCreators = new MainMenuPageActionCreators();
