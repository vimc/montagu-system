import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {ReportPageActionCreators} from "./ReportPageActionCreators";
import {reportActionCreators} from "../reportActionCreators";
import {Dispatch} from "redux";

export class ReportListPageActionCreators extends ReportPageActionCreators<{}> {

    parent: null;

    title () {
        return "Main menu"
    }

    createBreadcrumb(state?: ReportAppState): PageBreadcrumb {
        return {
            name: this.title(),
            urlFragment: "/",
            parent: null
        }
    }

    loadData() {
        return async (dispatch: Dispatch<ReportAppState>) => {
            await dispatch(reportActionCreators.getReports())
        }
    }
}

export const reportListPageActionCreators = new ReportListPageActionCreators();
