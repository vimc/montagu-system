import * as React from "react";
import Toggle from 'react-bootstrap-toggle';
import {connect, Dispatch} from "react-redux";

import {ReportAppState} from "../../reducers/reportAppReducers";
import {UncontrolledTooltip} from "reactstrap";
import {reportActionCreators} from "../../actions/reportActionCreators";

export interface PublishSwitchProps {
    name: string;
    version: string;
    published: boolean;
    publish: (name: string, version: string) => void;
    unpublish: (name: string, version: string) => void;
}

export class PublishSwitchComponent extends React.Component<PublishSwitchProps, undefined> {

    constructor() {
        super();
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle() {
        if (this.props.published) {
            this.props.unpublish(this.props.name, this.props.version)
        }
        else {
            this.props.publish(this.props.name, this.props.version)
        }
    }

    render() {
        return <div className="pt-3" id={"publish"}>
                <Toggle
                    onClick={this.onToggle}
                    on={<span>Published</span>}
                    off={<span>Internal</span>}
                    offstyle="internal"
                    onstyle={"published"}
                    active={this.props.published}/>
                <UncontrolledTooltip target={"publish"}>
                    Publish functionality coming soon</UncontrolledTooltip>
            </div>
    }
}

const mapStateToProps = (state: ReportAppState, props: Partial<PublishSwitchProps>): Partial<PublishSwitchProps> => {
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

export const PublishSwitch = connect(mapStateToProps, mapDispatchToProps)(PublishSwitchComponent) as
    React.ComponentClass<Partial<PublishSwitchProps>>;;