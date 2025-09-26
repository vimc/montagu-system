import {FormReducer} from "redux-form";
import {AuthState} from "./authReducer";
import {NotificationState} from "./notificationReducer";
import {DiseasesState} from "./diseasesReducer";

export interface CommonState {
    auth: AuthState;
    form: FormReducer;
    notifications: NotificationState;
    diseases: DiseasesState;
}