import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import * as React from "react";
import {AdminPageHeader} from "../../AdminPageHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {TouchstoneList} from "./TouchstoneList";
import {Dispatch} from "redux";
import {touchstoneListPageActionCreators} from "../../../actions/pages/TouchstoneListPageActionCreators";
import {compose} from "recompose";
import {connect} from "react-redux";
import {CreateTouchstoneForm} from "../Create/CreateTouchstoneForm";
import {settings} from "../../../../shared/Settings";

export class TouchstoneListPageComponent extends React.Component<PageProperties<undefined>> {
    static title: string = "Touchstones";

    componentDidMount() {
        this.props.onLoad();
    }

    render(): JSX.Element {
        return <div>
            <AdminPageHeader/>
            <PageArticle title={TouchstoneListPageComponent.title}>
                {settings.showTouchstoneCreation &&
                <CreateTouchstoneForm/>}
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