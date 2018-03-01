import * as React from "react";
import {Collapse, NavbarToggler, Navbar} from "reactstrap";

export interface CollapseState {
    isOpen: boolean
}

export interface NavProps{
    light: boolean;
    className: string;
}

export class NavbarCollapsedOnMobile extends React.Component<NavProps, CollapseState> {

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
        return <Navbar light={this.props.light} className={this.props.className}>
            <NavbarToggler onClick={this.toggle} className={"d-md-none"}/>
            <Collapse isOpen={this.state.isOpen}
                      navbar
                      className={"d-md-block mt-4 mt-md-0"}>
                {/* the d-md-block class here enforces that this collapsible content is always open
                     on devices above the medium size breakpoint */}
                {this.props.children}
            </Collapse>
        </Navbar>
    }
}