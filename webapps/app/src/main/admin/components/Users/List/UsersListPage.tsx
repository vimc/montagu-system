import * as React from "react";
import {compose} from "recompose";
import {connect} from 'react-redux';
import {Dispatch} from "redux";

import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {usersListPageActionCreators} from "../../../actions/pages/usersListPageActionCreators";
import {CreateUserSection} from "../Create/CreateUserSection";
import {UsersList} from "./UsersList";
import {MainMenuNew} from "../../MainMenu/MainMenuNew";
import {AdminPageHeader} from "../../AdminPageHeader";

export class UsersListPageComponent extends React.Component<PageProperties<undefined>> {
    static title: string = "Users";

    componentDidMount() {
        this.props.onLoad()
    }

    static breadcrumb(): PageBreadcrumb {
        return {
            name: UsersListPageComponent.title,
            urlFragment: "users/",
            parent: MainMenuNew.breadcrumb()
        }
    }

    render(): JSX.Element {
        return <div>
            <AdminPageHeader/>
            <PageArticle title={UsersListPageComponent.title}>
                <CreateUserSection/>
                <div className="sectionTitle">All users</div>
                <UsersList/>
            </PageArticle></div>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<PageProperties<undefined>> => {
    return {
        onLoad: () => dispatch(usersListPageActionCreators.onLoad())
    }
};

export const UsersListPage = compose(
    connect(state => state, mapDispatchToProps)
)(UsersListPageComponent) as React.ComponentClass<PageProperties<undefined>>;
