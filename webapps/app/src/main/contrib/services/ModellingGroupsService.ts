import { LocalService } from "../../shared/services/LocalService";

export class ModellingGroupsService extends LocalService {
    getAllGroups() {
        return this.get("/modelling-groups/");
    }
}
