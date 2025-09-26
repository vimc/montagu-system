import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {adminTouchstoneActionCreators} from "../adminTouchstoneActionCreators";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {mainMenuPageActionCreators} from "./MainMenuPageActionCreators";

export class TouchstoneListPageActionCreators extends AdminPageActionCreators<{}> {

    parent = mainMenuPageActionCreators;

    title() {
        return "Touchstones"
    }

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: this.title(),
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
