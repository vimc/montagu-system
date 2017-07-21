import { alt } from "../../shared/alt";
import { FetchActions } from "../../shared/actions/FetchActions";
import {Version} from "../../shared/models/Report";

interface Actions {
    setCurrentReport(name: string): string;
    beginFetchReports() : boolean;
    updateReports(reports: string[]) : string[];

    beginFetchVersions() : boolean;
    updateVersions(versions: string[]) : string[];
    setCurrentVersion(version: string) : string;
    beginFetchVersionDetails(): boolean;
    updateVersionDetails(versionDetails: Version): Version;

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

    setCurrentVersion(version: string){
        return version;
    }

    beginFetchVersionDetails(){
        return true;
    }

    updateVersionDetails(versionDetails: Version){
        return versionDetails;
    }

}

export const reportActions =
    alt.createActions<Actions>(ReportActions);
