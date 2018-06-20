import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {TouchstoneListPageComponent} from "../../components/Touchstones/List/TouchstoneListPage";
import {adminTouchstoneActionCreators} from "../adminTouchstoneActionCreators";
import {
    TouchstoneDetailsPageComponent,
    TouchstoneDetailsPageLocationProps
} from "../../components/Touchstones/Details/TouchstoneDetailsPage";
import {touchstoneListPageActionCreators} from "./touchstoneListPageActionCreators";
import {touchstonesActionCreators} from "../../../shared/actions/touchstoneActionCreators";
import {UserDetailsPageLocationProps} from "../../components/Users/SingleUser/UserDetailsPage";

export const touchstoneDetailsPageActionCreators = {
    onLoad(params: TouchstoneDetailsPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            await dispatch(this.loadData(params));
            const breadcrumb = TouchstoneDetailsPageComponent.breadcrumb(getState());
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(breadcrumb));
        }
    },

    loadData(params: TouchstoneDetailsPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            await dispatch(touchstoneListPageActionCreators.loadData());
            dispatch(touchstonesActionCreators.setCurrentTouchstone(
                params.touchstoneId,
                getState().touchstones.touchstones
            ));
        }
    }
};
