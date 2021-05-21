import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import * as React from "react";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {touchstoneResponsibilitiesPageActionCreators} from "../../../actions/pages/TouchstoneResponsibilityPageActionCreators";
import {ResponsibilityList} from "./ResponsibilityList";
import {
    ResponsibilitySetWithComments,
    ResponsibilitySetWithExpectations
} from "../../../../shared/models/Generated";
import {compose} from "recompose";
import {TouchstoneVersionPageLocationProps} from "./TouchstoneVersionPage";
import {ResponsibilityCommentModal} from "./ResponsibilityCommentModal";
import {adminTouchstoneActionCreators} from "../../../actions/adminTouchstoneActionCreators";
import {AnnotatedResponsibility} from "../../../models/AnnotatedResponsibility";

export interface ResponsibilitiesPageProps extends PageProperties<TouchstoneVersionPageLocationProps> {
    currentTouchstoneVersionId: string;
    responsibilitySets: ResponsibilitySetWithExpectations[];
    responsibilityComments: ResponsibilitySetWithComments[];
    addResponsibilityComment: (currentTouchstoneVersion: string, responsibility: AnnotatedResponsibility, comment: string) => void;
}

export interface ResponsibilitiesPageState {
    selectedResponsibility: AnnotatedResponsibility;
}

export class ResponsibilitiesPageComponent extends React.Component<ResponsibilitiesPageProps, ResponsibilitiesPageState> {
    constructor(props: ResponsibilitiesPageProps) {
        super(props);
        this.state = {
            selectedResponsibility: null
        };
        this.selectResponsibility = this.selectResponsibility.bind(this);
        this.addResponsibilityComment = this.addResponsibilityComment.bind(this);
        this.cancelResponsibilityComment = this.cancelResponsibilityComment.bind(this);
    }

    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    selectResponsibility(responsibility: AnnotatedResponsibility) {
        this.setState({
            selectedResponsibility: responsibility
        })
    }

    addResponsibilityComment(currentTouchstoneVersion: string, responsibility: AnnotatedResponsibility, comment: string) {
        this.props.addResponsibilityComment(currentTouchstoneVersion, responsibility, comment);
        this.setState({
            selectedResponsibility: null
        })
    }

    cancelResponsibilityComment() {
        this.setState({
            selectedResponsibility: null
        })
    }

    toAnnotatedResponsibilities(responsibilitySet: ResponsibilitySetWithExpectations): AnnotatedResponsibility[] {
        return responsibilitySet.responsibilities.map(r => (
            {
                modellingGroup: responsibilitySet.modelling_group_id,
                comment: this.props.responsibilityComments
                    .find(e => e.modelling_group_id === responsibilitySet.modelling_group_id)
                    .responsibilities
                    .find(e => e.scenario_id === r.scenario.id).comment,
                ...r
            }
        ));
    }

    render(): JSX.Element {
        return <PageArticle title={`Responsibility sets in ${this.props.currentTouchstoneVersionId}`}>
            {this.props.responsibilityComments && this.props.responsibilitySets.map(s => <div key={s.modelling_group_id}>
                <h4>{s.modelling_group_id} (<span>{s.status}</span>)</h4>
                <ResponsibilityList responsibilities={this.toAnnotatedResponsibilities(s)} selectResponsibility={this.selectResponsibility}/>
            </div>)}
            {this.state.selectedResponsibility &&
            <ResponsibilityCommentModal responsibility={this.state.selectedResponsibility}
                                        addResponsibilityComment={this.addResponsibilityComment}
                                        cancelResponsibilityComment={this.cancelResponsibilityComment}/>
            }
        </PageArticle>;
    }
}

const mapStateToProps = (state: AdminAppState): Partial<ResponsibilitiesPageProps> => {
    return {
        currentTouchstoneVersionId: state.touchstones.currentTouchstoneVersion ?
            state.touchstones.currentTouchstoneVersion.id : '',
        responsibilitySets: state.touchstones.currentResponsibilitySets,
        responsibilityComments: state.touchstones.currentResponsibilityComments
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<ResponsibilitiesPageProps> => {
    return {
        onLoad: (params: TouchstoneVersionPageLocationProps) =>
            dispatch(touchstoneResponsibilitiesPageActionCreators.onLoad(params)),
        addResponsibilityComment: (currentTouchstoneVersion: string, responsibility: AnnotatedResponsibility, comment: string) =>
            dispatch(adminTouchstoneActionCreators.addResponsibilityComment(
                currentTouchstoneVersion,
                responsibility.modellingGroup,
                responsibility.scenario.id,
                comment
            ))
    };
};

export const ResponsibilitiesPage =
    compose<{}, PageProperties<TouchstoneVersionPageLocationProps>>(connect(mapStateToProps, mapDispatchToProps))
    (ResponsibilitiesPageComponent);
