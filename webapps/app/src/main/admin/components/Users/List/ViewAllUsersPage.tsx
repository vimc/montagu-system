import * as React from "react";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { doNothing } from "../../../../shared/Helpers";
import { userStore } from "../../../stores/UserStore";
import { UsersList } from "./UsersList";
import { CreateUserSection } from "../Create/CreateUserSection";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {MainMenu} from "../../MainMenu/MainMenu";
import { Page } from "../../../../shared/components/PageWithHeader/Page";

import "../../../../shared/styles/common.scss";

export class ViewAllUsersPage extends AdminPageWithHeader<undefined> {
    componentDidMount() {
        setTimeout(()=> {
            this.load();
        });
    }

    load() {
        userStore.fetchUsers().catch(doNothing).then(() => {
            super.load();
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

    render() {
        return <Page page={this}>
            <CreateUserSection/>
            <div className="sectionTitle">All users</div>
            <UsersList/>
        </Page>;
    }
}