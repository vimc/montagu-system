import * as React from "react";
import { Component } from "react";

import { OneTimeButtonProps } from "./OneTimeButton";

export interface TimeBlockerProps extends OneTimeButtonProps {
    enabled?: boolean;
    disableDuration?: number;
    onRef?: (ref: React.Component) => any;
    children?: any;
}

interface TimeBlockerState {
    enabled: boolean;
}

export function OneTimeButtonTimeBlocker <P extends TimeBlockerProps>(
    OneTimeButtonWrapped: ComponentConstructor<OneTimeButtonProps, any>) {
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

        buttonClicked() :void {
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

        componentDidMount() :void {
            this.props.onRef(this);
        }

        componentWillUnmount() :void {
            this.clearTimeoutButtonEnable();
        }

        clearTimeoutButtonEnable() :void {
            if (this.enableTimeoutId) {
                clearTimeout(this.enableTimeoutId);
                this.enableTimeoutId = undefined;
            }
        }

        enable() :void {
            this.setState({
                enabled: true,
            })
            this.clearTimeoutButtonEnable();
        }

        render() :JSX.Element {
            return <OneTimeButtonWrapped
                token={this.props.token}
                refreshToken={this.props.refreshToken}
                enabled={this.props.enabled && this.state.enabled}
                children={this.props.children}
                onClick={this.buttonClicked}
            />;
        }
    }
}
