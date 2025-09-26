import {Dispatch} from "redux";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {touchstoneVersionPageActionCreators} from "./touchstoneVersionPageActionCreators";
import {scenarioActionCreators} from "../scenarioActionCreators";
import {TouchstoneVersionPageLocationProps} from "../../components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {diseasesActionCreators} from "../../../shared/actions/diseasesActionCreators";

export class ScenarioPageActionCreators extends AdminPageActionCreators<{}> {

    parent = touchstoneVersionPageActionCreators;

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

    loadData(params: TouchstoneVersionPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            await dispatch(diseasesActionCreators.getAllDiseases());
            await dispatch(scenarioActionCreators.getScenariosForTouchstoneVersion(params.touchstoneVersionId));
        }
    }
}

export const scenarioPageActionCreators = new ScenarioPageActionCreators();