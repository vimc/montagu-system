import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {TouchstoneListPageComponent} from "../../components/Touchstones/List/TouchstoneListPage";
import {adminTouchstoneActionCreators} from "../adminTouchstoneActionCreators";

export const touchstoneListPageActionCreators = {

    onLoad() {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(this.loadData());
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(TouchstoneListPageComponent.breadcrumb()));
        }
    },

    loadData() {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(adminTouchstoneActionCreators.getAllTouchstones());
        }
    }
};
