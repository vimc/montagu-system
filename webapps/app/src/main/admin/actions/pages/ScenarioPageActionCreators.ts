import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {TouchstoneDetailsPageLocationProps} from "../../components/Touchstones/Details/TouchstoneDetailsPage";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {touchstoneDetailsPageActionCreators} from "./touchstoneDetailsPageActionCreators";

export class ScenarioPageActionCreators extends AdminPageActionCreators<{}> {

    parent = touchstoneDetailsPageActionCreators;

    title(state: AdminAppState): string {
        if (state.touchstones.currentTouchstoneVersion) {
            return `Scenarios in ${state.touchstones.currentTouchstoneVersion.description}`
        } else {
            return "";
        }
    }

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: "Scenarios",
            urlFragment: `scenarios/`
        };
    }

    loadData(params: TouchstoneDetailsPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
        }
    }
}

export const scenarioPageActionCreators = new ScenarioPageActionCreators();