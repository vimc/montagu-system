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
}

export class SidebarComponent extends React.Component<SidebarProps, undefined> {

    render() {
        return <div className={"sidebar pb-4 pb-md-0"}>
            <NavbarCollapsedOnMobile light className={"pl-0 pr-0 pr-md-4"}>
                <ul className={"list-unstyled mb-0"}>
                    <NavItem>
                        <NavLink href="#" disabled>Report</NavLink>
                        <UncontrolledTooltip placement="top" target="download">
                            Coming soon
                        </UncontrolledTooltip>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" active id="download">Downloads</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" disabled id={"changelog"}>Changelog</NavLink>
                        <UncontrolledTooltip placement="bottom" target="changelog">
                            Coming soon
                        </UncontrolledTooltip>
                    </NavItem>
                </ul>
                <hr/>
                {
                    this.props.ready && this.props.isReviewer && <PublishSwitch/>
                }
            </NavbarCollapsedOnMobile>
        </div>
    }
}

export const mapStateToProps = (state: ReportAppState, props: Partial<SidebarProps>): Partial<SidebarProps> => {
    return {
        ready: !!state.reports.versionDetails,
        isReviewer: state.auth.permissions.indexOf("*/reports.review") > -1,
        published: !!state.reports.versionDetails && state.reports.versionDetails.published
    }
};

export const Sidebar = connect(mapStateToProps)(SidebarComponent);