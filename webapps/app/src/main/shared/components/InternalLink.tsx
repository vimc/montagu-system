import * as React from "react";
import { Link } from 'react-router-dom';
import { appSettings } from "../Settings";

interface Props {
    href: string;
    onClick?: React.EventHandler<React.MouseEvent<HTMLAnchorElement>>;
}

export class InternalLink extends React.Component<Props, undefined> {
    static contextTypes = {
        router: React.PropTypes.object
    }
    render() {
        const url = appSettings.publicPath + this.props.href;
        if (this.context.router) {
            return <Link to={url} onClick={this.props.onClick}>{this.props.children}</Link>
        } else {
            return <a href={url} onClick={this.props.onClick}>{this.props.children}</a>
        }
    }
}