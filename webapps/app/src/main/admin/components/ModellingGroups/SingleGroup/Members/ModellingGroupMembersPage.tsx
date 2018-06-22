import * as React from "react";
import {compose} from "recompose";
import {connect} from 'react-redux';
import {Dispatch} from "redux";

import {ModellingGroupMembersContent} from "./ModellingGroupMembersContent";
import {PageProperties} from "../../../../../shared/components/PageWithHeader/PageWithHeader";
import {AdminAppState} from "../../../../reducers/adminAppReducers";
import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import {AdminPageHeader} from "../../../AdminPageHeader";
import {modellingGroupMembersPageActionCreators} from "../../../../actions/pages/ModellingGroupMembersPageActionCreators";

export interface ModellingGroupMembersPageLocationProps {
    groupId: string;
}

export interface ModellingGroupMembersPageProps extends PageProperties<ModellingGroupMembersPageLocationProps> {
    groupDescription: string;
}

export class ModellingGroupMembersPageComponent extends React.Component<ModellingGroupMembersPageProps> {
    static title: string = "Manage group members";

    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    render(): JSX.Element {
        return <div>
            <AdminPageHeader/>
            <PageArticle title={`Manage membership for ${this.props.groupDescription}`}>
                <ModellingGroupMembersContent/>
            </PageArticle>
        </div>;
    }
}

const mapStateToProps = (state: AdminAppState): Partial<ModellingGroupMembersPageProps> => {
    return {
        groupDescription: state.groups.currentGroup ? state.groups.currentGroup.description : ''
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<ModellingGroupMembersPageProps> => {
    return {
        onLoad: (params: ModellingGroupMembersPageLocationProps) => dispatch(modellingGroupMembersPageActionCreators.onLoad(params))
    }
};

export const ModellingGroupMembersPage = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModellingGroupMembersPageComponent) as React.ComponentClass<Partial<ModellingGroupMembersPageProps>>;




