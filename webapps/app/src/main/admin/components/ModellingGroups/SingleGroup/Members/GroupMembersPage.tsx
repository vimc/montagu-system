import * as React from "react";
import { compose} from "recompose";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { GroupMembersContent } from "./GroupMembersContent";
import {PageBreadcrumb, PageProperties} from "../../../../../shared/components/PageWithHeader/PageWithHeader";
import {AdminAppState} from "../../../../reducers/adminAppReducers";
import {
    ModellingGroupDetailsPageComponent,
} from "../Details/ModellingGroupDetailsPage";
import { PageArticle } from "../../../../../shared/components/PageWithHeader/PageArticle";
import {AdminPageHeader} from "../../../AdminPageHeader";
import {modellingGroupDetailsPageActionCreators} from "../../../../actions/pages/modellingGroupDetailsPageActionCreators";

interface GroupMembersPageLocationProps {
    groupId: string;
}

export interface GroupMembersPageProps extends PageProperties<GroupMembersPageLocationProps> {
    groupDescription: string;
};

export class GroupMembersPageComponent extends React.Component<GroupMembersPageProps> {
    static title: string = "Manage group members";

    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static breadcrumb(state: AdminAppState): PageBreadcrumb {
        return {
            name: GroupMembersPageComponent.title,
            urlFragment: "admin/",
            parent: ModellingGroupDetailsPageComponent.breadcrumb(state)
        }
    }

    render() :JSX.Element {
        return <div>
            <AdminPageHeader/>
            <PageArticle title={`Manage membership for ${this.props.groupDescription}`}>
                <GroupMembersContent />
            </PageArticle>
        </div>;;
    }
}

const mapStateToProps = (state: AdminAppState) :Partial<GroupMembersPageProps> => {
    console.log('ppp', state)
    return {
        groupDescription: state.groups.currentGroup ? state.groups.currentGroup.description : ''
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<GroupMembersPageProps> => {
    return {
        onLoad: (params: GroupMembersPageLocationProps) => dispatch(modellingGroupDetailsPageActionCreators.onLoad(params))
    }
};

export const GroupMembersPage = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(GroupMembersPageComponent) as React.ComponentClass<Partial<GroupMembersPageProps>>;




