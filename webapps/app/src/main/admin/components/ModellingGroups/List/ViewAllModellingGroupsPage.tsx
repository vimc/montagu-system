import * as React from "react";
import { compose } from "recompose";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { ModellingGroupsList } from "./ModellingGroupsList";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminPageHeader} from "../../AdminPageHeader";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {MainMenuNew} from "../../MainMenu/MainMenuNew";
import {viewAllModellingGroupsPageActionCreators} from "../../../actions/pages/viewAllModellingGroupsPageActionCreators";

export class ViewAllModellingGroupsPageComponent extends React.Component<PageProperties<undefined>> {
    static title: string = "Modelling groups";

    componentDidMount(){
        this.props.onLoad()
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: ViewAllModellingGroupsPageComponent.title,
            urlFragment: "modelling-groups/",
            parent: MainMenuNew.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <div>
            <AdminPageHeader/>
            <PageArticle title={ViewAllModellingGroupsPageComponent.title}>
                <ModellingGroupsList />
            </PageArticle>
        </div>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<PageProperties<undefined>> => {
    return {
        onLoad: () => dispatch(viewAllModellingGroupsPageActionCreators.onLoad())
    }
};

export const ViewAllModellingGroupsPage = compose(
    connect(state => state, mapDispatchToProps)
)(ViewAllModellingGroupsPageComponent) as React.ComponentClass<Partial<PageProperties<undefined>>>;
