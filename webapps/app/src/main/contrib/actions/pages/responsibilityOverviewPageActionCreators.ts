import {Dispatch} from "redux";

import {contribTouchstonesActionCreators} from "../contribTouchstonesActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {ResponsibilityOverviewPageLocationProps} from "../../components/Responsibilities/Overview/ResponsibilityOverviewPage";
import {responsibilitiesActionCreators} from "../responsibilitiesActionCreators";
import {diseasesActionCreators} from "../diseasesActionCreators";
import {chooseActionPageActionCreators} from "./chooseActionPageActionCreators";
import {ContribPageActionCreators} from "./ContribPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";

class ResponsibilityOverviewPageActionCreators extends ContribPageActionCreators<ResponsibilityOverviewPageLocationProps> {

    parent: ContribPageActionCreators<any> = chooseActionPageActionCreators;

    createBreadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: state.touchstones.currentTouchstoneVersion.description,
            urlFragment: `responsibilities/${state.touchstones.currentTouchstoneVersion.id}/`
        }
    }

    loadData(params: ResponsibilityOverviewPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>, _: () => ContribAppState) => {
            await dispatch(diseasesActionCreators.getAllDiseases());
            dispatch(contribTouchstonesActionCreators.setCurrentTouchstoneVersion(params.touchstoneId));
            await dispatch(responsibilitiesActionCreators.getResponsibilitySet());
        }
    }

}

export const responsibilityOverviewPageActionCreators = new ResponsibilityOverviewPageActionCreators();