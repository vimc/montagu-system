import * as React from "react";
import { CSSTransitionGroup } from "react-transition-group";
import { notificationActions } from "../../actions/NotificationActions";

const styles = require("./NotificationArea.css");
const transitions = require('../../../shared/styles/transitions.css');

interface Props {
    notifications: string[];
}

export class NotificationArea extends React.Component<Props, undefined> {
    hideMessage(e: React.MouseEvent<HTMLButtonElement>) {
        notificationActions.clear("info");
    }

    render() {
        let content = null;
        if (this.props.notifications.length > 0) {
            const message = this.props.notifications[0];
            content = <div className={ styles.notifications }>
                { message }
                <button className={ styles.hideButton }
                        onClick={ this.hideMessage }>
                    X
                </button>
            </div>;
        }
        return <CSSTransitionGroup
            transitionName={ transitions.fade }
            transitionEnterTimeout={ 300 }
            transitionLeaveTimeout={ 300 }>
            { content }
        </CSSTransitionGroup>;
    }
}