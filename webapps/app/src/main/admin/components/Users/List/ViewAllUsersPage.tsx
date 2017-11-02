import * as React from "react";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { doNothing } from "../../../../shared/Helpers";
import { userStore } from "../../../stores/UserStore";
import { UsersList } from "./UsersList";
import { CreateUserSection } from "../Create/CreateUserSection";

const commonStyles = require("../../../../shared/styles/common.css");

export class ViewAllUsersPage extends AdminPageWithHeader<undefined> {
    componentDidMount() {
        setTimeout(() => {
            userStore.fetchUsers().catch(doNothing);
        });
    }

    title() {
        return <span>Users</span>
    }

    renderPageContent() {
        return <div>
            <CreateUserSection/>

            <div className={commonStyles.sectionTitle}>All users</div>
            <UsersList/>
        </div>;
    }
}