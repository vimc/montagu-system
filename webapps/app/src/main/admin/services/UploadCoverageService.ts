import { AbstractLocalService } from "../../shared/services/AbstractLocalService";
import FormData = require("form-data");

export class UploadCoverageService extends AbstractLocalService {
    uploadCoverage(touchstoneId: string, data: FormData) {
        return this.setOptions({notificationOnError: false})
            .post(`/touchstones/${touchstoneId}/coverage/`, data);
    }
}
