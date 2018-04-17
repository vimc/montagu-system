import {AbstractLocalService} from "../../shared/services/AbstractLocalService";

export class UserService extends AbstractLocalService {

    signConfidentiality() {
        return this.post("/users/agree-confidentiality/");
    }

}
