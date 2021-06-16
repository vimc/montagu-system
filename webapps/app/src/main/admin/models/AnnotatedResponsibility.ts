import {Responsibility, ResponsibilityComment} from "../../shared/models/Generated";

export interface AnnotatedResponsibility extends Responsibility {
    modellingGroup: string;
    comment?: ResponsibilityComment;
}