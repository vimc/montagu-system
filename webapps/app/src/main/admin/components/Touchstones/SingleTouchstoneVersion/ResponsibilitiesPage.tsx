import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import * as React from "react";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {touchstoneResponsibilitiesPageActionCreators} from "../../../actions/pages/TouchstoneResponsibilityPageActionCreators";
import {ResponsibilityList} from "./ResponsibilityList";
import {ResponsibilitySetWithComments, ResponsibilitySetWithExpectations} from "../../../../shared/models/Generated";
import {compose} from "recompose";
import {TouchstoneVersionPageLocationProps} from "./TouchstoneVersionPage";
import {ResponsibilityCommentModal} from "./ResponsibilityCommentModal";
import {AnnotatedResponsibility} from "../../../models/AnnotatedResponsibility";

export interface ResponsibilitiesPageProps extends PageProperties<TouchstoneVersionPageLocationProps> {
    currentTouchstoneVersionId: string;
    responsibilitySets: ResponsibilitySetWithExpectations[];
    responsibilityComments: ResponsibilitySetWithComments[];
}

export class ResponsibilitiesPageComponent extends React.Component<ResponsibilitiesPageProps> {

    componentDidMount() {
        this.props.onLoad(this.props.match.params)
    }

    toAnnotatedResponsibilities(responsibilitySet: ResponsibilitySetWithExpectations): AnnotatedResponsibility[] {
        return responsibilitySet.responsibilities.map(r => {
            const responsibilitySetWithComments = this.props.responsibilityComments
                .find(e => e.modelling_group_id === responsibilitySet.modelling_group_id)
            return {
                modellingGroup: responsibilitySet.modelling_group_id,
                comment: responsibilitySetWithComments &&
                    responsibilitySetWithComments.responsibilities.find(e => e.scenario_id === r.scenario.id).comment,
                ...r
            }
        });
    }

    render(): JSX.Element {
        return <PageArticle title={`Responsibility sets in ${this.props.currentTouchstoneVersionId}`}>
            {this.props.responsibilitySets.map(s => <div key={s.modelling_group_id}>
                <h4>{s.modelling_group_id} (<span>{s.status}</span>)</h4>
                <ResponsibilityList responsibilities={this.toAnnotatedResponsibilities(s)}/>
            </div>)}
            <ResponsibilityCommentModal/>
        </PageArticle>;
    }
}

const mapStateToProps = (state: AdminAppState): Partial<ResponsibilitiesPageProps> => {
    return {
        currentTouchstoneVersionId: state.touchstones.currentTouchstoneVersion ? state.touchstones.currentTouchstoneVersion.id : '',
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

export const ResponsibilitiesPage =
    compose<{}, PageProperties<TouchstoneVersionPageLocationProps>>(connect(mapStateToProps, mapDispatchToProps))
    (ResponsibilitiesPageComponent);