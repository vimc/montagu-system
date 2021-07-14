import * as React from "react";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {compose} from "recompose";
import {connect} from "react-redux";
import {AnnotatedResponsibilitySet} from "../../../models/AnnotatedResponsibility";
import {Dispatch} from "redux";
import {adminTouchstoneActionCreators} from "../../../actions/adminTouchstoneActionCreators";
import {CommentModal} from "./CommentModal";

export interface ResponsibilitySetCommentModalProps {
    responsibilitySet: AnnotatedResponsibilitySet;
    currentTouchstoneVersion: string;
    addResponsibilitySetComment: (currentTouchstoneVersion: string, responsibilitySet: AnnotatedResponsibilitySet, comment: string) => void;
    setCurrentTouchstoneResponsibilitySet: (responsibilitySet: AnnotatedResponsibilitySet) => void;
}

export class ResponsibilitySetCommentModalComponent extends React.Component<ResponsibilitySetCommentModalProps> {
    constructor(props: ResponsibilitySetCommentModalProps) {
        super(props);
    }

    handleCancel() {
        this.props.setCurrentTouchstoneResponsibilitySet(null);
    }

    handleSubmit(commentText: string) {
        this.props.addResponsibilitySetComment(this.props.currentTouchstoneVersion, this.props.responsibilitySet, commentText);
        this.props.setCurrentTouchstoneResponsibilitySet(null);
    }

    render() {
        return (
            <div>
                {this.props.responsibilitySet &&
                <CommentModal
                    header={`Comment for ${this.props.currentTouchstoneVersion}, ${this.props.responsibilitySet.modelling_group_id}`}
                    comment={this.props.responsibilitySet.comment}
                    handleCancel={this.handleCancel.bind(this)}
                    handleSubmit={this.handleSubmit.bind(this)}
                />
                }
            </div>
        );
    }
}

export const mapStateToProps = (state: AdminAppState): Partial<ResponsibilitySetCommentModalProps> => {
    return {
        responsibilitySet: state.touchstones.currentResponsibilitySet,
        currentTouchstoneVersion: state.touchstones.currentTouchstoneVersion && state.touchstones.currentTouchstoneVersion.id
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<ResponsibilitySetCommentModalProps> => {
    return {
        addResponsibilitySetComment: (currentTouchstoneVersion: string, responsibilitySet, comment: string) =>
            dispatch(adminTouchstoneActionCreators.addResponsibilitySetComment(
                currentTouchstoneVersion,
                responsibilitySet.modelling_group_id,
                comment
            )),
        setCurrentTouchstoneResponsibilitySet: (responsibilitySet: AnnotatedResponsibilitySet) =>
            dispatch(adminTouchstoneActionCreators.setCurrentTouchstoneResponsibilitySet(responsibilitySet))
    };
};

export const ResponsibilitySetCommentModal = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(ResponsibilitySetCommentModalComponent) as React.ComponentClass<Partial<ResponsibilitySetCommentModalProps>>;
