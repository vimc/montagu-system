import * as React from "react";
import Toggle from 'react-bootstrap-toggle';
import {connect, Dispatch} from "react-redux";
import {reportsActions} from "../../actions/reportsActions";
import {ReportAppState} from "../../reducers/reportAppReducers";

interface Props {
    name: string;
    version: string;
    published: boolean;
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
        return <div className="pl-3 pt-3"><Toggle
            onClick={this.onToggle}
            on={<span>Published</span>}
            off={<span>Internal</span>}
            size={"lg"}
            offstyle="internal"
            onstyle={"published"}
            active={this.props.published}
        />
        </div>
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<any>): Partial<Props> => {
    return {
        publish: (name: string, version: string) => dispatch(reportsActions.publishReport(name, version)),
        unpublish: (name: string, version: string) => dispatch(reportsActions.publishReport(name, version))
    }
};

export const PublishSwitch = connect(
    (state: ReportAppState, props: Partial<Props>) => props,
    mapDispatchToProps)(PublishSwitchComponent);