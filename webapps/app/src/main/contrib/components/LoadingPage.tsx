import * as React from "react";
import { ContribPageWithHeader } from "./PageWithHeader/ContribPageWithHeader";

const spinner = require("./RemoteContentComponent/spinner.gif");

export class LoadingPage extends ContribPageWithHeader<undefined> {
    title(): JSX.Element {
        return <span>Loading...</span>;
    }

    renderPageContent(): JSX.Element {
        return <img src={ spinner } />;
    }
}