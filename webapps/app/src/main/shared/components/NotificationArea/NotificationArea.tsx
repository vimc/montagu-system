import * as React from "react";
import { CSSTransitionGroup } from "react-transition-group";
import { notificationActions } from "../../actions/NotificationActions";

import "./NotificationArea.scss";
import "../../../shared/styles/transitions.scss";

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
            content = <div className="notifications">
                { message }
                <button className="hideButton"
                        onClick={ this.hideMessage }>
                    X
                </button>
            </div>;
        }
        return <CSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={ 300 }
            transitionLeaveTimeout={ 300 }>
            { content }
        </CSSTransitionGroup>;
    }
}