import * as React from "react";
import { settings } from "../Settings";
import { Link } from "simple-react-router";

const styles = require("../styles/common.css");

export class NoRouteFound {
    static title(): JSX.Element {
        return <span>Page not found</span>;
    }

    static renderPageContent(): JSX.Element {
        const supportEmail = `mailto:${settings.supportContact}`;
        return <div>
            We are sorry, but this page does not exist.
            <div className={ styles.gapAbove }>
                Here are some options:
                <ul>
                    <li>Click back in your browser to return to the previous page</li>
                    <li>Return to <Link href="/">the main menu</Link></li>
                    <li>If you are sure this page should exist, please <a href={ supportEmail }>let us know</a></li>
                </ul>
            </div>
        </div>;
    }
}