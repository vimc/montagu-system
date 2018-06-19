import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {
    TouchstoneVersionDetailsPageComponent,
    TouchstoneVersionPageLocationProps
} from "../../components/Touchstones/SingleTouchstoneVersion/TouchstoneDetailsPage";
import {touchstoneListPageActionCreators} from "./touchstoneListPageActionCreators";
import {touchstonesActionCreators} from "../../../shared/actions/touchstoneActionCreators";
import {adminTouchstoneActionCreators} from "../adminTouchstoneActionCreators";
import {AbstractPageActionCreators} from "./AbstractPageActionCreators";

class TouchstoneVersionPageActionCreators
    extends AbstractPageActionCreators<AdminAppState, TouchstoneVersionPageLocationProps> {

    constructor(){
        super(TouchstoneVersionDetailsPageComponent.breadcrumb)
    }

    loadData(params?: TouchstoneVersionPageLocationProps): (dispatch: Dispatch<AdminAppState>,
                                                            getState: () => AdminAppState) => void {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            await dispatch(touchstoneListPageActionCreators.loadData());
            const touchstones = getState().touchstones.touchstones;
            dispatch(touchstonesActionCreators.setCurrentTouchstoneVersion(params.touchstoneVersionId, touchstones));
            dispatch(adminTouchstoneActionCreators.getResponsibilitiesForTouchstoneVersion(params.touchstoneVersionId))
        }
    }

}

export const touchstoneVersionPageActionCreators = new TouchstoneVersionPageActionCreators();
