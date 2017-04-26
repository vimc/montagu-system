import * as React from 'react';

const spinner = require("./RemoteContentComponent/spinner.gif");

export class LoadingPage extends React.Component<undefined, undefined> {
    render() {
        return <img src={ spinner } />;
    }
}