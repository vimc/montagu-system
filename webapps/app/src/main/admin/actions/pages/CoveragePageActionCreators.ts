import {AdminAppState} from "../../reducers/adminAppReducers";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {touchstoneVersionPageActionCreators} from "./touchstoneVersionPageActionCreators";
import {TouchstoneVersionPageLocationProps} from "../../components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";

export class CoveragePageActionCreators extends AdminPageActionCreators<{}> {

    parent = touchstoneVersionPageActionCreators;

    title(state: AdminAppState): string {
        if (state.touchstones.currentTouchstoneVersion) {
            return `Upload coverage for touchstone ${state.touchstones.currentTouchstoneVersion.id}`
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
        return async () => {
            await new Promise(resolve => setTimeout(resolve));
        }
    }
}

export const coveragePageActionCreators = new CoveragePageActionCreators();
