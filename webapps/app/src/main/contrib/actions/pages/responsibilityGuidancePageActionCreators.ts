import {Dispatch} from "redux";

import {contribTouchstonesActionCreators} from "../contribTouchstonesActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {ResponsibilityOverviewPageLocationProps} from "../../components/Responsibilities/Overview/ResponsibilityOverviewPage";
import {responsibilitiesActionCreators} from "../responsibilitiesActionCreators";
import {diseasesActionCreators} from "../../../shared/actions/diseasesActionCreators";
import {chooseGroupPageActionCreators} from "./chooseGroupPageActionCreators";
import {ContribPageActionCreators} from "./ContribPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {ResponsibilityGuidancePageLocationProps} from "../../components/Responsibilities/Guidance/ResponsibilityGuidancePage"
import {ChooseGroupPageComponent} from "../../components/ChooseGroup/ChooseGroupPage";
import {modellingGroupsActionCreators} from "../modellingGroupsActionCreators";
import {responsibilityOverviewPageActionCreators} from "../pages/responsibilityOverviewPageActionCreators";


abstract class ResponsibilityGuidancePageActionCreators extends ContribPageActionCreators<ResponsibilityGuidancePageLocationProps> {

    //parent = responsibilityOverviewPageActionCreators;
    parent = chooseGroupPageActionCreators;


    loadData(params: ResponsibilityGuidancePageLocationProps) {

        return async (dispatch: Dispatch<ContribAppState>, _: () => ContribAppState) => {
            await dispatch(contribTouchstonesActionCreators.getAllTouchstones());
            await dispatch(contribTouchstonesActionCreators.setCurrentTouchstoneVersion(params.touchstoneId));
        }
    }

}

class ResponsibilityGuidanceModelInputsPageActionCreators extends ResponsibilityGuidancePageActionCreators {
    createBreadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: `Model Inputs Guidance for ${state.touchstones.currentTouchstoneVersion.description}`,
            urlFragment: `help/model-inputs/${state.touchstones.currentTouchstoneVersion.id}`
        }
    }
}

export const responsibilityGuidanceModelInputsPageActionCreators = new ResponsibilityGuidanceModelInputsPageActionCreators();