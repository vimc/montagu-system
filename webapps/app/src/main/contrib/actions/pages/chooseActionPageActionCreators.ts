import { Dispatch } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {ChooseActionPageLocationProps} from "../../components/ChooseAction/ChooseActionPage";
import {contribTouchstonesActionCreators} from "../contribTouchstonesActionCreators";
import {chooseGroupPageActionCreators} from "./chooseGroupPageActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {ContribPageActionCreators} from "./ContribPageActionCreators";


class ChooseActionPageActionCreators extends ContribPageActionCreators<ChooseActionPageLocationProps> {

    parent = chooseGroupPageActionCreators;

    createBreadcrumb(state: ContribAppState) {
        return {
            name: state.groups.currentUserGroup.description,
            urlFragment: `${state.groups.currentUserGroup.id}/`,
        }
    }

    loadData(props: ChooseActionPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>) => {
            dispatch(modellingGroupsActionCreators.setCurrentGroup(props.groupId));
            await dispatch(contribTouchstonesActionCreators.getTouchstonesByGroupId(props.groupId));
        }
    }
}


export const chooseActionPageActionCreators = new ChooseActionPageActionCreators();