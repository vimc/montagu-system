import {Dispatch} from "redux";

import {modellingGroupsActionCreators} from "../modellingGroupsActionCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {ModellingGroupsListPageComponent} from "../../components/ModellingGroups/List/ModellingGroupsListPage";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {AbstractPageActionCreators} from "../../../shared/actions/AbstractPageActionCreators";
import {mainMenuPageActionCreators} from "./MainMenuPageActionCreators";

export class ModellingGroupsListPageActionCreators extends AdminPageActionCreators<{}> {

    parent: AbstractPageActionCreators<AdminAppState, any> = mainMenuPageActionCreators;

    createBreadcrumb(): PageBreadcrumb {
        return {
            name: ModellingGroupsListPageComponent.title,
            urlFragment: "modelling-groups/"
        }
    }

    loadData() {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(modellingGroupsActionCreators.getAllGroups());
        }
    }
}

export const modellingGroupsListPageActionCreators = new ModellingGroupsListPageActionCreators();
