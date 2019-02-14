import * as React from "react";
import Toggle from 'react-bootstrap-toggle';
import {connect, Dispatch} from "react-redux";

import {ReportAppState} from "../../reducers/reportAppReducers";
import {reportActionCreators} from "../../actionCreators/reportActionCreators";
import {ConfirmModal} from "../../../shared/components/ConfirmModal";

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

    getPublishVerb(){
        return this.props.published ? 'unpublish' : 'publish';
    }

    render() {
        return <div className="pt-3" id={"publish"}>
                <ConfirmModal show={this.state.showModal} title={`Confirm ${this.getPublishVerb()}`}
                    text={`Are you sure you want to ${this.getPublishVerb()} this report version?`}
                    onClose={this.hideModal}
                    onConfirm={this.onConfirm}/>
                <Toggle
                    onClick={this.onToggle}
                    on={<span>Published</span>}
                    off={<span>Internal</span>}
                    offstyle="internal"
                    onstyle={"published"}
                    active={this.props.published}/>
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