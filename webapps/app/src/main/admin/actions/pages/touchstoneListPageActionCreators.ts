import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {TouchstoneListPageComponent} from "../../components/Touchstones/List/TouchstoneListPage";
import {adminTouchstoneActionCreators} from "../adminTouchstoneActionCreators";
import {AbstractPageActionCreators} from "./AbstractPageActionCreators";
import {unitOfTime} from "moment";
import {MainMenuNew} from "../../components/MainMenu/MainMenuNew";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";

class TouchstoneListPageActionCreators extends AbstractPageActionCreators<AdminAppState, {}>{

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: TouchstoneListPageComponent.title,
            parent: MainMenuNew.breadcrumb(),
            urlFragment: "touchstones/"
        };
    }

    loadData(params?: {}): (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => void {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(adminTouchstoneActionCreators.getAllTouchstones());
        }
    }

}

export const touchstoneListPageActionCreators = new TouchstoneListPageActionCreators();