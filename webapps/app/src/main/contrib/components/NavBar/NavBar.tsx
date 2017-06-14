import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { ModellingGroup, Touchstone } from "../../models/Generated";
import { connectToStores } from "../../../shared/alt";
import * as React from "react";
import { Link } from "simple-react-router";

const styles = require("./NavBar.css");

interface Props {
    group: ModellingGroup;
    touchstone: Touchstone;
}

export class NavBarComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [ responsibilityStore ];
    }
    static getPropsFromStores() {
        const state = responsibilityStore.getState();
        return {
            group: state.currentModellingGroup,
            touchstone: state.currentTouchstone
        };
    }

    render() {
        let g = null;
        let t = null;

        if (this.props.group != null) {
            g = <div className={ styles.chunk }>{ this.props.group.description }</div>;
        }
        if (this.props.touchstone != null) {
            t = <div className={ styles.chunk }>{ this.props.touchstone.description }</div>;
        }

        return <div className={ styles.navbar }>
            { g }
            { t }
            <Link href="/">Change</Link>
        </div>
    }
}

export const NavBar = connectToStores(NavBarComponent);