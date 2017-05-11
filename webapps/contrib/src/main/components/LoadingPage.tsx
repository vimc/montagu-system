import * as React from "react";
import { PageProperties, PageWithHeader } from "./PageWithHeader/PageWithHeader";

const spinner = require("./RemoteContentComponent/spinner.gif");
const messages = require("../styles/messages.css");

interface Props extends PageProperties<undefined> {
    errorMessage: string;
}

export class LoadingPage extends PageWithHeader<undefined, Props, undefined> {
    title(): JSX.Element {
        if (this.props.errorMessage) {
            return <span>Error</span>;
        } else {
            return <span>Loading...</span>;
        }
    }

    renderPageContent(): JSX.Element {
        if (this.props.errorMessage) {
            return <span className={ messages.errorMessage }>
                An error occurred: { this.props.errorMessage }
            </span>;
        } else {
            return <img src={ spinner } />;
        }
    }
}