import {Responsibility, ResponsibilityComment, ResponsibilitySetWithExpectations} from "../../shared/models/Generated";

export interface AnnotatedResponsibility extends Responsibility {
    modellingGroup: string;
    comment?: ResponsibilityComment;
}

export interface AnnotatedResponsibilitySet extends ResponsibilitySetWithExpectations {
    responsibilities: AnnotatedResponsibility[];
    comment?: ResponsibilityComment;
}
