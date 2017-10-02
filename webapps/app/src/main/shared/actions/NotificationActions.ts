import alt from "../alt";
import { AbstractActions } from "./AbstractActions";

export type MessageType = "error" | "info";

export interface Notification {
    message: string;
    type: MessageType;
}

interface Actions {
    notify(notification: Notification | NotificationException): Notification;
    clear(messageType: MessageType): MessageType;
}

class NotificationActions extends AbstractActions implements Actions {
    notify(notification: Notification | NotificationException): Notification  {
        if (notification instanceof Error) {
            notification = notification.notification;
        }
        return notification;
    }
    clear(messageType: MessageType): MessageType {
        return messageType;
    }
}

export function makeNotification(message: string, messageType: MessageType): Notification {
    return {
        message: message,
        type: messageType
    };
}
export function makeNotificationException(message: string, messageType: MessageType): NotificationException {
    return new NotificationException(makeNotification(message, messageType));
}

export const notificationActions = alt.createActions<Actions>(NotificationActions);

export class NotificationException extends Error {
    notification: Notification;

    constructor(notification: Notification) {
        super("This notification was thrown as an exception: " + JSON.stringify(notification));
        this.notification = notification;
    }
}