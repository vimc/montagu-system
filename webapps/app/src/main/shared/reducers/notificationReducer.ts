import {NotificationActionTypes, NotificationTypeKeys} from "../actionTypes/NotificationTypes";

export interface NotificationState {
    infoMessages: string[];
    errors: string[];
}

export const initialNotificationState: NotificationState = {
    infoMessages: [],
    errors: []
};

export const notificationReducer = (state = initialNotificationState, action: NotificationActionTypes) => {
    switch (action.type) {
        case NotificationTypeKeys.NOTIFY:
            if (action.severity == "info") {
                // New info messages get added to the end of the queue - they get displayed last
                return {...state, infoMessages: [...state.infoMessages, action.message]};
            } else {
                // New errors get added to the top of the stack - they get displayed first
                return {...state, errors: [action.message, ...state.errors]};
            }
        case NotificationTypeKeys.CLEAR:
            if (action.severity == "info") {
                return {...state, infoMessages: []}
            } else {
                return {...state, errors: []}
            }
        default:
            return state;
    }
};
