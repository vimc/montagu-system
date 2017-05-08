import * as React from 'react';
import {Link} from "simple-react-router";

export class ButtonLink extends Link {
    onClick = (event: any) => {
        const href = (this.refs.link as any).getAttribute("href");

        if (this.props.onClick){
            this.props.onClick(event)
        }

        if (event.isDefaultPrevented() || event.isPropagationStopped()) return

        if (!this.props.externalLink && !event.ctrlKey && !event.metaKey && !event.shiftKey && href.startsWith(location.origin)){
            event.preventDefault()
            this.context.redirectTo(href, !!this.props.replace)
        }
    };

    render() {
        const props = Object.assign({}, this.props);
        delete props.externalLink;
        props.href = props.href || '';
        props.onClick = this.onClick;
        return <button ref="link" {...props}>{props.children}</button>;
    }
}