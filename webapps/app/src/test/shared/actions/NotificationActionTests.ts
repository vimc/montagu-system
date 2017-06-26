import { expect } from "chai";
import {
    makeNotification,
    makeNotificationException,
    notificationActions
} from "../../../main/shared/actions/NotificationActions";

describe("NotificationActions", () => {
    it("does not change notification", () => {
        const notification = makeNotification("message", "info");
        expect(notificationActions.notify(notification)).to.eql(notification);
    });

    it("converts NotificationException into notification", () => {
        const exception = makeNotificationException("message", "info");
        expect(notificationActions.notify(exception)).to.eql({
            message: "message",
            type: "info"
        });
    });
});
