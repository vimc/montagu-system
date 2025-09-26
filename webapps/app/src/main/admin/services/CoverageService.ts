import { AbstractLocalService } from "../../shared/services/AbstractLocalService";
import FormData = require("form-data");

export class CoverageService extends AbstractLocalService {
    uploadCoverage(touchstoneId: string, data: FormData) {
        return this.setOptions({notificationOnError: false})
            .post(`/touchstones/${touchstoneId}/coverage/`, data);
    }

    fetchCoverageMetadata(touchstoneId: string) {
        return this.setOptions({notificationOnError: false})
            .get(`/touchstones/${touchstoneId}/coverage/meta/`);
    }
}
