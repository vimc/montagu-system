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
import {AnnotatedResponsibilitySet} from "../../../models/AnnotatedResponsibility";
import {ResponsibilitySetCommentModal} from "./ResponsibilitySetCommentModal";
import {ResponsibilitySet} from "./ResponsibilitySet";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";

export interface ResponsibilitiesPageProps extends PageProperties<TouchstoneVersionPageLocationProps> {
    currentTouchstoneVersionId: string;
    responsibilitySets: ResponsibilitySetWithExpectations[];
    responsibilityComments: ResponsibilitySetWithComments[];
}

export class ResponsibilitiesPageComponent extends React.Component<ResponsibilitiesPageProps> {

    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    render(): JSX.Element {
        return <PageArticle title={`Responsibility sets in ${this.props.currentTouchstoneVersionId}`}>
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
        responsibilityComments: state.touchstones.currentResponsibilityComments
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
