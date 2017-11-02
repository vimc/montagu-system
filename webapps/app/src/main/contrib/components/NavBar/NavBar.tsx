import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { ModellingGroup, Touchstone } from "../../../shared/models/Generated";
import { connectToStores } from "../../../shared/alt";
import * as React from "react";
import { InternalLink } from "../../../shared/components/InternalLink";

const styles = require("./NavBar.css");

interface Props {
    group: ModellingGroup;
    touchstone: Touchstone;
}

export class NavBarComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [responsibilityStore];
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
            g = <div className={ styles.chunk }>
                <InternalLink href="/">{ this.props.group.description }</InternalLink>
            </div>;

            if (this.props.touchstone != null) {
                const url = `/${this.props.group.id}/`;
                t = <div className={ styles.chunk }>
                    <InternalLink href={ url }>{ this.props.touchstone.description }</InternalLink>
                </div>;
            }
        }

        return <div className={ styles.navbar }>
            { g }
            { t }
        </div>
    }
}

export const NavBar = connectToStores(NavBarComponent);