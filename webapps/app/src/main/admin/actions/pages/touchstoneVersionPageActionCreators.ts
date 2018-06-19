import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {
    TouchstoneVersionDetailsPageComponent,
    TouchstoneVersionPageLocationProps
} from "../../components/Touchstones/SingleTouchstoneVersion/TouchstoneDetailsPage";
import {touchstoneListPageActionCreators} from "./touchstoneListPageActionCreators";
import {touchstonesActionCreators} from "../../../shared/actions/touchstoneActionCreators";
import {adminTouchstoneActionCreators} from "../adminTouchstoneActionCreators";

export const touchstoneVersionPageActionCreators = {
    onLoad(params: TouchstoneVersionPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            await dispatch(this.loadData(params));
            dispatch(breadcrumbsActionCreators
                .createBreadcrumbs(TouchstoneVersionDetailsPageComponent.breadcrumb(getState())));
        }
    },

    loadData(params: TouchstoneVersionPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            await dispatch(touchstoneListPageActionCreators.loadData());
            const touchstones = getState().touchstones.touchstones;
            dispatch(touchstonesActionCreators.setCurrentTouchstoneVersion(params.touchstoneVersionId, touchstones));
            dispatch(adminTouchstoneActionCreators.getResponsibilitiesForTouchstoneVersion(params.touchstoneVersionId))
        }
    }
};
