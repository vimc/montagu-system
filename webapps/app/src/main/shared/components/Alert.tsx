import * as React from "react";

interface AlertState {
    show: boolean;
}

interface AlertProps {
    hasError: boolean;
    hasSuccess: boolean;
    message: string;
}

export class Alert extends React.Component<AlertProps, AlertState> {

    constructor(props: AlertProps) {
        super(props);

        this.state = {
            show: props.hasError || props.hasSuccess
        };
    }

    componentWillReceiveProps(nextProps: AlertProps) {
        this.setState({
            show: nextProps.hasError || nextProps.hasSuccess
        })
    }

    closeAlert() {
        this.setState({
            show: false
        })
    }

    render() {
        const cssClass = this.props.hasError ? "alert alert-danger" : "alert alert-success";
        if (this.state.show) {
            return <div className={cssClass}>
                <button type="button" style={{"outline": "none"}} className="close"
                        onClick={this.closeAlert.bind(this)}>
                    <span>&times;</span>
                </button>
                <span data-role={"alert-message"}>
                {this.props.message}
                </span>
            </div>
        }
        else {
            return null
        }

    }
}