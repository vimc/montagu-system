import * as React from "react";
import {NavItem, NavLink, UncontrolledTooltip} from "reactstrap";
import {NavbarCollapsedOnMobile} from "../../../shared/components/NavCollapsedOnMobile";
import {PublishSwitch} from "./PublishSwitch";
import {ReportVersionSwitcher} from "./ReportVersionSwitcher";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {connect} from "react-redux";

export interface PublicProps {
    onChangeVersion: (version: string) => any;
}

export interface SidebarProps extends PublicProps {
    report: string;
    version: string;
    ready: boolean;
    isReviewer: boolean;
    published: boolean;
    allVersions: string[]
}

export const SidebarComponent = (props: SidebarProps) => {

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
            <div className={"pl-3"}>
                {props.ready && <ReportVersionSwitcher
                    currentVersion={props.version}
                    versions={props.allVersions}
                    onChangeVersion={props.onChangeVersion}
                />}
                {
                    props.ready && props.isReviewer &&
                    <PublishSwitch name={props.report}
                                   version={props.version}
                                   published={props.published}/>
                }
            </div>
        </NavbarCollapsedOnMobile>
    </div>

};

export const mapStateToProps = (state: ReportAppState, props: PublicProps): SidebarProps => {
    const ready = !!state.reports.versionDetails && !!state.reports.versions;

    if (!ready) {
        return {
            ready: false,
            isReviewer: false,
            published: false,
            report: "",
            version: "",
            allVersions: [],
            onChangeVersion: props.onChangeVersion
        }
    }
    else {
        const versionDetails = state.reports.versionDetails;
        return {
            ready: true,
            isReviewer: state.auth.permissions.indexOf("*/reports.review") > -1,
            published: versionDetails.published,
            allVersions: state.reports.versions,
            report: versionDetails.name,
            version: versionDetails.id,
            onChangeVersion: props.onChangeVersion
        }
    }
};

export const Sidebar = connect(mapStateToProps)(SidebarComponent);