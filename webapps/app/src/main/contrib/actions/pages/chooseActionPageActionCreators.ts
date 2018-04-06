import { Dispatch, Action } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";
import {ChooseActionPageComponent, ChooseActionPageLocationProps} from "../../components/ChooseAction/ChooseActionPage";
import {touchstonesActionCreators} from "../touchstonesActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {chooseGroupPageActionCreators} from "./chooseGroupPageActionCreators";

export const chooseActionPageActionCreators = {

    onLoad(props: ChooseActionPageLocationProps) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActions.createBreadcrumbs(ChooseActionPageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: ChooseActionPageLocationProps) {
        return async (dispatch: Dispatch<any>, getState: () => ContribAppState) => {
            await dispatch(chooseGroupPageActionCreators.loadData());
            dispatch(modellingGroupsActionCreators.setCurrentGroup(props.groupId));
            await dispatch(touchstonesActionCreators.getTouchstonesByGroupId(props.groupId));
        }
    }

};