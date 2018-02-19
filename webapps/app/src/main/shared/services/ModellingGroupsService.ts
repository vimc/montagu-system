import { LocalService } from "../../shared/services/LocalService";

export class ModellingGroupsService extends LocalService {

    stateSegment = "groups";

    getAllGroups() {
        return this.get("/modelling-groups/");
    }
}
