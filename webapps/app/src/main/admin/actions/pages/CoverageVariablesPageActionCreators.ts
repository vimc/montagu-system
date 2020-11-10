import {AdminAppState} from "../../reducers/adminAppReducers";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {TouchstoneVersionPageLocationProps} from "../../components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {coveragePageActionCreators} from "./CoveragePageActionCreators";

export class CoverageVariablesPageActionCreators extends AdminPageActionCreators<{}> {

    parent = coveragePageActionCreators;

    title(state: AdminAppState): string {
        return "Coverage variables";
    }

    createBreadcrumb(state?: AdminAppState): PageBreadcrumb {
        return {
            name: "Coverage variables",
            urlFragment: `coverage-variables/`
        };
    }

    loadData(params: TouchstoneVersionPageLocationProps) {
        return async () => {
            await new Promise(resolve => setTimeout(resolve));
        }
    }
}

export const coverageVariablesPageActionCreators = new CoverageVariablesPageActionCreators();
