import * as React from "react";
import Toggle from 'react-bootstrap-toggle';
import {connect, Dispatch} from "react-redux";
import * as ReactDOM from "react-dom";

import {ReportAppState} from "../../reducers/reportAppReducers";
import {UncontrolledTooltip} from "reactstrap";
import {reportActionCreators} from "../../actionCreators/reportActionCreators";

export interface PublicProps {
    name: string;
    version: string;
    published: boolean;
}

export interface PublishSwitchProps extends PublicProps {
    publish: (name: string, version: string) => void;
    unpublish: (name: string, version: string) => void;
}

interface PublishSwitchState {
    showModal: boolean
}

export interface PublishSwitchModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    publishVerb: string;
}

export class PublishSwitchComponent extends React.Component<PublishSwitchProps, PublishSwitchState> {

    constructor() {
        super();
        this.state = { showModal: false };
        this.onToggle = this.onToggle.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    showModal() {
        this.setState({ showModal: true });
    }

    hideModal = () => {
        this.setState({ showModal: false });
    };

    onToggle() {
        this.showModal();
    }

    onConfirm() {
        this.hideModal();
        if (this.props.published) {
            this.props.unpublish(this.props.name, this.props.version)
        }
        else {
            this.props.publish(this.props.name, this.props.version)
        }
    }

    Modal = (props: PublishSwitchModalProps) => {
        const displayClassName = props.show ? "modal-background modal-show" : "modal-background modal-hide";
        return (
            <div className={displayClassName}>
                <div className="modal-main px-3 py-3">
                    <div className={"mb-2 font-weight-bold"}>{`Confirm ${props.publishVerb}`}</div>
                    <div className={"mb-2"}>{`Are you sure you want to ${props.publishVerb} this report version?`}</div>
                    <div className={"modal-buttons"}>
                        <button className={"btn btn-primary mr-3"} onClick={props.onConfirm}>Yes</button>
                        <button className={"btn btn-default"} onClick={props.onClose}>No</button>
                    </div>
                </div>
            </div>
        );
    }

    getPublishVerb(){
        return this.props.published ? 'unpublish' : 'publish'
    }

    render() {
        return <div className="pt-3" id={"publish"}>
                <this.Modal show={this.state.showModal} publishVerb={this.getPublishVerb()} onClose={this.hideModal}
                    onConfirm={this.onConfirm}/>
                <Toggle
                    onClick={this.onToggle}
                    on={<span>Published</span>}
                    off={<span>Internal</span>}
                    offstyle="internal"
                    onstyle={"published"}
                    active={this.props.published}/>
                <UncontrolledTooltip target={"publish"}>
                    Click here to publish or unpublish this report version.
                </UncontrolledTooltip>
            </div>
    }
}

const mapStateToProps = (state: ReportAppState, props: PublicProps): Partial<PublishSwitchProps> => {
    return {
        name: props.name,
        version: props.version,
        published: props.published
    };
};

export const mapDispatchToProps = (dispatch: Dispatch<ReportAppState>): Partial<PublishSwitchProps> => {
    return {
        publish: (name: string, version: string) => dispatch(reportActionCreators.publishReport(name, version)),
        unpublish: (name: string, version: string) => dispatch(reportActionCreators.unPublishReport(name, version))
    }
};

export const PublishSwitch = connect(mapStateToProps, mapDispatchToProps)(PublishSwitchComponent);