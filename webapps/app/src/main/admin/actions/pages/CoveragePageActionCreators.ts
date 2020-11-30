import {AdminAppState} from "../../reducers/adminAppReducers";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {touchstoneVersionPageActionCreators} from "./touchstoneVersionPageActionCreators";
import {TouchstoneVersionPageLocationProps} from "../../components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {Dispatch} from "redux";
import {touchstonesActionCreators} from "../../../shared/actions/touchstoneActionCreators";
import {coverageActionCreators} from "../coverageActionCreators";

export class CoveragePageActionCreators extends AdminPageActionCreators<{}> {

    parent = touchstoneVersionPageActionCreators;

    title(state: AdminAppState): string {
        if (state.touchstones.currentTouchstoneVersion) {
            return `Upload coverage for touchstone version ${state.touchstones.currentTouchstoneVersion.id}`
        } else {
            return "";
        }
    }

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: "Coverage",
            urlFragment: `coverage/`
        };
    }

    loadData(params: TouchstoneVersionPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(coverageActionCreators.getCoverageMetadata(
                params.touchstoneVersionId
            ));
        }
    }
}

export const coveragePageActionCreators = new CoveragePageActionCreators();
