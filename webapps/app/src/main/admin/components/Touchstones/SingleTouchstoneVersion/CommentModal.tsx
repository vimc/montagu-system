import * as React from "react";
import {Button, Input, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ResponsibilityComment} from "../../../../shared/models/Generated";

export interface CommentModalProps {
    header: string;
    comment?: ResponsibilityComment;
    handleCancel: () => void;
    handleSubmit: (commentText: string) => void;
}

export interface CommentModalState {
    commentText: string
}

export class CommentModal extends React.Component<CommentModalProps, CommentModalState> {
    constructor(props: CommentModalProps) {
        super(props);
        this.state = {
            commentText: this.props.comment ? this.props.comment.comment : ""
        };
    }
    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            commentText: event.target.value
        });
    }
    moveCaretToEnd(e: React.FocusEvent<HTMLInputElement>) {
        const value = e.target.value;
        e.target.value = "";
        e.target.value = value;
    }
    componentWillReceiveProps(nextProps: Readonly<CommentModalProps>) {
        this.setState({
            commentText: nextProps.comment ? nextProps.comment.comment : ""
        });
    }
    render() {
        return (
            <div>
                <Modal isOpen={true} fade={false} centered={true} autoFocus={false} size="lg">
                    <ModalHeader>
                        {this.props.header}
                    </ModalHeader>
                    <ModalBody>
                        <Input type="textarea" rows={10} value={this.state.commentText} onChange={this.handleChange.bind(this)} autoFocus onFocus={this.moveCaretToEnd}/>
                    </ModalBody>
                    <ModalFooter>
                        {this.props.comment &&
                        <span className="text-muted mr-auto">Last updated by {this.props.comment.added_by} at {this.props.comment.added_on}</span>
                        }
                        <Button color="secondary" onClick={this.props.handleCancel.bind(this)}>Close</Button>{' '}
                        <Button color="primary" onClick={this.props.handleSubmit.bind(this, this.state.commentText)}>Save changes</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
