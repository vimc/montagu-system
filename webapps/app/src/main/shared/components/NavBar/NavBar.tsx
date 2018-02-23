import {navStore} from "../../stores/NavStore";
import * as React from 'react';
import {connectToStores} from "../../alt";
import {InternalLink} from "../InternalLink";
import {Breadcrumb} from "../../models/Breadcrumb";

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

    render(): JSX.Element {
        return (
            <div className="montagu-navbar">
                <div className={"pl-md-1"}></div>
                {this.props.crumbs.map(c =>
                    <div className="montagu-navbar__chunk" key={c.url}>
                        {this.makeLink(c)}
                    </div>
                )}
            </div>
        );
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
}

export const NavBar = connectToStores(NavBarComponent);