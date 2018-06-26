import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {touchstonesActionCreators} from "../../../shared/actions/touchstoneActionCreators";
import {adminTouchstoneActionCreators} from "../adminTouchstoneActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {touchstoneListPageActionCreators} from "./TouchstoneListPageActionCreators";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {TouchstoneVersionPageLocationProps} from "../../components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {touchstoneDetailsPageActionCreators} from "./touchstoneDetailsPageActionCreators";

class TouchstoneVersionPageActionCreators
    extends AdminPageActionCreators<TouchstoneVersionPageLocationProps> {

    parent = touchstoneDetailsPageActionCreators;

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: state.touchstones.currentTouchstoneVersion.id,
            urlFragment: `${state.touchstones.currentTouchstoneVersion.id}/`
        };
    }

    loadData(params?: TouchstoneVersionPageLocationProps): (dispatch: Dispatch<AdminAppState>,
                                                            getState: () => AdminAppState) => void {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const touchstones = getState().touchstones.touchstones;
            dispatch(touchstonesActionCreators.setCurrentTouchstoneVersion(params.touchstoneVersionId, touchstones));
            dispatch(adminTouchstoneActionCreators.getResponsibilitiesForTouchstoneVersion(params.touchstoneVersionId))
        }
    }

}

export const touchstoneVersionPageActionCreators
    = new TouchstoneVersionPageActionCreators();
