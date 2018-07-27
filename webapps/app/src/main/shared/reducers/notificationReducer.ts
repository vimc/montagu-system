import {NotificationActionTypes, NotificationTypeKeys} from "../actionTypes/NotificationTypes";

export interface NotificationState {
    infos: string[];
    errors: string[];
}

export const initialNotificationState: NotificationState = {
    infos: [],
    errors: []
};

export const notificationReducer = (state = initialNotificationState, action: NotificationActionTypes) => {
    switch (action.type) {
        case NotificationTypeKeys.NOTIFY:
            if (action.severity == "info") {
                // New info messages get added to the end of the queue - they get displayed last
                return {...state, infos: [...state.infos, action.message]};
            } else {
                // New errors get added to the top of the stack - they get displayed first
                return {...state, errors: [action.message, ...state.errors]};
            }
        case NotificationTypeKeys.CLEAR:
            if (action.severity == "info") {
                return {...state, infos: []}
            } else {
                return {...state, errors: []}
            }
        default:
            return state;
    }
};
