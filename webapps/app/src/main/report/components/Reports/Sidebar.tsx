import * as React from "react";
import {Collapse, Navbar, NavbarToggler, NavItem, NavLink, UncontrolledTooltip} from "reactstrap";

import "../../../shared/styles/common.scss";
import "../../styles/reports.scss";
import {ReportVersionSwitcher} from "./ReportVersionSwitcher";

interface SidebarState {
    isOpen: boolean
}

export class Sidebar extends React.Component<any, SidebarState> {

    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return <div className={"sidebar pb-4 pb-sm-0"}>
            <Navbar light className={"pl-0"}>
                <NavbarToggler onClick={this.toggle} className={"d-sm-none"}/>
                <Collapse isOpen={this.state.isOpen} navbar className={"d-md-block mt-4 mt-sm-0"}>
                    <ul className={"list-unstyled mb-0"}>
                        <NavItem>
                            <NavLink href="#" active>Report</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#" disabled id="download">Downloads</NavLink>
                            <UncontrolledTooltip placement="top" target="download">
                                Coming soon
                            </UncontrolledTooltip>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#" disabled id={"changelog"}>Changelog</NavLink>
                            <UncontrolledTooltip placement="top" target="changelog">
                                Coming soon
                            </UncontrolledTooltip>
                        </NavItem>
                    </ul>
                </Collapse>
            </Navbar>
        </div>
    }
}