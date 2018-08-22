import * as React from "react";
import {connect} from 'react-redux';

import {ErrorLog} from "../../shared/components/ErrorLog/ErrorLog";
import {ContribRouter} from "./ContribRouter";
import {NotificationArea} from "../../shared/components/NotificationArea/NotificationArea";
import {AppProps, mapStateToAppProps} from "../../shared/components/App";

export class ContribAppComponent extends React.Component<AppProps, undefined> {
    render() {
        return <div>
            <ContribRouter
                history={this.props.history}
                loggedIn={ this.props.loggedIn }
            />

            <NotificationArea />
            <ErrorLog />
        </div>;
    }
}

export const ContribApp = connect(mapStateToAppProps)(ContribAppComponent);