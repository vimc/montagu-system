import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import * as React from "react";
import {AdminPageHeader} from "../../AdminPageHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {Dispatch} from "redux";
import {compose} from "recompose";
import {connect} from "react-redux";
import {TouchstoneListPageComponent} from "../List/TouchstoneListPage";
import {touchstoneDetailsPageActionCreators} from "../../../actions/pages/touchstoneDetailsPageActionCreators";
import {TouchstoneDetails} from "./TouchstoneDetails";

export interface TouchstoneDetailsPageLocationProps {
    touchstoneId: string;
}

interface TouchstoneDetailsPageProps extends PageProperties<TouchstoneDetailsPageLocationProps> {
    touchstoneName: string;
}

export class TouchstoneDetailsPageComponent extends React.Component<TouchstoneDetailsPageProps> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params);
    }

    static breadcrumb(state: AdminAppState): PageBreadcrumb {
        return {
            name: state.touchstones.currentTouchstone.id,
            parent: TouchstoneListPageComponent.breadcrumb(),
            urlFragment: `${state.touchstones.currentTouchstone.id}/`
        };
    }

    render(): JSX.Element {
        return <div>
            <AdminPageHeader />
            <PageArticle title={this.props.touchstoneName}>
                <TouchstoneDetails />
            </PageArticle>
        </div>;
    }
}

function mapDispatchToProps(dispatch: Dispatch<AdminAppState>): Partial<PageProperties<undefined>> {
    return {
        onLoad: (params: TouchstoneDetailsPageLocationProps) => dispatch(touchstoneDetailsPageActionCreators.onLoad(params))
    }
}

function mapStateToProps(state: AdminAppState): Partial<TouchstoneDetailsPageProps> {
    return {
        touchstoneName: state.touchstones.currentTouchstone ? state.touchstones.currentTouchstone.description : ""
    };
}

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
);

export const TouchstoneDetailsPage = enhance(TouchstoneDetailsPageComponent);