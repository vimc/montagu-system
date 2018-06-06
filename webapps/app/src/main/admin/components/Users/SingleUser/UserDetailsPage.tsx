import * as React from "react";
import { compose} from "recompose";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { PageArticle } from "../../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {UsersListPageComponent} from "../List/UsersListPage";
import {userDetailsPageActionCreators} from "../../../actions/pages/userDetailsPageActionCreators";
import {UserDetailsContent} from "./UserDetailsContent";

export interface UserDetailsPageLocationProps {
    username: string;
}

export interface UserDetailsPageProps extends PageProperties<UserDetailsPageLocationProps> {
    currentUser: string;
}

export class UserDetailsPageComponent extends React.Component<UserDetailsPageProps> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static breadcrumb(state: AdminAppState): PageBreadcrumb {
        return {
            name: state.users.currentUser.username,
            urlFragment: `${state.users.currentUser.username}/`,
            parent: UsersListPageComponent.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <PageArticle title={this.props.currentUser}>
            <UserDetailsContent/>
        </PageArticle>;
    }
}

const mapStateToProps = (state: AdminAppState) :Partial<UserDetailsPageProps> => {
    return {
        currentUser: state.users.currentUser ? state.users.currentUser.name : ''
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<UserDetailsPageProps> => {
    return {
        onLoad: (params: UserDetailsPageLocationProps) => dispatch(userDetailsPageActionCreators.onLoad(params))
    }
};

export const UserDetailsPage = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(UserDetailsPageComponent) as React.ComponentClass<Partial<UserDetailsPageProps>>;