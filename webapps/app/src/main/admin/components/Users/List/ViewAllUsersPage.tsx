import * as React from "react";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { doNothing } from "../../../../shared/Helpers";
import { userStore } from "../../../stores/UserStore";
import { UsersList } from "./UsersList";
import { CreateUserSection } from "../Create/CreateUserSection";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {MainMenu} from "../../MainMenu/MainMenu";

const commonStyles = require("../../../../shared/styles/common.css");

export class ViewAllUsersPage extends AdminPageWithHeader<undefined> {
    componentDidMount() {
        super.componentDidMount();
        setTimeout(() => {
            userStore.fetchUsers().catch(doNothing);
        });
    }

    name(): string {
        return "Users";
    }

    urlFragment(): string {
        return "users/";
    }

    parent(): IPageWithParent {
        return new MainMenu();
    }

    renderPageContent() {
        return <div>
            <CreateUserSection/>

            <div className={commonStyles.sectionTitle}>All users</div>
            <UsersList/>
        </div>;
    }
}