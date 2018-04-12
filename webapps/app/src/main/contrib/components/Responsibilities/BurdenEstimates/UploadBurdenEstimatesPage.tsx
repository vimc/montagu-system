import * as React from "react";
import { Dispatch } from "redux";
import { compose} from "recompose";
import { connect } from 'react-redux';

import {DownloadDataTitle} from "../DownloadDataTitle";
import {UploadBurdenEstimatesContent} from "./UploadBurdenEstimatesContent";
import { ResponsibilityOverviewPageComponent} from "../Overview/ResponsibilityOverviewPage";
import {PageBreadcrumb, PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {uploadBurdenEstimatesPageActionCreators} from "../../../actions/pages/uploadBurdenEstimatesPageActionCreators";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";
import {appSettings} from "../../../../shared/Settings";

export interface UploadBurdenEstimatesPageLocationProps {
    groupId: string;
    touchstoneId: string;
    scenarioId: string;
}

export interface UploadBurdenEstimatesPageProps extends PageProperties<UploadBurdenEstimatesPageLocationProps> {
    setRedirectPath: (path: string) => void;
}

export class UploadBurdenEstimatesPageComponent extends React.Component<UploadBurdenEstimatesPageProps> {
    componentDidMount() {
        this.props.setRedirectPath(appSettings.publicPath + this.props.location.pathname);
        this.props.onLoad(this.props.match.params);
    }

    static breadcrumb(state: ContribAppState): PageBreadcrumb {
        return {
            name: `Upload burden estimates for ${state.responsibilities.currentResponsibility.scenario.description}`,
            urlFragment: `burdens/${state.responsibilities.currentResponsibility.scenario.id}`,
            parent: ResponsibilityOverviewPageComponent.breadcrumb(state)
        }
    }

    title() {
        return <DownloadDataTitle title="Upload burden estimates"/>
    }

    render() :JSX.Element {
        return <PageArticle title={this.title()}>
            <UploadBurdenEstimatesContent/>
        </PageArticle>
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<UploadBurdenEstimatesPageProps> => {
    return {
        onLoad: (params: UploadBurdenEstimatesPageLocationProps) => dispatch(uploadBurdenEstimatesPageActionCreators.onLoad(params)),
        setRedirectPath: (path: string) => dispatch(estimatesActionCreators.setRedirectPath(path))
    }
};

export const UploadBurdenEstimatesPage = compose(
    connect(state => state, mapDispatchToProps),
)(UploadBurdenEstimatesPageComponent) as React.ComponentClass<Partial<UploadBurdenEstimatesPageProps>>;
