import * as React from 'react';
import { notificationActions } from "../../actions/NotificationActions";
import { MouseEvent } from "react";

interface ErrorLogProps {
    errors: string[];
}

export class ErrorLog extends React.Component<ErrorLogProps, undefined> {
    clearErrors(e: MouseEvent<HTMLButtonElement>) {
        notificationActions.clear("error");
    }

    render() {
        if (this.props.errors.length > 0) {
            const items = this.props.errors.map((error, index) =>
                <li key={index}>{ error }</li>
            );
            return <div className="errors">
                <ul>{items}</ul>
                <button onClick={ this.clearErrors } className="clearButton">
                    Clear errors
                </button>
            </div>
        } else {
            return null;
        }
    }
}