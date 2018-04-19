import {AbstractLocalService} from "../../shared/services/AbstractLocalService";

export class UserService extends AbstractLocalService {

    signConfidentiality() {
        return this.post("/users/rfp/agree-confidentiality/");
    }

    getConfidentiality() {
        return this.setOptions({cacheKey: UserCacheKeysEnum.signedConfidentiality})
            .get("/users/rfp/agree-confidentiality/");
    }
}

export enum UserCacheKeysEnum {
    signedConfidentiality = "signedConfidentiality"
}
