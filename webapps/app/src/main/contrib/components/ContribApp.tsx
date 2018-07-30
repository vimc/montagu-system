import * as React from "react";
import { connect } from 'react-redux';
import {History} from "history";

import { ErrorLog } from "../../shared/components/ErrorLog/ErrorLog";
import { ContribRouter } from "./ContribRouter";
import { NotificationArea } from "../../shared/components/NotificationArea/NotificationArea";
import {ContribAppState} from "../reducers/contribAppReducers";

interface AppProps {
    loggedIn: boolean,
    history?: History;
}

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

const mapStateToProps = (state: ContribAppState, props: Partial<AppProps>) : Partial<AppProps> => {
    return {
        loggedIn: state.auth.loggedIn,
        history: props.history
    }
};

export const ContribApp = connect(mapStateToProps)(ContribAppComponent);