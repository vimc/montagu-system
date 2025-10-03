import { AbstractLocalService } from "./AbstractLocalService";
import {TouchstoneModelExpectations} from "../models/APITypes";

export class ExpectationsService extends AbstractLocalService {

    getAllExpectations(): Promise<TouchstoneModelExpectations[]> {
        return this.setOptions({cacheKey: "expectations"})
            .get("/expectations/");
    }
}