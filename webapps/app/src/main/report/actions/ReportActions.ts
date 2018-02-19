import { alt } from "../../shared/alt";
import { FetchActions } from "../../shared/actions/FetchActions";
import {Version} from "../../shared/models/reports/Report";
import { Report } from "../../shared/models/Generated";

interface Actions {
    setCurrentReport(name: string): string;
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
