import { AbstractLocalService } from "./AbstractLocalService";
import {TouchstoneModelExpectations} from "../models/Generated";

export class ExpectationsService extends AbstractLocalService {

    getAllExpectations(): Promise<TouchstoneModelExpectations[]> {
        return this.setOptions({cacheKey: "expectations"})
            .get("/expectations/");
    }
}