import * as React from "react";
import {compose} from "recompose";
import {connect} from 'react-redux';
import {Dispatch} from "redux";

import {ModellingGroupsListContent} from "./ModellingGroupsListContent";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {modellingGroupsListPageActionCreators} from "../../../actions/pages/ModellingGroupsListPageActionCreators";
import {CreateModellingGroupSection} from "../Create/CreateModellingGroupSection";
import {ButtonLink} from "../../../../shared/components/ButtonLink";

export class ModellingGroupsListPageComponent extends React.Component<PageProperties<undefined>> {
    static title: string = "Modelling groups";

    componentDidMount() {
        this.props.onLoad()
    }

    render(): JSX.Element {
        return <PageArticle title={ModellingGroupsListPageComponent.title}>
            <CreateModellingGroupSection/>
            <div className="sectionTitle">All groups</div>
            <ModellingGroupsListContent/>
            <div className="sectionTitle">Models</div>
            <ButtonLink href="/modelling-groups/models">View all model metadata</ButtonLink>
        </PageArticle>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<PageProperties<undefined>> => {
    return {
        onLoad: () => dispatch(modellingGroupsListPageActionCreators.onLoad())
    }
};

export const ModellingGroupsListPage = compose(
    connect(state => state, mapDispatchToProps)
)(ModellingGroupsListPageComponent) as React.ComponentClass<Partial<PageProperties<undefined>>>;
