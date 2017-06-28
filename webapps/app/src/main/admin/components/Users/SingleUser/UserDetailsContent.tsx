import * as React from "react";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { connectToStores } from "../../../../shared/alt";
import {User} from "../../../../shared/models/Generated";
import {userStore} from "../../../../../../../contrib/src/main/admin/stores/UserStore";

const commonStyles = require("../../../../shared/styles/common.css");

interface Props extends RemoteContent {
    user: User;
}

class UserDetailsContentComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [ userStore ];
    }
    static getPropsFromStores(): Props {
        const user = userStore.getCurrentUserDetails();
        return {
            user: user,
            ready: user != null
        };
    }

    renderContent(props: Props) {
        return <div>
            <table className={ commonStyles.specialColumn }>
                <tbody>
                    <tr><td>Username</td><td>{ props.user.username }
                    </td></tr>
                 </tbody>
            </table>
        </div>
    }
}

export const UserDetailsContent =
    connectToStores(UserDetailsContentComponent);