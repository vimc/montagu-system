import * as React from "react";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {compose} from "recompose";
import {connect} from "react-redux";
import {AnnotatedResponsibility} from "../../../models/AnnotatedResponsibility";
import {Dispatch} from "redux";
import {adminTouchstoneActionCreators} from "../../../actions/adminTouchstoneActionCreators";
import {CommentModal} from "./CommentModal";

export interface ResponsibilityCommentModalProps {
    responsibility: AnnotatedResponsibility;
    currentTouchstoneVersion: string;
    addResponsibilityComment: (currentTouchstoneVersion: string, responsibility: AnnotatedResponsibility, comment: string) => void;
    setCurrentTouchstoneResponsibility: (responsibility: AnnotatedResponsibility) => void;
}

export class ResponsibilityCommentModalComponent extends React.Component<ResponsibilityCommentModalProps> {
    constructor(props: ResponsibilityCommentModalProps) {
        super(props);
    }

    handleCancel() {
        this.props.setCurrentTouchstoneResponsibility(null);
    }

    handleSubmit(commentText: string) {
        this.props.addResponsibilityComment(this.props.currentTouchstoneVersion, this.props.responsibility, commentText);
        this.props.setCurrentTouchstoneResponsibility(null);
    }

    render() {
        return (
            <div>
                {this.props.responsibility &&
                <CommentModal
                    header={`Comment for ${this.props.currentTouchstoneVersion}, ${this.props.responsibility.modellingGroup}, ${this.props.responsibility.scenario.description}`}
                    comment={this.props.responsibility.comment}
                    handleCancel={this.handleCancel.bind(this)}
                    handleSubmit={this.handleSubmit.bind(this)}
                />
                }
            </div>
        );
    }
}

export const mapStateToProps = (state: AdminAppState): Partial<ResponsibilityCommentModalProps> => {
    return {
        responsibility: state.touchstones.currentResponsibility,
        currentTouchstoneVersion: state.touchstones.currentTouchstoneVersion && state.touchstones.currentTouchstoneVersion.id
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<ResponsibilityCommentModalProps> => {
    return {
        addResponsibilityComment: (currentTouchstoneVersion: string, responsibility: AnnotatedResponsibility, comment: string) =>
            dispatch(adminTouchstoneActionCreators.addResponsibilityComment(
                currentTouchstoneVersion,
                responsibility.modellingGroup,
                responsibility.scenario.id,
                comment
            )),
        setCurrentTouchstoneResponsibility: (responsibility: AnnotatedResponsibility) =>
            dispatch(adminTouchstoneActionCreators.setCurrentTouchstoneResponsibility(responsibility))
    };
};

export const ResponsibilityCommentModal = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(ResponsibilityCommentModalComponent) as React.ComponentClass<Partial<ResponsibilityCommentModalProps>>;
