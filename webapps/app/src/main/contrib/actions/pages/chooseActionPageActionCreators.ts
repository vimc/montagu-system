import { Dispatch, Action } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";
import {ChooseActionPageComponent, ChooseActionPageLocationProps} from "../../components/ChooseAction/ChooseActionPage";
import {touchstonesActionCreators} from "../touchstonesActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";

export const chooseActionPageActionCreators = {

    onLoad(props: ChooseActionPageLocationProps) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
            await dispatch(modellingGroupsActionCreators.getUserGroups());
            dispatch(modellingGroupsActionCreators.setCurrentGroup(props.groupId));
            dispatch(touchstonesActionCreators.getTouchstonesByGroupId(props.groupId));
            dispatch(breadcrumbsActions.createBreadcrumbs(ChooseActionPageComponent.breadcrumb(getState())));
        }
    }

};