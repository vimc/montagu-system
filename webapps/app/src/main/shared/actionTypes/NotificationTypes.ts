export type Severity = "error" | "info"

export enum NotificationTypeKeys {
    NOTIFY = "NOTIFY",
    CLEAR = "CLEAR"
}

export interface AddNotification {
    type: NotificationTypeKeys.NOTIFY;
    message: string;
    severity: Severity;
}

export interface ClearNotifications {
    type: NotificationTypeKeys.CLEAR;
    severity: Severity;
}

export type NotificationActionTypes =
    | AddNotification
    | ClearNotifications;