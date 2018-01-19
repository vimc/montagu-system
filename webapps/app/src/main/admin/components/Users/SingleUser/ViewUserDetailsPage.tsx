import * as React from "react";
import { connectToStores } from "../../../../shared/alt";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { doNothing } from "../../../../shared/Helpers";
import {UserTitle, UserTitleProps} from "./UserTitle";
import {UserDetailsContent} from "./UserDetailsContent";
import {userActions} from "../../../actions/UserActions";
import {userStore} from "../../../stores/UserStore";
import {IPageWithParent} from "../../../../shared/models/Breadcrumb";
import {ViewAllUsersPage} from "../List/ViewAllUsersPage";
import { Page } from "../../../../shared/components/PageWithHeader/Page";

export interface UserDetailsPageProps {
    username: string;
}

export class ViewUserDetailsPage extends AdminPageWithHeader<UserDetailsPageProps> {
    componentDidMount() {
        setTimeout(()=> {
            this.load();
        });
    }

    load() {
        userStore.fetchUsers().catch(doNothing).then(() => {
            userActions.setCurrentUser(this.props.location.params.username);
            super.load();
        });
    }

    name(): string {
        const s = userStore.getState();
        return s.currentUsername;
    }

    title(): JSX.Element {
        return <Title />;
    }

    urlFragment(): string {
        const s = userStore.getState();
        return `${s.currentUsername}/`;
    }

    parent(): IPageWithParent {
        return new ViewAllUsersPage();
    }

    render(): JSX.Element {
        return <Page page={this}>
            <UserDetailsContent />
        </Page>;
    }
}

const Title = connectToStores(class extends UserTitle {
    renderContent(props: UserTitleProps) {
        return <h1>{ props.user.name }</h1>;
    }
});