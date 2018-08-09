import * as React from "react";
import {Dispatch} from "redux";
import {connect} from 'react-redux';

import {ResponsibilitiesPageTitle} from "../PageTitle";
import {UploadBurdenEstimatesContent} from "./UploadBurdenEstimatesContent";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {uploadBurdenEstimatesPageActionCreators} from "../../../actions/pages/uploadBurdenEstimatesPageActionCreators";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";
import {appSettings} from "../../../../shared/Settings";
import {ContribPage} from "../../../ContribPage";
import {compose} from "recompose";

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
    }

    static title() {
        return <ResponsibilitiesPageTitle title="Upload burden estimates"/>
    }

    render(): JSX.Element {
        return <PageArticle title={UploadBurdenEstimatesPageComponent.title()}>
            <UploadBurdenEstimatesContent/>
        </PageArticle>
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<UploadBurdenEstimatesPageProps> => {
    return {
        setRedirectPath: (path: string) => dispatch(estimatesActionCreators.setRedirectPath(path))
    }
};

export const UploadBurdenEstimatesPage = compose<PageProperties<UploadBurdenEstimatesPageLocationProps>,
    Partial<PageProperties<UploadBurdenEstimatesPageLocationProps>>>(connect(state => state, mapDispatchToProps),
ContribPage(uploadBurdenEstimatesPageActionCreators))(UploadBurdenEstimatesPageComponent);
