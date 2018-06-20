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

export class TouchstoneListPageComponent extends React.Component<PageProperties<undefined>> {
    static title: string = "Touchstones";

    componentDidMount() {
        this.props.onLoad();
    }

    render(): JSX.Element {
        return <div>
            <AdminPageHeader />
            <PageArticle title={TouchstoneListPageComponent.title}>
                <TouchstoneList/>
            </PageArticle>
        </div>;
    }
}

function mapDispatchToProps(dispatch: Dispatch<AdminAppState>): Partial<PageProperties<undefined>> {
    return {
        onLoad: () => dispatch(touchstoneListPageActionCreators.onLoad())
    }
}

export const TouchstoneListPage = compose(
    connect(state => state, mapDispatchToProps)
)(TouchstoneListPageComponent) as React.ComponentClass<PageProperties<undefined>>;