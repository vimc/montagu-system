import { Dispatch, Action } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";
import {ChooseActionPageComponent} from "../../components/ChooseAction/ChooseActionPage";
import {touchstonesActionCreators} from "../touchstonesActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {
    ResponsibilityOverviewPageLocationProps,
} from "../../components/Responsibilities/Overview/ResponsibilityOverviewPage";
import {responsibilitiesActionCreators} from "../responsibilitiesActionCreators";

export const responsibilityOverviewPageActionCreators = {

    onLoad(props: ResponsibilityOverviewPageLocationProps) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
            await dispatch(modellingGroupsActionCreators.getUserGroups());
            dispatch(modellingGroupsActionCreators.setCurrentGroup(props.groupId));
            await dispatch(touchstonesActionCreators.getTouchstonesByGroupId(props.groupId));
            dispatch(touchstonesActionCreators.setCurrentTouchstone(props.touchstoneId));
            dispatch(breadcrumbsActions.createBreadcrumbs(ChooseActionPageComponent.breadcrumb(getState())));
            dispatch(responsibilitiesActionCreators.getResponsibilitySet(
                getState().groups.currentUserGroup,
                getState().touchstones.currentTouchstone
            ));
        }
    }

};