import {AbstractLocalService} from "../../shared/services/AbstractLocalService";
import {AssociateRole} from "../../shared/models/Generated";

function reportReadersUrl(reportName: string) {
    return `/users/report-readers/${reportName}/`
}

export class UserService extends AbstractLocalService {

    getReportReaders(reportName: string) {
        const url = reportReadersUrl(reportName);
        return this.setOptions({cacheKey: UserCacheKeysEnum.reportReaders})
            .get(url);
    }

    removeReportReader(reportName: string, username: string) {

        const url = reportReadersUrl(reportName);
        this.clearCache(UserCacheKeysEnum.reportReaders, url);

        const associateRole: AssociateRole = {
            name: "reports-reader",
            action: "remove",
            scope_prefix: "report",
            scope_id: reportName
        };

        return this.post(`/users/${username}/actions/associate-role/`, JSON.stringify(associateRole));
    }

    addReportReader(reportName: string, username: string) {

        const url = reportReadersUrl(reportName);
        this.clearCache(UserCacheKeysEnum.reportReaders, url);

        const associateRole: AssociateRole = {
            name: "reports-reader",
            action: "add",
            scope_prefix: "report",
            scope_id: reportName
        };

        return this.post(`/users/${username}/actions/associate-role/`, JSON.stringify(associateRole));
    }

}

export enum UserCacheKeysEnum {
    reportReaders = "reportReaders"
}