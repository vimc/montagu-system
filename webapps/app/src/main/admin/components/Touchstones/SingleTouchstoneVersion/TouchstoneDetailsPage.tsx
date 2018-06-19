import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import * as React from "react";
import {MainMenuNew} from "../../MainMenu/MainMenuNew";
import {AdminPageHeader} from "../../AdminPageHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {TouchstoneList} from "./TouchstoneList";
import {Dispatch} from "redux";
import {touchstoneListPageActionCreators} from "../../../actions/pages/touchstoneListPageActionCreators";
import {compose} from "recompose";
import {connect} from "react-redux";
import {UsersListPageComponent} from "../../Users/List/UsersListPage";

export class TouchstoneDetailsPageComponent extends React.Component<PageProperties<undefined>> {
    static title: string = "Touchstones";

    componentDidMount() {
        this.props.onLoad();
    }

    static breadcrumb(state: AdminAppState): PageBreadcrumb {
        return {
            name: state.touchstones.currentTouchstone,
            parent: TouchstoneListPage.breadcrumb(),
            urlFragment: `${state.touchstones.currentTouchstone}/`
        };
    }

    render(): JSX.Element {
        return <div>
            <AdminPageHeader />
            <PageArticle title={TouchstoneDetailsPageComponent.title}>

            </PageArticle>
        </div>;
    }
}

function mapDispatchToProps(dispatch: Dispatch<AdminAppState>): Partial<PageProperties<undefined>> {
    return {
        onLoad: () => dispatch(touchstonePageActionCreators.onLoad())
    }
}

export const TouchstoneListPage = compose(
    connect(state => state, mapDispatchToProps)
)(TouchstoneDetailsPageComponent) as React.ComponentClass<PageProperties<undefined>>;