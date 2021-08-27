import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import * as React from "react";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {touchstoneResponsibilitiesPageActionCreators} from "../../../actions/pages/TouchstoneResponsibilityPageActionCreators";
import {ResponsibilitySetWithComments, ResponsibilitySetWithExpectations} from "../../../../shared/models/Generated";
import {branch, compose, renderComponent} from "recompose";
import {TouchstoneVersionPageLocationProps} from "./TouchstoneVersionPage";
import {ResponsibilityCommentModal} from "./ResponsibilityCommentModal";
import {ResponsibilitySetCommentModal} from "./ResponsibilitySetCommentModal";
import {ResponsibilitySet} from "./ResponsibilitySet";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {FileDownloadButton} from "../../../../shared/components/FileDownloadLink";

export interface ResponsibilitiesPageProps extends PageProperties<TouchstoneVersionPageLocationProps> {
    currentTouchstoneVersionId: string;
    responsibilitySets: ResponsibilitySetWithExpectations[];
    responsibilityComments: ResponsibilitySetWithComments[];
    canReviewResponsibilities: boolean;
}

export class ResponsibilitiesPageComponent extends React.Component<ResponsibilitiesPageProps> {

    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    render(): JSX.Element {
        return <PageArticle title={`Responsibility sets in ${this.props.currentTouchstoneVersionId}`}>
            {this.props.canReviewResponsibilities &&
            <FileDownloadButton href={`/touchstones/${this.props.currentTouchstoneVersionId}/responsibilities/csv/`}
                                className="mb-4">
                Responsibilities summary
            </FileDownloadButton>
            }
            {this.props.responsibilitySets.map(s =>
                <ResponsibilitySet key={s.modelling_group_id} responsibilitySet={s}/>
            )}
            <ResponsibilityCommentModal/>
            <ResponsibilitySetCommentModal/>
        </PageArticle>;
    }

}

const mapStateToProps = (state: AdminAppState): Partial<ResponsibilitiesPageProps> => {
    return {
        currentTouchstoneVersionId: state.touchstones.currentTouchstoneVersion
            ? state.touchstones.currentTouchstoneVersion.id
            : '',
        responsibilitySets: state.touchstones.currentResponsibilitySets,
        responsibilityComments: state.touchstones.currentResponsibilityComments,
        canReviewResponsibilities: state.auth.canReviewResponsibilities
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<ResponsibilitiesPageProps> => {
    return {
        onLoad: (params: TouchstoneVersionPageLocationProps) =>
            dispatch(touchstoneResponsibilitiesPageActionCreators.onLoad(params))
    };
};

const enhance = compose<{}, PageProperties<ResponsibilitiesPageProps>>(
    connect(mapStateToProps, mapDispatchToProps),
    branch((props: ResponsibilitiesPageProps) => !props.responsibilityComments, renderComponent(LoadingElement))
);

export const ResponsibilitiesPage = enhance(ResponsibilitiesPageComponent);
