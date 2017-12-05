import * as React from "react";
import { Component } from "react";

import { OneTimeButtonProps } from "./OneTimeButton";

interface TimeBlockerProps extends OneTimeButtonProps {
    enabled?: boolean;
    disableDuration?: number;
    onRef?: (ref: React.Component) => any;
}

interface TimeBlockerState {
    enabled: boolean;
}

export function OneTimeButtonTimeBlocker <P extends TimeBlockerProps>(
    WrappedComponent: new () => React.Component<any, any> ) {
        return class ButtonTimeBlockerWrapper extends React.Component<TimeBlockerProps, TimeBlockerState> {

        disableDuration: number;
        enableTimeoutId: any;

        constructor(props?: TimeBlockerProps) {
            super(props);
            this.state = {
                enabled: true,
            };
            this.buttonClicked = this.buttonClicked.bind(this);
            this.disableDuration = this.props.disableDuration
                ? this.props.disableDuration
                : 5000;
        }

        buttonClicked() {
            setTimeout(() => {
                this.setState({
                    enabled: false,
                })
            });

            this.enableTimeoutId = setTimeout(() => {
                this.setState({
                    enabled: true,
                })
            }, this.disableDuration);
        }

        componentDidMount() {
            this.props.onRef(this);
        }

        componentWillUnmount () {
            this.clearTimeoutButtonEnable();
        }

        clearTimeoutButtonEnable(){
            if (this.enableTimeoutId) {
                clearTimeout(this.enableTimeoutId);
                this.enableTimeoutId = undefined;
            }
        }

        enableDownloadButton(){
            this.setState({
                enabled: true,
            })
            this.clearTimeoutButtonEnable();
        }

        render() {
            return <WrappedComponent
                token={this.props.token}
                refreshToken={this.props.refreshToken}
                enabled={this.props.enabled && this.state.enabled}
                children={this.props.children}
                onClick={this.buttonClicked}
            />;
        }
    }
}
