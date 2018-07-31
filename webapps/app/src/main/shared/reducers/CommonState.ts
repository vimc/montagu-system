import {FormReducer} from "redux-form";
import {AuthState} from "./authReducer";
import {NotificationState} from "./notificationReducer";

export interface CommonState {
    auth: AuthState;
    form: FormReducer;
    notifications: NotificationState;
}