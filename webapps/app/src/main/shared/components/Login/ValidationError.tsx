import * as React from "react";

interface Props {
    message: string;
}

export class ValidationError extends React.Component<Props, undefined> {
    render() {
        if (typeof this.props.message == "string") {
            return <span className="error">{ this.props.message }</span>;
        } else {
            return null;
        }
    }
}
