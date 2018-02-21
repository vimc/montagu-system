import * as React from "react";
import {NavItem, NavLink, UncontrolledTooltip} from "reactstrap";
import {NavbarCollapsedOnMobile} from "../../../shared/components/NavCollapsedOnMobile";
import {PublishSwitch} from "./PublishSwitch";
import {ReportVersionSwitcher} from "./ReportVersionSwitcher";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {connect} from "react-redux";

export interface SidebarProps {
    report: string;
    version: string;
    ready: boolean;
    isReviewer: boolean;
    published: boolean;
    onChangeVersion: (version: string) => any;
    allVersions: string[]
}

export const SidebarComponent = (props: Partial<SidebarProps>) => {

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
            <hr />
            {
                props.ready && props.isReviewer &&
                <PublishSwitch/>
            }
        </NavbarCollapsedOnMobile>
        <div className={"pl-0 pr-0 pr-md-4"}>
            {props.ready && <ReportVersionSwitcher
                currentVersion={props.version}
                versions={props.allVersions}
                onChangeVersion={props.onChangeVersion}
            />}
        </div>
    </div>
};


export const mapStateToProps = (state: ReportAppState, props: Partial<SidebarProps>): SidebarProps => {
    const ready = !!state.reports.versionDetails;
    const reports = state.reports;
    return {
        ready: ready,
        isReviewer: state.auth.permissions.indexOf("*/reports.review") > -1,
        published: ready && reports.versionDetails.published,
        allVersions: !!reports.versions && reports.versions,
        report: ready && reports.versionDetails.name,
        version: ready && reports.versionDetails.id,
        onChangeVersion: props.onChangeVersion
    }
};

export const Sidebar = connect(mapStateToProps)(SidebarComponent);