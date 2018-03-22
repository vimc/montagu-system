import * as React from "react";
import Toggle from 'react-bootstrap-toggle';
import {connect, Dispatch} from "react-redux";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {UncontrolledTooltip} from "reactstrap";
import {reportActionCreators} from "../../actions/reportActionCreators";

export interface PublicProps {
    name: string;
    version: string;
    published: boolean;
}

export interface Props extends PublicProps {
    publish: (name: string, version: string) => void;
    unpublish: (name: string, version: string) => void;
}

export class PublishSwitchComponent extends React.Component<Props, undefined> {

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

export const mapDispatchToProps = (dispatch: Dispatch<any>): Partial<Props> => {
    return {
        publish: (name: string, version: string) => dispatch(reportActionCreators.publishReport(name, version)),
        unpublish: (name: string, version: string) => dispatch(reportActionCreators.unPublishReport(name, version))
    }
};

export const PublishSwitch = connect((state: ReportAppState, props: PublicProps) => props,
    mapDispatchToProps)(PublishSwitchComponent);