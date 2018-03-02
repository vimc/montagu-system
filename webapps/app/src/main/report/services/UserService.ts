import {AbstractLocalService} from "../../shared/services/AbstractLocalService";

export class UserService extends AbstractLocalService {

    getReportReaders(reportName: string) {
        return this.setOptions({cacheKey: UserCacheKeysEnum.reportReaders})
            .get(`/users/report-readers/${reportName}/`);
    }

}

export enum UserCacheKeysEnum {
    reportReaders = "reportReaders"
}