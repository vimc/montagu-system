import {Dispatch} from "redux";
import {AddNotification, ClearNotifications, NotificationTypeKeys, Severity} from "../actionTypes/NotificationTypes";
import {CommonState} from "../reducers/CommonState";

export const notificationActionCreators = {
    notify(message: string, severity: Severity) {
        return (dispatch: Dispatch<CommonState>, getState: () => CommonState) => {
            dispatch({
                type: NotificationTypeKeys.NOTIFY,
                message: message,
                severity: severity
            } as AddNotification);
        }
    },

    clear(severity: Severity) {
        return (dispatch: Dispatch<CommonState>, getState: () => CommonState) => {
            dispatch({
                type: NotificationTypeKeys.CLEAR,
                severity: severity
            } as ClearNotifications);
        }
    },
};
