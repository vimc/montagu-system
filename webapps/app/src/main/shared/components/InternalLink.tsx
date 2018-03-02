import * as React from "react";
// import { Link } from "simple-react-router";
import { Link } from 'react-router-dom'
import { appSettings } from "../Settings";

interface Props {
    href: string;
    onClick?: React.EventHandler<React.MouseEvent<HTMLAnchorElement>>;
}

export class InternalLink extends React.Component<Props, undefined> {
    render() {
        const url = appSettings.publicPath + this.props.href;
        return <Link to={ url } onClick={ this.props.onClick }>{ this.props.children }</Link>
    }
}