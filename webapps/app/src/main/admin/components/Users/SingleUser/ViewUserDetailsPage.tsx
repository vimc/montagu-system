import * as React from "react";
import { connectToStores } from "../../../../shared/alt";
import { AdminPageWithHeader } from "../../AdminPageWithHeader";
import { doNothing } from "../../../../shared/Helpers";
import {UserTitle, UserTitleProps} from "./UserTitle";
import {UserDetailsContent} from "./UserDetailsContent";
import {userActions} from "../../../actions/UserActions";
import {userStore} from "../../../stores/UserStore";

export interface UserDetailsPageProps {
    username: string;
}

export class ViewUserDetailsPage extends AdminPageWithHeader<UserDetailsPageProps> {
    componentDidMount() {
        setTimeout(() => {
            userStore.fetchUsers().catch(doNothing).then(() => {
                userActions.setCurrentUser(this.props.location.params.username);
            });
        });
    }

    title(): JSX.Element {
        return <Title />;
    }

    renderPageContent(): JSX.Element {
        return <UserDetailsContent />;
    }
}

const Title = connectToStores(class extends UserTitle {
    renderContent(props: UserTitleProps) {
        return <h1>{ props.user.name }</h1>;
    }
});