import * as React from "react";
import { RemoteContentComponent } from "../../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../../../shared/models/RemoteContent";
import { ModellingGroupDetails, User } from "../../../../../shared/models/Generated";
import { groupStore } from "../../../../stores/GroupStore";
import { connectToStores } from "../../../../../shared/alt";
import { userStore } from "../../../../stores/UserStore";
import { ListOfUsers } from "../../ListOfUsers";

const commonStyles = require("../../../../../shared/styles/common.css");

interface Props extends RemoteContent {
    group: ModellingGroupDetails;
    admins: Set<User>;
    users: User[];
}

export class GroupAdminContentComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [ groupStore, userStore ];
    }

    static getPropsFromStores() {
        const group = groupStore.getCurrentGroupDetails();
        const allUsers = userStore.getState().users;
        return {
            group: group,
            users: allUsers,
            admins: new Set(group.admins.map(a => allUsers.find(u => a == u.username))),
            ready: group != null && userStore.getState().ready
        };
    }

    renderCurrent(props: Props): JSX.Element {
        if (props.admins.size == 0) {
            return <div>This group does not have an admin.</div>;
        } else {
            return <ListOfUsers users={ [...props.admins] } />;
        }
    }

    renderAdd(props: Props): JSX.Element {
        const options = props.users.filter(x => !props.admins.has(x))
            .map(u => <option key={ u.username } value={ u.username }>{ u.name }</option>);
        const select = {
            width: 300,
            height: 32
        };
        const button = {
            marginLeft: 10
        };
        return <div>
            <select style={ select }>{ options }</select>
            <button style={ button }>Add</button>
        </div>;
    }

    renderContent(props: Props) {
        return <div>
            <div>
                <p>The group admin (or admins) manage the modelling group members in Montagu.</p>
                <p>The admin can add new users to Montagu and grant them permission to use the contribution portal,
                    to download coverage data and upload burden estimates for their group.</p>
                <p>The admin can also remove users from their group, and can assign a new admin.</p>
            </div>
            <div>
                <div className={ commonStyles.sectionTitle }>Current group admin</div>
                { this.renderCurrent(props) }
            </div>
            <div>
                <div className={ commonStyles.sectionTitle }>Add admin user</div>
                { this.renderAdd(props) }
            </div>
        </div>
    }
}

export const GroupAdminContent = connectToStores(GroupAdminContentComponent);