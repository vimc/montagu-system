import * as React from "react";
import { PageWithHeaderAndUserControls } from "./PageWithHeader/PageWithHeaderAndUserControls";

const spinner = require("./RemoteContentComponent/spinner.gif");

export class LoadingPage extends PageWithHeaderAndUserControls<undefined> {
    title(): JSX.Element {
        return <span>Loading...</span>;
    }

    renderPageContent(): JSX.Element {
        return <img src={ spinner } />;
    }
}