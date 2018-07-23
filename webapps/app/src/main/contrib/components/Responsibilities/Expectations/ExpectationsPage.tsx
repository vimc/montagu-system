import {ResponsibilityOverviewPageComponent} from "../Overview/ResponsibilityOverviewPage";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import * as React from "react";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {ResponsibilitiesPageTitle} from "../PageTitle";
import {DownloadCoveragePageLocationProps} from "../Coverage/DownloadCoveragePage";
import {Dispatch} from "redux";
import {compose} from "recompose";
import {connect} from "react-redux";
import {expectationsPageActionCreators} from "../../../actions/pages/expectationsPageActionCreators";
import {ExpectationsList} from "./ExpectationsList";

export interface ExpectationsPageLocationProps {
    groupId: string;
    touchstoneId: string;
}

const title = "Download burden estimate templates";

export class ExpectationsPageComponent extends React.Component<PageProperties<ExpectationsPageLocationProps>> {
    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    static breadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: title,
            urlFragment: `templates/`,
            parent: ResponsibilityOverviewPageComponent.breadcrumb(state)
        }
    }

    render(): JSX.Element {
        return <PageArticle title={title}>
            <ExpectationsList/>
        </PageArticle>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<PageProperties<DownloadCoveragePageLocationProps>> => {
    return {
        onLoad: (params: ExpectationsPageLocationProps) => dispatch(expectationsPageActionCreators.onLoad(params))
    }
};

export const ExpectationsPage = compose(
    connect(state => state, mapDispatchToProps),
)(ExpectationsPageComponent) as React.ComponentClass<Partial<PageProperties<ExpectationsPageLocationProps>>>;
