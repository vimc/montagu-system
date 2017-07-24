import { alt } from "../../shared/alt";
import { FetchActions } from "../../shared/actions/FetchActions";

interface Actions {
    setCurrentReport(name: string): string;
    beginFetchReports() : boolean;
    updateReports(reports: string[]) : string[]
    beginFetchVersions() : boolean;
    updateVersions(versions: string[]) : string[]
}

class ReportActions extends FetchActions<string[]> implements Actions {

    setCurrentReport(name: string): string {
        return name;
    }

    beginFetchReports(): boolean {
        return true;
    }

    updateReports(data: string[]) {
        return data;
    }

    beginFetchVersions(): boolean {
        return true;
    }

    updateVersions(data: string[]) {
        return data;
    }

}

export const reportActions =
    alt.createActions<Actions>(ReportActions);
