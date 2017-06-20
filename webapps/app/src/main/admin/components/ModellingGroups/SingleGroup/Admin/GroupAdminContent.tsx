import * as React from "react";
import { RemoteContentComponent } from "../../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../../../shared/models/RemoteContent";
import { ModellingGroupDetails } from "../../../../../shared/models/Generated";
import { groupStore } from "../../../../stores/GroupStore";
import { connectToStores } from "../../../../../shared/alt";

const commonStyles = require("../../../../../shared/styles/common.css");

interface Props extends RemoteContent {
    group: ModellingGroupDetails;
}

export class GroupAdminContentComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [groupStore];
    }

    static getPropsFromStores() {
        const group = groupStore.getCurrentGroupDetails();
        return {
            group: group,
            ready: group != null
        };
    }

    renderCurrent(props: Props): JSX.Element {
        const admins = props.group.admins;
        if (admins.length == 0) {
            return <div>This group does not have an admin.</div>;
        } else {
            const items = admins.join(", ");
            return <div>{ items }</div>
        }
    }

    renderAdd(props: Props): JSX.Element {
        const options = [1, 2, 3].map(n => <option value={ n }>Fake user { n }</option>);
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