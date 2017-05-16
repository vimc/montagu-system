import * as React from 'react';
const styles = require("./ErrorLog.css");

interface ErrorLogProps {
    errors: string[];
}

export class ErrorLog extends React.Component<ErrorLogProps, undefined> {
    render() {
        if (this.props.errors.length > 0) {
            const items = this.props.errors.map((error, index) =>
                <li key={ index }>{ error.toString() }</li>
            );
            return <div className={ styles.errors }>
                <ul>{ items }</ul>
            </div>
        } else {
            return null;
        }
    }
}