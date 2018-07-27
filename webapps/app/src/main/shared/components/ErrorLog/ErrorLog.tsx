import * as React from 'react';
import { MouseEvent } from "react";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {CommonState} from "../../reducers/CommonState";
import {notificationActionCreators} from "../../actions/notificationActionCreators";

interface ErrorLogProps {
    errors: string[];
    clear: () => void;
}

export class ErrorLogComponent extends React.Component<ErrorLogProps, undefined> {
    clearErrors(e: MouseEvent<HTMLButtonElement>) {
        this.props.clear();
    }

    render() {
        if (this.props.errors.length > 0) {
            const items = this.props.errors.map((error, index) =>
                <li key={index}>{ error }</li>
            );
            return <div className="errors">
                <ul>{items}</ul>
                <button onClick={this.clearErrors.bind(this)} className="clearButton">
                    Clear errors
                </button>
            </div>
        } else {
            return null;
        }
    }
}


export function mapStateToProps(state: CommonState): Partial<ErrorLogProps> {
    return {errors: state.notifications.errors};
}

function mapDispatchToProps(dispatch: Dispatch<CommonState>): Partial<ErrorLogProps> {
    return {clear: () => dispatch(notificationActionCreators.clear("error"))};
}

export const ErrorLog = connect(mapStateToProps, mapDispatchToProps)(ErrorLogComponent);
