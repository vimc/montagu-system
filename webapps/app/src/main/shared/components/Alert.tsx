import * as React from "react";

interface AlertState {
    show: boolean;
    cssClass: string;
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
            show: props.hasError || props.hasSuccess,
            cssClass: props.hasError ? "alert alert-danger" : "alert alert-success"
        };
    }

    componentDidReceiveProps() {

        this.setState({
            show: this.props.hasError || this.props.hasSuccess,
            cssClass: this.props.hasError ? "alert alert-danger" : "alert alert-success"
        })
    }

    closeAlert() {
        this.setState({
            show: false
        })
    }

    render() {
        if (this.state.show) {
            return <div className={this.state.cssClass}>
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