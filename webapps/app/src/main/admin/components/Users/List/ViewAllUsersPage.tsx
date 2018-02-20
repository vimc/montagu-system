import * as React from "react";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { doNothing } from "../../../../shared/Helpers";
import { userStore } from "../../../stores/UserStore";
import { UsersList } from "./UsersList";
import { CreateUserSection } from "../Create/CreateUserSection";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {MainMenu} from "../../MainMenu/MainMenu";
import { Page } from "../../../../shared/components/PageWithHeader/Page";

export class ViewAllUsersPage extends AdminPageWithHeader<undefined> {
    load(props: undefined) {
        return this.loadParent(props).then(() => {
            return userStore.fetchUsers();
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

    render() :JSX.Element {
        return <Page page={this}>
            <CreateUserSection/>
            <div className="sectionTitle">All users</div>
            <UsersList/>
        </Page>;
    }
}