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
    members: Set<User>;
    users: User[];
}

export class GroupAdminContentComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [ groupStore, userStore ];
    }

    static getPropsFromStores(): Props {
        const group = groupStore.getCurrentGroupDetails();
        const allUsers = userStore.getState().users;
        if (group != null) {
            return {
                users: allUsers,
                members: new Set(group.members.map(a => allUsers.find(u => a == u.username))),
                ready: group != null && userStore.getState().ready
            };
        } else {
            return {
                users: [],
                members: new Set(),
                ready: false
            };
        }
    }

    renderCurrent(props: Props): JSX.Element {
        if (props.members.size == 0) {
            return <div>This group does not have any members.</div>;
        } else {
            return <ListOfUsers users={ [...props.members] } />;
        }
    }

    renderAdd(props: Props): JSX.Element {
        const options = props.users.filter(x => !props.members.has(x))
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
                <div className={ commonStyles.sectionTitle }>Current group members</div>
                { this.renderCurrent(props) }
            <div>
                <div className={ commonStyles.sectionTitle }>Add modelling group member</div>
                { this.renderAdd(props) }
            </div>
        </div>
    }
}

export const GroupAdminContent = connectToStores(GroupAdminContentComponent);