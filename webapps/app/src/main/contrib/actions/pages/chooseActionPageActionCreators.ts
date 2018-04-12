import { Dispatch } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";
import {ChooseActionPageComponent, ChooseActionPageLocationProps} from "../../components/ChooseAction/ChooseActionPage";
import {touchstonesActionCreators} from "../touchstonesActionCreators";
import {chooseGroupPageActionCreators} from "./chooseGroupPageActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";

export const chooseActionPageActionCreators = {

    onLoad(props: ChooseActionPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            await dispatch(this.loadData(props));
            dispatch(breadcrumbsActions.createBreadcrumbs(ChooseActionPageComponent.breadcrumb(getState())));
        }
    },

    loadData(props: ChooseActionPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>) => {
            await dispatch(chooseGroupPageActionCreators.loadData());
            dispatch(modellingGroupsActionCreators.setCurrentGroup(props.groupId));
            await dispatch(touchstonesActionCreators.getTouchstonesByGroupId(props.groupId));
        }
    }

};