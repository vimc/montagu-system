import { Dispatch, Action } from "redux";

import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";
import {touchstonesActionCreators} from "../touchstonesActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {
    ResponsibilityOverviewPageComponent,
    ResponsibilityOverviewPageLocationProps,
} from "../../components/Responsibilities/Overview/ResponsibilityOverviewPage";
import {responsibilitiesActionCreators} from "../responsibilitiesActionCreators";
import {diseasesActionCreators} from "../diseasesActionCreators";
import {chooseActionPageActionCreators} from "./chooseActionPageActionCreators";

export const responsibilityOverviewPageActionCreators = {

    onLoad(props: ResponsibilityOverviewPageLocationProps) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActions.createBreadcrumbs(ResponsibilityOverviewPageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: ResponsibilityOverviewPageLocationProps) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
            await dispatch(chooseActionPageActionCreators.loadData(props));
            await dispatch(diseasesActionCreators.getAllDiseases());
            dispatch(touchstonesActionCreators.setCurrentTouchstone(props.touchstoneId));
            await dispatch(responsibilitiesActionCreators.getResponsibilitySet(
                getState().groups.currentUserGroup,
                getState().touchstones.currentTouchstone
            ));
        }
    }

};