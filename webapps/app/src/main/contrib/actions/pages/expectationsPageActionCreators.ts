import {Dispatch} from "redux";

import {responsibilityOverviewPageActionCreators} from "./responsibilityOverviewPageActionCreators";
import {ContribAppState} from "../../reducers/contribAppReducers";
import {
    ExpectationsPageComponent,
    ExpectationsPageLocationProps
} from "../../components/Responsibilities/Expectations/ExpectationsPage";
import {ContribPageActionCreators} from "./ContribPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";

class ExpectationsPageActionCreators extends ContribPageActionCreators<ExpectationsPageLocationProps> {

    parent = responsibilityOverviewPageActionCreators;

    createBreadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: ExpectationsPageComponent.title,
            urlFragment: `templates/`
        }
    }

    loadData(params: ExpectationsPageLocationProps) {
        return async (dispatch: Dispatch<ContribAppState>) => {
        }
    }
}

export const expectationsPageActionCreators = new ExpectationsPageActionCreators();