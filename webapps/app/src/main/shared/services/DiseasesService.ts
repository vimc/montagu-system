import { AbstractLocalService } from "./AbstractLocalService";

export class DiseasesService extends AbstractLocalService {

    getAllDiseases() {
        return this.setOptions({cacheKey: DiseasesCacheKeysEnum.diseases})
            .get("/diseases/");
    }
}

export enum DiseasesCacheKeysEnum {
    diseases = "diseases",
}
