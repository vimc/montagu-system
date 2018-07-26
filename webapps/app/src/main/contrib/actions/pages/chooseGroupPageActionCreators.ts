import {Dispatch} from "redux";

import {modellingGroupsActionCreators} from "../modellingGroupsActionCreators";
import {ChooseGroupPageComponent} from "../../components/ChooseGroup/ChooseGroupPage";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {ContribPageActionCreators} from "./ContribPageActionCreators";


class ChooseGroupPageActionCreators extends ContribPageActionCreators<{}> {

    parent: null;

    createBreadcrumb() {
        return {
            name: ChooseGroupPageComponent.title,
            urlFragment: "/"
        }
    }

    loadData() {
        return async (dispatch: Dispatch<ContribAppState>) => {
            await dispatch(modellingGroupsActionCreators.getUserGroups());
        }
    }
}


export const chooseGroupPageActionCreators = new ChooseGroupPageActionCreators();
