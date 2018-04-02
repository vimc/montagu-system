import { Dispatch } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {ChooseGroupPageComponent} from "../../components/ChooseGroup/ChooseGroupPage";
import {breadcrumbsActions} from "../../../shared/actions/breadcrumbsActions";

export const chooseGroupPageActionCreators = {

    onLoad() {
        return (dispatch: Dispatch<any>) => {
            dispatch(modellingGroupsActionCreators.getUserGroups());
            dispatch(breadcrumbsActions.createBreadcrumbs(ChooseGroupPageComponent.breadcrumb()));
        }
    }

};