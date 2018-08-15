import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {touchstonesActionCreators} from "../../../shared/actions/touchstoneActionCreators";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {TouchstoneVersionPageLocationProps} from "../../components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {touchstoneDetailsPageActionCreators} from "./touchstoneDetailsPageActionCreators";

export class TouchstoneVersionPageActionCreators extends AdminPageActionCreators<{}> {

    parent = touchstoneDetailsPageActionCreators;

    title(state: AdminAppState): string {
        return state.touchstones.currentTouchstoneVersion ? state.touchstones.currentTouchstoneVersion.description : ""
    }

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: state.touchstones.currentTouchstoneVersion.id,
            urlFragment: `${state.touchstones.currentTouchstoneVersion.id}/`
        };
    }

    loadData(params: TouchstoneVersionPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            dispatch(touchstonesActionCreators.setCurrentTouchstoneVersion(
                params.touchstoneVersionId,
                getState().touchstones.touchstones
            ));
        }
    }
}

export const touchstoneVersionPageActionCreators = new TouchstoneVersionPageActionCreators();