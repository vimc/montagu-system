import * as React from "react";
import { PageWithHeader } from "./PageWithHeader/PageWithHeader";

const spinner = require("./RemoteContentComponent/spinner.gif");

export class LoadingPage extends PageWithHeader<undefined> {
    title(): JSX.Element {
        return <span>Loading...</span>;
    }

    renderPageContent(): JSX.Element {
        return <img src={ spinner } />;
    }
}