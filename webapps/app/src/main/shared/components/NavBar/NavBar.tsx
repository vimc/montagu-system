import {NavState, navStore} from "../../stores/NavStore";
import * as React from 'react';
import {connectToStores} from "../../alt";
import {InternalLink} from "../InternalLink";

const styles = require("./NavBar.css");

class NavBarComponent extends React.Component<NavState, undefined> {
    static getStores() {
        return [navStore];
    }

    static getPropsFromStores(): NavState {
        return navStore.getState();
    }

    render(): JSX.Element {
        const crumbs = this.props.crumbs.map(c =>
            <div className={styles.chunk} key={c.url}>
                <InternalLink href={c.url}>{c.name}</InternalLink>
            </div>
        );

        return <div className={styles.navbar}>
            {crumbs}
        </div>
    }
}

export const NavBar = connectToStores(NavBarComponent);