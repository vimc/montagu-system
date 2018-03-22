import {Breadcrumb} from "../models/Breadcrumb";

export enum BreadcrumbsTypeKeys {
    BREADCRUMBS_RECEIVED = "BREADCRUMBS_RECEIVED",
}

export interface BreadcrumbsReceived {
    type: BreadcrumbsTypeKeys.BREADCRUMBS_RECEIVED;
    data: Breadcrumb[];
}

export type BreadcrumbsActionsTypes =
    | BreadcrumbsReceived; 