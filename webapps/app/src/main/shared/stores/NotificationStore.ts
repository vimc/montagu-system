import { AbstractStore } from "./AbstractStore";
import { MessageType, Notification, notificationActions } from "../actions/NotificationActions";
import { alt } from "../alt";
// import { authActions, LogInProperties } from "../actions/AuthActions";
import { appSettings, settings } from "../Settings";
import StoreModel = AltJS.StoreModel;

export interface NotificationState {
    errors: string[];
    infos: string[];
}

function initialState(): NotificationState {
    return {
        errors: [],
        infos: [],
        // loggedIn: false
    };
}

class NotificationStore extends AbstractStore<NotificationState, AltJS.AltStore<NotificationState>> {
    errors: string[];
    infos: string[];

    constructor() {
        super();
        this.bindListeners({
            handleNotification: notificationActions.notify,
            handleClear: notificationActions.clear,
            // handleLogIn: authActions.logIn
        });
    }

    initialState(): NotificationState {
        return initialState();
    }

    handleNotification(notification: Notification) {
        switch (notification.type) {
            case "error":
                // New notifications get added to the top of the stack - they get displayed first
                this.errors = [notification.message, ...this.errors];
                break;
            case "info":
                // New notifications get added to the end of the queue - they get displayed last
                this.infos = [...this.infos, notification.message];
        }
    }

    handleClear(messageType: MessageType) {
        switch (messageType) {
            case "info":
                this.infos = this.infos.slice(1);
                break;
            case "error":
                this.errors = [];
                break;
        }
    }

    // handleLogIn(props: LogInProperties) {
    //     if (!props.isAccountActive || !props.isModeller) {
    //         let reason: string;
    //         if (!props.isAccountActive) {
    //             reason = "Your account has been deactivated";
    //         } else if (appSettings.requiresModellingGroupMembership) {
    //             reason = "Only members of modelling groups can log into the contribution portal";
    //         }
    //         if (reason) {
    //             const support = settings.supportContact;
    //             this.errors = [`${reason}. Please contact ${support} for help.`, ...this.errors];
    //         }
    //     }
    // }
}

export const notificationStore =
    alt.createStore<NotificationState>(NotificationStore as StoreModel<NotificationState>) as
    AltJS.AltStore<NotificationState>;