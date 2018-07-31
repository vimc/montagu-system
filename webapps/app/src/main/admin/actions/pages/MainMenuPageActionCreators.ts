import {AdminAppState} from "../../reducers/adminAppReducers";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {MainMenu} from "../../components/MainMenu/MainMenu";

export class MainMenuPageActionCreators extends AdminPageActionCreators<{}> {

    parent: AdminPageActionCreators<{}> = null;

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: MainMenu.title,
            urlFragment: "/",
            parent: null
        }
    }

    loadData() {
        return () => {}
    }
}

export const mainMenuPageActionCreators = new MainMenuPageActionCreators();
