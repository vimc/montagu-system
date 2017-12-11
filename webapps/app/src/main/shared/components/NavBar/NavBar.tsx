import {NavState, navStore} from "../../stores/NavStore";
import * as React from 'react';
import {connectToStores} from "../../alt";
import {InternalLink} from "../InternalLink";
import {Breadcrumb} from "../../models/Breadcrumb";

import "./NavBar.scss";

interface Props {
    crumbs: Breadcrumb[];
}

export class NavBarComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [navStore];
    }

    static getPropsFromStores(): Props {
        return {
            crumbs: navStore.getState().crumbs
        };
    }

    private makeLink(crumb: Breadcrumb): JSX.Element {
        if (crumb.url != null) {
            return <InternalLink href={crumb.url}>
                {crumb.name}
            </InternalLink>;
        } else {
            return <span>{crumb.name}</span>;
        }
    }

    render(): JSX.Element {
        return(
            <div className="montagu-navbar">
            { this.props.crumbs.map(c =>
                <div className="montagu-navbar__chunk" key={c.url}>
                    {this.makeLink(c)}
                </div>
            ) }
            </div>
        );
    }
}

export const NavBar = connectToStores(NavBarComponent);