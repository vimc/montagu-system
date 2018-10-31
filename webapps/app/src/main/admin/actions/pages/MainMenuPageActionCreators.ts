import {AdminAppState} from "../../reducers/adminAppReducers";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";

export class MainMenuPageActionCreators extends AdminPageActionCreators<{}> {

    parent: AdminPageActionCreators<{}> = null;

    title () {
        return "Main menu"
    }

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: this.title(),
            urlFragment: "/",
            parent: null
        }
    }

    loadData() {
        return () => {}
    }
}

export const mainMenuPageActionCreators = new MainMenuPageActionCreators();
