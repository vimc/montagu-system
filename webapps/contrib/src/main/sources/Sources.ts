import { DiseaseSource } from "./DiseaseSource";
import { TouchstoneSource } from "./TouchstoneSource";
import { ResponsibilitySource } from "./ResponsibilitySource";
import { CoverageSetSource } from "./CoverageSetSource";

export const sources = {
    diseases: new DiseaseSource(),
    touchstones: new TouchstoneSource(),
    responsibilities: new ResponsibilitySource(),
    coverageSets: new CoverageSetSource()
};
