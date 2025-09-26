import {notificationReducer, NotificationState} from "../../../main/shared/reducers/notificationReducer";

import {NotificationTypeKeys} from "../../../main/shared/actionTypes/NotificationTypes";

describe("notificationReducer", () => {
    it("adds errors to top of stack", () => {
        const state1: NotificationState = {
            infoMessages: [],
            errors: ["message1"]
        };
        const state2: NotificationState = {
            infoMessages: [],
            errors: ["message2", "message1"]
        };

        expect(notificationReducer(undefined, {
            type: NotificationTypeKeys.NOTIFY,
            message: "message1",
            severity: "error"
        })).toEqual(state1);

        expect(notificationReducer(state1, {
            type: NotificationTypeKeys.NOTIFY,
            message: "message2",
            severity: "error"
        })).toEqual(state2);
    });

    it("adds infos to end of queue", () => {
        const state1: NotificationState = {
            infoMessages: ["message1"],
            errors: []
        };
        const state2: NotificationState = {
            infoMessages: ["message1", "message2"],
            errors: []
        };

        expect(notificationReducer(undefined, {
            type: NotificationTypeKeys.NOTIFY,
            message: "message1",
            severity: "info"
        })).toEqual(state1);

        expect(notificationReducer(state1, {
            type: NotificationTypeKeys.NOTIFY,
            message: "message2",
            severity: "info"
        })).toEqual(state2);
    });

    it("clears infos", () => {
        const initial: NotificationState = {
            infoMessages: ["i"],
            errors: ["e"]
        };

        expect(notificationReducer(initial, {type: NotificationTypeKeys.CLEAR, severity: "info"}))
            .toEqual({infoMessages: [], errors: ["e"]});
    });

    it("clears errors", () => {
        const initial: NotificationState = {
            infoMessages: ["i"],
            errors: ["e"]
        };

        expect(notificationReducer(initial, {type: NotificationTypeKeys.CLEAR, severity: "error"}))
            .toEqual({infoMessages: ["i"], errors: []});
    });
});