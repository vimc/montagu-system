import * as React from "react";
import {compose} from "recompose";
import {connect} from 'react-redux';
import {Dispatch} from "redux";

import {ModellingGroupDetailsContent} from "./ModellingGroupDetailsContent";
import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import {PageProperties} from "../../../../../shared/components/PageWithHeader/PageProperties";
import {AdminAppState} from "../../../../reducers/adminAppReducers";
import {modellingGroupDetailsPageActionCreators} from "../../../../actions/pages/ModellingGroupDetailsPageActionCreators";

export interface ModellingGroupDetailsPageLocationProps {
    groupId: string;
}

export interface ModellingGroupDetailsPageProps extends PageProperties<ModellingGroupDetailsPageLocationProps> {
    groupDescription: string;
}

export class ModellingGroupDetailsPageComponent extends React.Component<ModellingGroupDetailsPageProps> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    render(): JSX.Element {
        return <PageArticle title={this.props.groupDescription}>
            <ModellingGroupDetailsContent/>
        </PageArticle>;
    }
}

const mapStateToProps = (state: AdminAppState): Partial<ModellingGroupDetailsPageProps> => {
    return {
        groupDescription: state.groups.currentGroup ? state.groups.currentGroup.description : ''
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<ModellingGroupDetailsPageProps> => {
    return {
        onLoad: (params: ModellingGroupDetailsPageLocationProps) => dispatch(modellingGroupDetailsPageActionCreators.onLoad(params))
    }
};

export const ModellingGroupDetailsPage = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModellingGroupDetailsPageComponent) as React.ComponentClass<Partial<ModellingGroupDetailsPageProps>>;
