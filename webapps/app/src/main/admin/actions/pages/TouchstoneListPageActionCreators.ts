import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {TouchstoneListPageComponent} from "../../components/Touchstones/List/TouchstoneListPage";
import {adminTouchstoneActionCreators} from "../adminTouchstoneActionCreators";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {mainMenuPageActionCreators} from "./MainMenuPageActionCreators";

export class TouchstoneListPageActionCreators extends AdminPageActionCreators<{}> {

    parent = mainMenuPageActionCreators;

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: TouchstoneListPageComponent.title,
            urlFragment: "touchstones/"
        };
    }

    loadData() {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(adminTouchstoneActionCreators.getAllTouchstones());
        }
    }
}

export const touchstoneListPageActionCreators = new TouchstoneListPageActionCreators();
