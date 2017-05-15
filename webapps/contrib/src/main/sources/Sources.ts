import { DiseaseSource } from "./DiseaseSource";
import { TouchstoneSource } from "./TouchstoneSource";
import { ResponsibilitySource } from "./ResponsibilitySource";

export const sources = {
    diseases: new DiseaseSource(),
    touchstones: new TouchstoneSource(),
    responsibilities: new ResponsibilitySource()
};
