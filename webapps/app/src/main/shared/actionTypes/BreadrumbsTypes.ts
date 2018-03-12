import { BreadcrumbsState } from "../reducers/breadcrumbsReducer";

export enum BreadcrumbsTypeKeys {
    BREADCRUMBS_RECEIVED = "BREADCRUMBS_RECEIVED",
}

export interface BreadcrumbsReceived {
    type: BreadcrumbsTypeKeys.BREADCRUMBS_RECEIVED;
    data: BreadcrumbsState;
}

export type BreadcrumbsActionsTypes =
    | BreadcrumbsReceived; 