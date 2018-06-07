import { Dispatch } from "redux";

import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {contribTouchstonesActionCreators} from "../contribTouchstonesActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {
    ResponsibilityOverviewPageComponent,
    ResponsibilityOverviewPageLocationProps,
} from "../../components/Responsibilities/Overview/ResponsibilityOverviewPage";
import {responsibilitiesActionCreators} from "../responsibilitiesActionCreators";
import {diseasesActionCreators} from "../diseasesActionCreators";
import {chooseActionPageActionCreators} from "./chooseActionPageActionCreators";
import {userActionCreators} from "../userActionCreators";

export const responsibilityOverviewPageActionCreators = {

    onLoad(props: ResponsibilityOverviewPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(ResponsibilityOverviewPageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: ResponsibilityOverviewPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>) => {
            await dispatch(chooseActionPageActionCreators.loadData(props));
            await dispatch(diseasesActionCreators.getAllDiseases());
            dispatch(contribTouchstonesActionCreators.setCurrentTouchstone(props.touchstoneId));
            await dispatch(responsibilitiesActionCreators.getResponsibilitySet());
        }
    }

};