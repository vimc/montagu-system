import * as React from "react";
import {Collapse, Navbar, NavbarToggler, NavItem, NavLink, UncontrolledTooltip} from "reactstrap";
import {PublishSwitch} from "./PublishSwitch";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {connect, Dispatch} from "react-redux";
import {reportsActions} from "../../actions/reportsActions";
import {AdminAppState} from "../../../admin/reducers/adminAppReducers";

interface SidebarState {
    isOpen: boolean
}

export interface SidebarProps {
    name: string;
    version: string;
    published: boolean;
    isReviewer: boolean;
}

export class SidebarComponent extends React.Component<SidebarProps, SidebarState> {

    constructor() {
        super();

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
        return <div className={"sidebar pb-4 pb-md-0  pr-md-4"}>
            <Navbar light className={"pl-0 pr-0"}>
                <NavbarToggler onClick={this.toggle} className={"d-md-none"}/>
                <Collapse isOpen={this.state.isOpen} navbar className={"d-md-block mt-4 mt-md-0"}>
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
                </Collapse>
            </Navbar>
            <hr/>
            {
                this.props.isReviewer && <PublishSwitch name={this.props.name}
                                                        version={this.props.version}
                                                        published={this.props.published}/>
            }
        </div>
    }
}

export const mapStateToProps = (state: ReportAppState, props: Partial<SidebarProps>): Partial<SidebarProps> => {
    // TOOD once versions are in the app state, get publish status from state
    return {
        isReviewer: state.auth.permissions.indexOf("*/reports.review") > -1,
        published: true
    }
};

export const Sidebar = connect(mapStateToProps)(SidebarComponent);