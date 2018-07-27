import * as React from "react";
import {CSSTransitionGroup} from "react-transition-group";
import {CommonState} from "../../reducers/CommonState";
import {Dispatch} from "redux";
import {notificationActionCreators} from "../../actions/notificationActionCreators";
import {connect} from "react-redux";

interface Props {
    infoMessages: string[];
    clear: () => void;
}

export class NotificationAreaComponent extends React.Component<Props, undefined> {
    hideMessage(e: React.MouseEvent<HTMLButtonElement>) {
        this.props.clear();
    }

    render() {
        let content = null;
        if (this.props.infoMessages.length > 0) {
            const message = this.props.infoMessages[0];
            content = <div className="notifications">
                {message}
                <button className="hideButton"
                        onClick={this.hideMessage.bind(this)}>
                    X
                </button>
            </div>;
        }
        return <CSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>
            {content}
        </CSSTransitionGroup>;
    }
}

function mapStateToProps(state: CommonState): Partial<Props> {
    return {infoMessages: state.notifications.infoMessages};
}

function mapDispatchToProps(dispatch: Dispatch<CommonState>): Partial<Props> {
    return {clear: () => dispatch(notificationActionCreators.clear("info"))};
}

export const NotificationArea = connect(mapStateToProps, mapDispatchToProps)(NotificationAreaComponent);