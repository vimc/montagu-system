import * as React from "react";
import {NavItem, NavLink, UncontrolledTooltip} from "reactstrap";
import {NavbarCollapsedOnMobile} from "../../../shared/components/NavCollapsedOnMobile";
import {SidebarAdmin} from "./SidebarAdmin";

export enum ReportTabEnum {
    DOWNLOAD,
    REPORT,
    CHANGELOG
}

export const sidebarHashToTab = (hash: string): ReportTabEnum => {
    switch (hash) {
        case "#downloads":
            return ReportTabEnum.DOWNLOAD;
        case "#changelog":
            return ReportTabEnum.CHANGELOG;
        case "#report":
        default:
            return ReportTabEnum.REPORT;
    }
};

export interface PublicProps {
    onChangeVersion: (version: string) => any;
    active: ReportTabEnum;
}

export const Sidebar = (props: PublicProps) => {

    return <div className={"sidebar pb-4 pb-md-0"}>
        <NavbarCollapsedOnMobile light className={"pl-0 pr-0 pr-md-4"}>
            <ul className={"list-unstyled mb-0"}>
                <NavItem>
                    <NavLink href="#report"
                             active={props.active == ReportTabEnum.REPORT}>Report</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="#downloads"
                             active={props.active == ReportTabEnum.DOWNLOAD}>Downloads</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="#changelog" disabled id={"changelog"}>Changelog</NavLink>
                    <UncontrolledTooltip placement="bottom" target="changelog">
                        Coming soon
                    </UncontrolledTooltip>
                </NavItem>
            </ul>
            <hr/>
            <div className={"pl-3"}>
               <SidebarAdmin onChangeVersion={props.onChangeVersion}/>
            </div>
        </NavbarCollapsedOnMobile>
    </div>
};