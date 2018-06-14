import * as React from "react";
import { compose } from "recompose";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { ModellingGroupsListContent } from "./ModellingGroupsListContent";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminPageHeader} from "../../AdminPageHeader";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {MainMenuNew} from "../../MainMenu/MainMenuNew";
import {modellingGroupsListPageActionCreators} from "../../../actions/pages/modellingGroupsListPageActionCreators";
import {CreateModellingGroupSection, CreateModellingGroupSectionComponent} from "../Create/CreateModellingGroupSection";

export class ModellingGroupsListPageComponent extends React.Component<PageProperties<undefined>> {
    static title: string = "Modelling groups";

    componentDidMount(){
        this.props.onLoad()
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: ModellingGroupsListPageComponent.title,
            urlFragment: "modelling-groups/",
            parent: MainMenuNew.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <div>
            <AdminPageHeader/>
            <PageArticle title={ModellingGroupsListPageComponent.title}>
                <CreateModellingGroupSection />
                <ModellingGroupsListContent />
            </PageArticle>
        </div>;
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
