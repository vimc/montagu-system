import * as React from "react";
import {NavItem, NavLink, UncontrolledTooltip} from "reactstrap";
import {NavbarCollapsedOnMobile} from "../../../shared/components/NavCollapsedOnMobile";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {connect} from "react-redux";
import {PublishSwitch} from "./PublishSwitch";

export class SidebarProps {
    name: string;
    version: string;
    ready: boolean;
    isReviewer: boolean;
    published: boolean;
    active: ReportTabEnum;
}

export class TabProps {
    active: ReportTabEnum;
}


export enum ReportTabEnum {
    DOWNLOAD,
    REPORT,
    CHANGELOG
}

export class SidebarComponent extends React.Component<SidebarProps, undefined> {


    render() {

        return <div className={"sidebar pb-4 pb-md-0"}>
            <NavbarCollapsedOnMobile light className={"pl-0 pr-0 pr-md-4"}>
                <ul className={"list-unstyled mb-0"}>
                    <NavItem>
                        <NavLink href="#report"
                                 active={this.props.active == ReportTabEnum.REPORT}
                                 id="report">Report</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#downloads"
                                 active={this.props.active == ReportTabEnum.DOWNLOAD}
                                 id="downloads">Downloads</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#changelog" disabled id={"changelog"}>Changelog</NavLink>
                        <UncontrolledTooltip placement="bottom" target="changelog">
                            Coming soon
                        </UncontrolledTooltip>
                    </NavItem>
                </ul>
                <hr/>
                {
                    this.props.ready && this.props.isReviewer &&
                    <PublishSwitch name={this.props.name}
                                   version={this.props.version}
                                   published={this.props.published}/>
                }
            </NavbarCollapsedOnMobile>
        </div>
    }
}

export const mapStateToProps = (state: ReportAppState, props: TabProps): SidebarProps => {
    const ready = !!state.reports.versionDetails;

    if (!ready) {
        return {
            ready: false,
            isReviewer: false,
            published: false,
            name: "",
            version: "",
            active: props.active
        }
    }
    else {
        const versionDetails = state.reports.versionDetails;
        return {
            ready: true,
            isReviewer: state.auth.permissions.indexOf("*/reports.review") > -1,
            published: versionDetails.published,
            name: versionDetails.name,
            version: versionDetails.id,
            active: props.active
        }
    }
};

export const Sidebar = connect(mapStateToProps)(SidebarComponent);