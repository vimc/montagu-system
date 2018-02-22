import { AbstractLocalService } from "./AbstractLocalService";

export class ModellingGroupsService extends AbstractLocalService {

    getAllGroups() {
        return this.setOptions({cache: 'groups'})
            .get("/modelling-groups/");
    }
}
