import {AdminAppState} from "../../reducers/adminAppReducers";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {MainMenuNew} from "../../components/MainMenu/MainMenuNew";

export class MainMenuPageActionCreators extends AdminPageActionCreators<{}> {

    parent: null;

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
