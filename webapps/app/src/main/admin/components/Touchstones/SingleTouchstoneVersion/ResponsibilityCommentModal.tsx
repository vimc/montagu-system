import * as React from "react";
import {Button, Input, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {compose} from "recompose";
import {connect} from "react-redux";
import {AnnotatedResponsibility} from "../../../models/AnnotatedResponsibility";

export interface ResponsibilityCommentModalProps {
    responsibility: AnnotatedResponsibility;
    currentTouchstoneVersion: string;
    addResponsibilityComment: (currentTouchstoneVersion: string, responsibility: AnnotatedResponsibility, comment: string) => void;
    cancelResponsibilityComment: () => void;
}

export interface ResponsibilityCommentModalState {
    commentText: string
}

export class ResponsibilityCommentModalComponent extends React.Component<ResponsibilityCommentModalProps, ResponsibilityCommentModalState> {
    constructor(props: ResponsibilityCommentModalProps) {
        super(props);
        this.state = {
            commentText: props.responsibility.comment ? props.responsibility.comment.comment : ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            commentText: event.target.value
        });
    }
    handleClick(event: React.FormEvent<HTMLButtonElement>) {
        this.props.addResponsibilityComment(this.props.currentTouchstoneVersion, this.props.responsibility, this.state.commentText);
    }
    render() {
        return (
            <div>
                <Modal isOpen={true} fade={false} centered={true} size="lg">
                    <ModalHeader>
                        Comment for {this.props.currentTouchstoneVersion}, {this.props.responsibility.modellingGroup}, {this.props.responsibility.scenario.description}
                    </ModalHeader>
                    <ModalBody>
                        <Input id="comment" type="textarea" rows={10} value={this.state.commentText} onChange={this.handleChange}/>
                    </ModalBody>
                    <ModalFooter>
                        {this.props.responsibility.comment &&
                        <span className="text-muted mr-auto">Last updated by {this.props.responsibility.comment.added_by} at {this.props.responsibility.comment.added_on}</span>
                        }
                        <Button color="secondary" onClick={this.props.cancelResponsibilityComment}>Close</Button>{' '}
                        <Button color="primary" onClick={this.handleClick}>Save changes</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export const mapStateToProps = (state: AdminAppState): Partial<ResponsibilityCommentModalProps> => {
    return {
        currentTouchstoneVersion: state.touchstones.currentTouchstoneVersion && state.touchstones.currentTouchstoneVersion.id
    }
};

export const ResponsibilityCommentModal = compose(
    connect(mapStateToProps)
)(ResponsibilityCommentModalComponent) as React.ComponentClass<Partial<ResponsibilityCommentModalProps>>;
