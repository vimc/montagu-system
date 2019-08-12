import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {modellingGroupsListPageActionCreators} from "./ModellingGroupsListPageActionCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {Dispatch} from "redux";
import {modellingGroupsActionCreators} from "../modellingGroupsActionCreators";

class ModelMetaPageActionCreators extends AdminPageActionCreators<{}> {

    parent = modellingGroupsListPageActionCreators;

    title(): string {
        return "Model Metadata"
    }

    createBreadcrumb(state: AdminAppState): PageBreadcrumb {
        return {
            name: this.title(),
            urlFragment: "models/"
        }
    }

    loadData() {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(modellingGroupsActionCreators.getAllModelsAndExpectations());
        }
    }
}

export const modelMetaPageActionCreators = new ModelMetaPageActionCreators();