import * as React from "react";
import { User} from "../../../../shared/models/Generated";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {userStore} from "../../../stores/UserStore";

export interface UserTitleProps extends RemoteContent {
    user: User;
}

export abstract class UserTitle extends RemoteContentComponent<UserTitleProps, {}> {
    static getStores() {
        return [ userStore ];
    }
    static getPropsFromStores(): UserTitleProps {
        const user = userStore.getCurrentUserDetails();
        return {
            user: user,
            ready: user != null
        };
    }

    renderLoading() {
        return <span>Loading...</span>;
    }
}