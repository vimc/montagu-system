import { alt } from "../../shared/alt";
import { FetchActions } from "../../shared/actions/FetchActions";

interface Actions {
    beginFetchReports() : boolean;
    updateReports(reports: string[]) : string[]
}

class ReportActions extends FetchActions<string[]> implements Actions {

    beginFetchReports(): boolean {
        return true;
    }

    updateReports(data: string[]) {
        return data;
    }

}

export const reportActions =
    alt.createActions<Actions>(ReportActions);
