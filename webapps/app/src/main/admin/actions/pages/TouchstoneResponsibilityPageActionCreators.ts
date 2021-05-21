import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {touchstonesActionCreators} from "../../../shared/actions/touchstoneActionCreators";
import {adminTouchstoneActionCreators} from "../adminTouchstoneActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {touchstoneDetailsPageActionCreators} from "./touchstoneDetailsPageActionCreators";
import {TouchstoneVersionPageLocationProps} from "../../components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";

class TouchstoneResponsibilitiesPageActionCreators
    extends AdminPageActionCreators<TouchstoneVersionPageLocationProps> {

    parent = touchstoneDetailsPageActionCreators;

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: `Responsibility Sets in ${state.touchstones.currentTouchstoneVersion.id}`,
            urlFragment: `${state.touchstones.currentTouchstoneVersion.id}/responsibilities/`
        };
    }

    loadData(params?: TouchstoneVersionPageLocationProps): (dispatch: Dispatch<AdminAppState>,
                                                          getState: () => AdminAppState) => void {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const touchstones = getState().touchstones.touchstones;
            dispatch(touchstonesActionCreators.setCurrentTouchstoneVersion(params.touchstoneVersionId, touchstones));
            dispatch(adminTouchstoneActionCreators.getResponsibilitiesForTouchstoneVersion(params.touchstoneVersionId));
            dispatch(adminTouchstoneActionCreators.getResponsibilityCommentsForTouchstoneVersion(params.touchstoneVersionId));
        }
    }

}

export const touchstoneResponsibilitiesPageActionCreators
    = new TouchstoneResponsibilitiesPageActionCreators();
