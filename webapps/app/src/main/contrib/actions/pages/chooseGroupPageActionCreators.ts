import {Dispatch} from "redux";

import {modellingGroupsActionCreators} from "../modellingGroupsActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {ContribPageActionCreators} from "./ContribPageActionCreators";

class ChooseGroupPageActionCreators extends ContribPageActionCreators<{}> {

    parent: null;

    title() {
        return "Modellers' contribution portal";
    }

    createBreadcrumb() {
        return {
            name: this.title(),
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
