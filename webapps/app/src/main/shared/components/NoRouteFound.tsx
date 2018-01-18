import * as React from "react";
import { settings } from "../Settings";
import { InternalLink } from "./InternalLink";

import "../styles/common.scss";

export class NoRouteFound {
    static title(): string {
        return "Page not found";
    }

    static render(): JSX.Element {
        const supportEmail = `mailto:${settings.supportContact}`;
        return <div>
            We are sorry, but this page does not exist.
            <div className="gapAbove">
                Here are some options:
                <ul>
                    <li>Click back in your browser to return to the previous page</li>
                    <li>Return to <InternalLink href="/">the main menu</InternalLink></li>
                    <li>If you are sure this page should exist, please <a href={ supportEmail }>let us know</a></li>
                </ul>
            </div>
        </div>;
    }
}