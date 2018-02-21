import * as React from "react";
import {NavItem, NavLink, UncontrolledTooltip} from "reactstrap";
import {NavbarCollapsedOnMobile} from "../../../shared/components/NavCollapsedOnMobile";

export class Sidebar extends React.Component<{}, undefined> {

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
                            <UncontrolledTooltip placement="top" target="changelog">
                                Coming soon
                            </UncontrolledTooltip>
                        </NavItem>
                    </ul>
                </NavbarCollapsedOnMobile>
        </div>
    }
}