export enum UserActionType {
    CONFIDENTIALITY_SIGNED = "CONFIDENTIALITY_SIGNED",
    CONFIDENTIALITY_RETRIEVED = "CONFIDENTIALITY_RETRIEVED"
}

export interface ConfidentialitySigned {
    type: UserActionType.CONFIDENTIALITY_SIGNED;
}

export interface ConfidentialityRetrieved {
    type: UserActionType.CONFIDENTIALITY_RETRIEVED;
    data: boolean;
}

export type UserAction =
    | ConfidentialitySigned
    | ConfidentialityRetrieved
