import { LocalService } from "../../shared/services/LocalService";

export class ModellingGroupsService extends LocalService {
    getGroups() {
        return this.get("/modelling-groups/");
    }
}
