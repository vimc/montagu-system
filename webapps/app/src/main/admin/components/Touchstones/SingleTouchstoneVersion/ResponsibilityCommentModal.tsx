import * as React from "react";
import {Button, Input, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {compose} from "recompose";
import {connect} from "react-redux";
import {AnnotatedResponsibility} from "../../../models/AnnotatedResponsibility";
import {Dispatch} from "redux";
import {adminTouchstoneActionCreators} from "../../../actions/adminTouchstoneActionCreators";

export interface ResponsibilityCommentModalProps {
    responsibility: AnnotatedResponsibility;
    currentTouchstoneVersion: string;
    addResponsibilityComment: (currentTouchstoneVersion: string, responsibility: AnnotatedResponsibility, comment: string) => void;
    setCurrentTouchstoneResponsibility: (responsibility: AnnotatedResponsibility) => void;
}

export interface ResponsibilityCommentModalState {
    commentText: string
}

export class ResponsibilityCommentModalComponent extends React.Component<ResponsibilityCommentModalProps, ResponsibilityCommentModalState> {
    constructor(props: ResponsibilityCommentModalProps) {
        super(props);
        this.state = {
            commentText: this.props.responsibility && this.props.responsibility.comment ? this.props.responsibility.comment.comment : ""
        };
    }
    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            commentText: event.target.value
        });
    }
    handleCancel() {
        this.props.setCurrentTouchstoneResponsibility(null);
    }
    handleSave() {
        this.props.addResponsibilityComment(this.props.currentTouchstoneVersion, this.props.responsibility, this.state.commentText);
        this.props.setCurrentTouchstoneResponsibility(null);
    }
    componentWillReceiveProps(nextProps: Readonly<ResponsibilityCommentModalProps>) {
        this.setState({
            commentText: nextProps.responsibility && nextProps.responsibility.comment ? nextProps.responsibility.comment.comment : ""
        });
    }
    render() {
        return (
            <div>
                {this.props.responsibility &&
                <Modal isOpen={true} fade={false} centered={true} size="lg">
                    <ModalHeader>
                        Comment for {this.props.currentTouchstoneVersion}, {this.props.responsibility.modellingGroup}, {this.props.responsibility.scenario.description}
                    </ModalHeader>
                    <ModalBody>
                        <Input type="textarea" rows={10} value={this.state.commentText} onChange={this.handleChange.bind(this)}/>
                    </ModalBody>
                    <ModalFooter>
                        {this.props.responsibility.comment &&
                        <span className="text-muted mr-auto">Last updated by {this.props.responsibility.comment.added_by} at {this.props.responsibility.comment.added_on}</span>
                        }
                        <Button color="secondary" onClick={this.handleCancel.bind(this)}>Close</Button>{' '}
                        <Button color="primary" onClick={this.handleSave.bind(this)}>Save changes</Button>
                    </ModalFooter>
                </Modal>
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
