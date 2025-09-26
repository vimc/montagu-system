import {Breadcrumb} from "../models/Breadcrumb";

export enum BreadcrumbsTypes {
    BREADCRUMBS_RECEIVED = "BREADCRUMBS_RECEIVED",
}

export interface BreadcrumbsReceived {
    type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED;
    data: Breadcrumb[];
}

export type BreadcrumbsAction =
    | BreadcrumbsReceived; 